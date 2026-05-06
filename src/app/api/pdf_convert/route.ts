import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument } from "pdf-lib";

// Fluid Compute有効時のデフォルト300秒が適用されるが念のため明示
export const maxDuration = 300;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

const MAX_PDF_PAGES = 10;

const SYSTEM_PROMPT_SIMPLE = `あなたは数式OCRの専門家です。
PDFに含まれる数式・テキストをLaTeXに変換してください。

ルール：
- 文中数式は$と$で囲む
- 別立て数式は必ずalign*環境を使う（$$や\\[\\]は使わない）
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- \\documentclass や \\begin{document} などのプリアンブルは出力しない
- コードブロックや説明文は不要、LaTeXコードだけを返す
- section*, subsection*, subsubsection*で構造を表現する
- 画像に書かれている文字・数式・記号をそのままLaTeXに変換する
- 問題の解答・計算・推論は一切行わない
- 画像に存在しない内容を補完・追加しない
- 図・グラフ・表は可能な範囲でLaTeXで再現し、困難な場合は % [図: ~~] とコメントで示す`;

const PREAMBLE = `\\documentclass[a4paper]{jsarticle}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{bm}
\\begin{document}`;

async function callGeminiPage(base64: string, systemPrompt: string): Promise<string> {
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
  return result.response.text().trim();
}

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
    const file = formData.get("pdf") as File;
    const outputMode = (formData.get("outputMode") as string) ?? "simple";

    const ALLOWED_OUTPUT_MODES = ["full", "simple"];
    if (!ALLOWED_OUTPUT_MODES.includes(outputMode)) {
      return NextResponse.json({ error: "不正なパラメータです" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "PDFファイルがありません" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDFファイルを選択してください" }, { status: 400 });
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "4MB以下のPDFを使用してください" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // マジックバイト検証（PDFは必ず %PDF で始まる）
    const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    if (header !== "%PDF") {
      return NextResponse.json(
        { error: "PDFファイルではありません。" },
        { status: 400 }
      );
    }

    // PDFを読み込み（ページ数取得・分割に共用）
    let pdfDoc: PDFDocument;
    let pageCount: number;
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      pageCount = pdfDoc.getPageCount();
    } catch {
      return NextResponse.json(
        { error: "PDFファイルの読み込みに失敗しました。正常なPDFファイルをアップロードしてください。" },
        { status: 400 }
      );
    }

    // ページ数上限チェック
    if (pageCount > MAX_PDF_PAGES) {
      return NextResponse.json(
        { error: `PDFは${MAX_PDF_PAGES}ページ以内のファイルのみ対応しています。（このPDFは${pageCount}ページです）` },
        { status: 400 }
      );
    }

    // 1. 先にconversionsテーブルにINSERT（TOCTOU競合状態対策）
    const records = Array.from({ length: pageCount }, () => ({ user_id: userId }));
    const { data: inserted } = await supabase
      .from("conversions")
      .insert(records)
      .select("id");
    const insertedIds: string[] = inserted?.map((r: { id: string }) => r.id) ?? [];

    // 2. INSERT後に今月の合計使用枚数を再カウント
    const { count: totalCount } = await supabase
      .from("conversions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    const newTotal = totalCount ?? 0;

    // 3. 合計が上限を超えていたらINSERTをロールバックして429を返す
    if (newTotal > limit) {
      if (insertedIds.length > 0) {
        await supabase.from("conversions").delete().in("id", insertedIds);
      }
      const remaining = Math.max(0, limit - (newTotal - pageCount));
      return NextResponse.json(
        {
          error: "conversion_limit_exceeded",
          message: `変換枚数が不足しています。このPDFは${pageCount}ページ分消費しますが、残り枚数は${remaining}枚です。`,
          required: pageCount,
          remaining,
        },
        { status: 429 }
      );
    }

    // 4. PDFを1ページずつに分割
    const pageBase64Array: string[] = [];
    for (let i = 0; i < pageCount; i++) {
      const singlePageDoc = await PDFDocument.create();
      const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [i]);
      singlePageDoc.addPage(copiedPage);
      const singlePageBytes = await singlePageDoc.save();
      pageBase64Array.push(Buffer.from(singlePageBytes).toString("base64"));
    }

    // 5. 各ページをGemini APIに順番に送信（プリアンブルなしプロンプトで統一）
    const pageResults: string[] = [];
    for (let i = 0; i < pageBase64Array.length; i++) {
      try {
        const text = await callGeminiPage(pageBase64Array[i], SYSTEM_PROMPT_SIMPLE);
        pageResults.push(`% ===== ページ ${i + 1} =====\n${text}`);
      } catch (err) {
        console.error(`[api/pdf_convert] ページ${i + 1}の変換失敗:`, err);
        pageResults.push(`% ===== ページ ${i + 1}: 変換失敗 =====`);
      }
    }

    // 全ページ失敗した場合はロールバックして500を返す
    if (pageResults.every((r) => r.includes("変換失敗"))) {
      if (insertedIds.length > 0) {
        await supabase.from("conversions").delete().in("id", insertedIds);
      }
      console.error("[api/pdf_convert] 全ページの変換に失敗しました");
      return NextResponse.json(
        { error: "変換に失敗しました。しばらく経ってから再度お試しください。" },
        { status: 500 }
      );
    }

    // 6. ページ結果を結合し、full モードはプリアンブルで包む
    const body = pageResults.join("\n\n");
    const latex =
      outputMode === "full"
        ? `${PREAMBLE}\n\n${body}\n\n\\end{document}`
        : body;

    return NextResponse.json({ latex, pageCount });

  } catch (error: unknown) {
    console.error("[api/pdf_convert] エラー:", error);
    return NextResponse.json(
      { error: "変換に失敗しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}
