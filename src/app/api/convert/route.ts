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

const SYSTEM_PROMPT_SIMPLE = `あなたは数式OCRの専門家です。
画像（またはPDFページ）に含まれる数式・テキストをLaTeXに変換してください。

【読み取り順序のルール】
- 2段組（2カラム）レイアウトの場合：左カラムを上から下まで読み切ってから、右カラムを上から下に読む
- 横長レイアウトの場合も同様に、視覚的な段組構造を正確に認識して読む
- 段をまたいで横に読まない（左カラムの途中で右カラムに移らない）
- ページ番号・ヘッダー・フッターは出力しない

【変換ルール】
- 文中数式は$と$で囲む
- 別立て数式は必ずalign*環境を使う（$$や\\[\\]は使わない）
- 符号（+, -, ×, ÷）・指数・添字を正確に変換する（特に負号の脱落に注意）
- 行列の要素はPDFの配置通りに正確に読み取る（行・列を取り違えない）
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- section*, subsection*, subsubsection*で構造を表現する
- 空欄・□・(ア)(イ)などの穴埋め箇所は\\boxed{\\text{(ア)}}のように空欄のまま出力し、解答を補完しない
- 画像に存在しない内容を補完・追加しない

【図・グラフの変換ルール】
- 図・グラフ・ダイアグラムが含まれる場合、以下の形式で日本語で説明する：
\\begin{figure}[h]
\\centering
% [図の説明：（図の内容を日本語で詳細に説明。座標軸・ラベル・矢印・形状・数値などを含む）]
\\caption{（図のキャプションをそのまま転記）}
\\end{figure}
- 図の説明は省略せず、図から読み取れる情報をすべて日本語で記述する
- tikzpictureで再現できる単純な図（矢印・直線・四角形など）はtikzpictureで出力してもよい

【絶対に出力してはいけないもの】
- \\documentclass・\\usepackage・\\begin{document}・\\end{document} などのプリアンブル
- \`\`\`latex や \`\`\` などのコードブロック記号
- 「以下がLaTeXコードです」などの説明文・前置き・後書き
- 出力はLaTeXの本文コードのみとする`;


const SYSTEM_PROMPT_FULL = `あなたは数式OCRの専門家です。
画像（またはPDFページ）に含まれる数式・テキストをLaTeXに変換してください。

【読み取り順序のルール】
- 2段組（2カラム）レイアウトの場合：左カラムを上から下まで読み切ってから、右カラムを上から下に読む
- 横長レイアウトの場合も同様に、視覚的な段組構造を正確に認識して読む
- 段をまたいで横に読まない（左カラムの途中で右カラムに移らない）
- ページ番号・ヘッダー・フッターは出力しない

【変換ルール】
- 文中数式は$と$で囲む
- 別立て数式は必ずalign*環境を使う（$$や\\[\\]は使わない）
- 符号（+, -, ×, ÷）・指数・添字を正確に変換する（特に負号の脱落に注意）
- 行列の要素はPDFの配置通りに正確に読み取る（行・列を取り違えない）
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- section*, subsection*, subsubsection*で構造を表現する
- 空欄・□・(ア)(イ)などの穴埋め箇所は\\boxed{\\text{(ア)}}のように空欄のまま出力し、解答を補完しない
- 画像に存在しない内容を補完・追加しない

【図・グラフの変換ルール】
- 図・グラフ・ダイアグラムが含まれる場合、以下の形式で日本語で説明する：
\\begin{figure}[h]
\\centering
% [図の説明：（図の内容を日本語で詳細に説明。座標軸・ラベル・矢印・形状・数値などを含む）]
\\caption{（図のキャプションをそのまま転記）}
\\end{figure}
- 図の説明は省略せず、図から読み取れる情報をすべて日本語で記述する
- tikzpictureで再現できる単純な図（矢印・直線・四角形など）はtikzpictureで出力してもよい

- 以下のプリアンブルを含む完全な形式で出力する：

\\documentclass[a4paper]{jsarticle}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{bm}
\\usepackage{graphicx}
\\begin{document}

（変換した内容）

\\end{document}

【絶対に出力してはいけないもの】
- \`\`\`latex や \`\`\` などのコードブロック記号
- 「以下がLaTeXコードです」などの説明文・前置き・後書き
- 出力はLaTeXコードのみとする`;



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