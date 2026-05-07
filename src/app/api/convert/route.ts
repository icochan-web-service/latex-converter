import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash-lite"; // 503時のフォールバック

async function callGemini(
  base64: string,
  mimeType: string,
  model: string,
  prompt: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const geminiModel = genAI.getGenerativeModel({ model });
  const result = await geminiModel.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        data: base64,
      },
    },
  ]);
  return result.response.text().trim();
}

async function callGeminiWithRetry(
  base64: string,
  mimeType: string,
  model: string,
  prompt: string,
  maxRetries: number
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGemini(base64, mimeType, model, prompt);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;

      if ((status === 429 || status === 503) && attempt < maxRetries) {
        const baseWait = status === 503 ? 5000 : 3000;
        const jitter = Math.random() * 1000;
        const waitMs = baseWait * attempt + jitter;
        console.warn(
          `[api/convert] ${model} ${status}エラー。`,
          `${Math.round(waitMs)}ms後にリトライ (${attempt}/${maxRetries})`
        );
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      throw err;
    }
  }
  throw new Error(`${model}: 最大リトライ回数超過`);
}

async function callGeminiWithFallback(
  base64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  // まずプライマリモデルで試行（リトライ2回）
  try {
    return await callGeminiWithRetry(base64, mimeType, PRIMARY_MODEL, prompt, 2);
  } catch (primaryErr: unknown) {
    const status = (primaryErr as { status?: number })?.status;

    // 503の場合のみフォールバック
    if (status === 503) {
      console.warn(
        "[api/convert] プライマリモデル503。",
        `${FALLBACK_MODEL}にフォールバックします`
      );
      return await callGeminiWithRetry(base64, mimeType, FALLBACK_MODEL, prompt, 3);
    }

    throw primaryErr;
  }
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  basic: 500,
  pro: 5000,
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const STRICT_RULES = `
【最重要・絶対に守ること】
あなたの仕事は「画像に書かれていることをそのままLaTeXに書き写すこと」だけです。
計算・解答・補完・推論は一切禁止です。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
絶対に出力してはいけないもの（1つでも含めたら失敗）：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ \\documentclass
❌ \\usepackage
❌ \\begin{document}
❌ \\end{document}
❌ \`\`\`latex または \`\`\` （コードブロック記号）
❌ 「以下がLaTeXです」などの説明文
❌ 数式の計算過程・解答（画像に書かれていない内容）
❌ $$...$$（別立て数式にはalign*環境のみ使用）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
数式変換の厳守事項：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 文中数式：$...$
✅ 別立て数式：\\begin{align*}...\\end{align*} のみ
✅ 負号（マイナス）は必ず確認して出力する
✅ 係数（j/N²のjなど）を省略しない
✅ 行列の要素は行・列を正確に読み取る

NGの例：
  誤: f(x,y) = \\exp\\left(\\frac{x^2+y^2}{2}\\right)
  正: f(x,y) = \\exp\\left(-\\frac{x^2+y^2}{2}\\right)  ← 負号を必ず入れる

  誤: T_N = \\sum \\frac{1}{N^2}  ← jが抜けている
  正: T_N = \\sum \\frac{j}{N^2}  ← 係数を正確に

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
レイアウト読み取りルール：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 2段組レイアウト：左カラムを最後まで読んでから右カラムへ
✅ 段をまたいで横に読まない
✅ ページ番号・ヘッダー・フッターは出力しない
✅ \\subsection*{} などのバックスラッシュを省略しない

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
図・グラフのルール：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
図・グラフが含まれる場合は以下の形式で日本語説明を出力する：
\\begin{figure}[h]
\\centering
% [図の説明：図の内容を日本語で詳細に説明。軸・ラベル・矢印・形状・数値をすべて含む]
\\caption{キャプションをそのまま転記}
\\end{figure}

✅ \\includegraphics は使わない
✅ 図の説明を省略しない

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
構造・その他：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ section*, subsection*, subsubsection* で構造を表現
✅ 空欄・□・(ア)などは \\boxed{\\text{(ア)}} で出力（解答しない）
✅ 日本語テキストはそのまま地の文として出力
✅ ∴ ∵ などの記号はそのまま使う
✅ 画像に存在しない内容を一切追加しない

出力前の自己チェック：
□ \\documentclass や \`\`\` が含まれていないか？
□ 画像にない計算・解答を追加していないか？
□ 負号・係数・行列要素を正確に写したか？
□ $$ではなくalign*を使っているか？
□ バックスラッシュ（\\）が正しく付いているか？`;


const SYSTEM_PROMPT_SIMPLE = `あなたは数式OCRの専門家です。
画像（またはPDFページ）に含まれる数式・テキストをLaTeXに変換してください。

${STRICT_RULES}

【出力形式】
LaTeXの本文コードのみを出力してください。
プリアンブルは不要です。最初の文字はLaTeXコマンドまたはテキストのみ。`;


const SYSTEM_PROMPT_FULL = `あなたは数式OCRの専門家です。
画像（またはPDFページ）に含まれる数式・テキストをLaTeXに変換してください。

${STRICT_RULES}

【出力形式】
以下のプリアンブルで始まる完全なLaTeXファイルを出力してください。
プリアンブルより前には何も出力しないこと。

\\documentclass[a4paper]{jsarticle}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{bm}
\\usepackage{graphicx}
\\begin{document}

（変換した内容）

\\end{document}`;



export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const supabase = getSupabase();

    // ユーザーのプランを取得
    const { data: userData } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    const plan = userData?.plan ?? "free";
    const limit = PLAN_LIMITS[plan] ?? 10;

    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));

    // ファイルバリデーション（INSERT前に実施）
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const outputMode = (formData.get("outputMode") as string) ?? "simple";

    const ALLOWED_OUTPUT_MODES = ["full", "simple"];
    if (!ALLOWED_OUTPUT_MODES.includes(outputMode)) {
      return NextResponse.json({ error: "不正なパラメータです" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "画像がありません" }, { status: 400 });
    }

    const mimeType = file.type;
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "対応していないファイル形式です。JPEG・PNG・WebP・GIFのみ対応しています。" },
        { status: 400 }
      );
    }

    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ error: "3MB以下の画像を使用してください" }, { status: 400 });
    }

    // 1. 先にconversionsテーブルにINSERT（TOCTOU競合状態対策）
    const { data: inserted } = await supabase
      .from("conversions")
      .insert({ user_id: userId })
      .select("id");
    const insertedId: string | undefined = inserted?.[0]?.id;

    // 2. INSERT後に今月の合計使用枚数を再カウント
    const { count: totalCount } = await supabase
      .from("conversions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    // 3. 合計が上限を超えていたらINSERTをロールバックして429を返す
    if ((totalCount ?? 0) > limit) {
      if (insertedId) {
        await supabase.from("conversions").delete().eq("id", insertedId);
      }
      return NextResponse.json(
        { error: `今月の変換枚数（${limit}枚）を使い切りました。プランのアップグレードをご検討ください。` },
        { status: 429 }
      );
    }

    // 4. Gemini APIを呼び出す
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const systemPrompt = outputMode === "full" ? SYSTEM_PROMPT_FULL : SYSTEM_PROMPT_SIMPLE;
    const latex = await callGeminiWithFallback(base64, mimeType, systemPrompt);

    return NextResponse.json({ latex, plan, limit });

  } catch (error: unknown) {
    console.error("[api/convert] エラー:", error);
    return NextResponse.json(
      { error: "変換に失敗しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}