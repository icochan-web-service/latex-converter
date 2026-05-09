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

// ============================================================
// FINAL FIXED PROMPT - 2026.05
// ============================================================

const STRICT_RULES = `
【最重要：あなたの仕事は「書き写すこと」のみ】
計算・解答・補完・推論・要約は一切禁止。
画像に書かれていることだけをLaTeXに変換する。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 絶対に出力してはいけないもの
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
以下は、たとえ画像の中に印刷されていても出力禁止：

❌ \\documentclass
❌ \\usepackage
❌ \\begin{document}
❌ \\end{document}
❌ \`\`\`latex や \`\`\`（コードブロック）
❌ 「以下がLaTeXです」などの説明・前置き・後書き
❌ 画像に存在しない計算過程・解答・補足
❌ $$..$$ （別立て数式はalign*環境のみ）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 符号・係数・記号の正確な読み取り（最頻出ミス）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
マイナス記号と係数は絶対に省略・見落とし禁止。

【NG例1：指数のマイナス脱落】
❌ \\exp\\left(\\frac{x^2+y^2}{2}\\right)
✅ \\exp\\left(-\\frac{x^2+y^2}{2}\\right)

【NG例2：関数のマイナス脱落】
❌ f(x) = x \\sin x
✅ f(x) = x - \\sin x

【NG例3：和の係数の脱落】
❌ \\sum \\frac{1}{N^2}
✅ \\sum \\frac{j}{N^2}

【NG例4：∞記号の誤認識】
❌ \\int^{100} \\int_{81}
✅ \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty}
（∞は数字ではなく\\inftyで出力する）

数式を書くたびに確認：
□ マイナスが抜けていないか
□ 分子・分母・指数の係数が正確か
□ ∞が数字に化けていないか

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 行列の正確な読み取り
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
手順：① 行数・列数を確認 → ② 1行ずつ左から右へ読む

【NG例1：文字と数字の誤認識】
❌ \\begin{pmatrix} 3 & b & 1 \\\\ 6 & 3 & 1 \\\\ 1 & 1 & 4 \\end{pmatrix}
✅ \\begin{pmatrix} 3 & b & 1 \\\\ b & 3 & 1 \\\\ 1 & 1 & 4 \\end{pmatrix}
（bと6を取り違えない）

【NG例2：同一行の重複】
❌ \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ ...
（同じ行が2つ並んでいたら読み直す）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 2段組・横長レイアウトの読み取り
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 左カラムを最後まで読み切ってから右カラムへ
✅ カラム境界付近の記号（特にマイナス・∞）を見落とさない
✅ ページ番号・ヘッダー・フッターは出力しない

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 数式・構造のルール
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 文中数式：$...$
✅ 別立て数式：\\begin{align*}...\\end{align*} のみ
✅ 小問の説明文（(1)〜など）はalign*環境の外に出す
✅ section*, subsection*, subsubsection* で構造を表現
✅ バックスラッシュ（\\）を省略しない
✅ 空欄・□・(ア)などは \\boxed{\\text{(ア)}} で出力（解答しない）
✅ 日本語テキストはそのまま地の文として出力
✅ ∴ ∵ などの記号はそのまま使う
✅ 画像に存在しない内容を一切追加しない

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 図・グラフのルール
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ \\includegraphics は使わない
✅ 必ず以下の形式で日本語説明を出力する：

\\begin{figure}[h]
\\centering
% [図の説明：内容を日本語で詳細に記述。軸・ラベル・矢印・形状・数値をすべて含む]
\\caption{キャプションをそのまま転記}
\\end{figure}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 出力前の自己チェック（必須）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ \\documentclass や \`\`\` が含まれていないか？
□ マイナス・∞・係数の見落としがないか？
□ 行列に重複行・文字と数字の取り違えがないか？
□ 小問テキストがalign*の中に入っていないか？
□ \\includegraphicsを使っていないか？
□ 画像にない内容を追加していないか？`;


const SYSTEM_PROMPT_SIMPLE = `あなたは数式OCRの専門家です。
画像（またはPDFページ）に含まれる数式・テキストをLaTeXに変換してください。

${STRICT_RULES}

【出力形式】
LaTeXの本文コードのみを出力する。
最初の文字は \\section・\\subsection・テキストのいずれか。
\\documentclass から始めてはいけない。`;


const SYSTEM_PROMPT_FULL = `あなたは数式OCRの専門家です。
画像（またはPDFページ）に含まれる数式・テキストをLaTeXに変換してください。

${STRICT_RULES}

【出力形式】
以下のプリアンブルから始まる完全なLaTeXファイルを出力する。
プリアンブルより前に何も出力しないこと。

\\documentclass[a4paper]{jsarticle}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{bm}
\\usepackage{graphicx}
\\usepackage{tikz}
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