import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument } from "pdf-lib";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  basic: 500,
  pro: 5000,
};

const SYSTEM_PROMPT_SIMPLE = `あなたは数式OCRの専門家です。
PDFに含まれる数式・テキストをLaTeXに変換してください。

ルール：
- 文中数式は$と$で囲む
- 別立て数式は必ずalign*環境を使う（$$や\\[\\]は使わない）
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- \\documentclass や \\begin{document} などのプリアンブルは出力しない
- コードブロックや説明文は不要、LaTeXコードだけを返す
- section*, subsection*, subsubsection*で構造を表現する`;

const SYSTEM_PROMPT_FULL = `あなたは数式OCRの専門家です。
PDFに含まれる数式・テキストをLaTeXに変換してください。

ルール：
- 文中数式は$と$で囲む
- 別立て数式は必ずalign*環境を使う（$$や\\[\\]は使わない）
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- 以下のプリアンブルを含む完全な形式で出力する：

\\documentclass[a4paper]{jsarticle}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{bm}
\\begin{document}

（変換した内容）

\\end{document}

- コードブロックや説明文は不要、LaTeXコードだけを返す
- section*, subsection*, subsubsection*で構造を表現する`;

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

    // 今月の変換回数チェック
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));

    const { count } = await supabase
      .from("conversions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    const used = count ?? 0;
    const remaining = Math.max(0, limit - used);

    if (remaining === 0) {
      return NextResponse.json(
        { error: `今月の変換回数（${limit}回）を使い切りました。プランのアップグレードをご検討ください。` },
        { status: 403 }
      );
    }

    // PDFファイル取得
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    const outputMode = (formData.get("outputMode") as string) ?? "simple";

    if (!file) {
      return NextResponse.json({ error: "PDFファイルがありません" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDFファイルを選択してください" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "10MB以下のPDFを使用してください" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();

    // PDFページ数を取得
    let pageCount = 1;
    try {
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      pageCount = pdfDoc.getPageCount();
    } catch {
      // ページ数取得に失敗した場合は1として扱う
    }

    // 残り枚数がページ数に足りない場合はエラー
    if (remaining < pageCount) {
      return NextResponse.json(
        {
          error: "conversion_limit_exceeded",
          message: `変換枚数が不足しています。このPDFは${pageCount}ページ分消費しますが、残り枚数は${remaining}枚です。`,
          required: pageCount,
          remaining,
        },
        { status: 403 }
      );
    }

    const base64 = Buffer.from(bytes).toString("base64");

    const systemPrompt = outputMode === "full" ? SYSTEM_PROMPT_FULL : SYSTEM_PROMPT_SIMPLE;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
    ]);

    const latex = result.response.text().trim();

    // ページ数分の変換履歴を一括記録
    const records = Array.from({ length: pageCount }, () => ({ user_id: userId }));
    await supabase.from("conversions").insert(records);

    return NextResponse.json({ latex, plan, limit, pageCount });

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "変換に失敗しました" },
      { status: 500 }
    );
  }
}
