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

async function callGeminiPage(base64: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent([
    SYSTEM_PROMPT_SIMPLE,
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64,
      },
    },
  ]);
  return result.response.text().trim();
}

async function callGeminiWithRetry(
  base64: string,
  maxRetries: number = 3
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGeminiPage(base64);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;

      // レート制限・一時的なサーバーエラーの場合は待機してリトライ
      if ((status === 429 || status === 503) && attempt < maxRetries) {
        const waitMs = status === 503
          ? attempt * 3000  // 503は3秒・6秒・9秒
          : attempt * 2000; // 429は2秒・4秒・6秒
        console.warn(
          `[api/pdf_convert] ${status}エラー。${waitMs}ms後にリトライ`,
          `(${attempt}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      throw err;
    }
  }
  throw new Error("最大リトライ回数を超えました");
}

export async function POST(req: NextRequest) {
  // --- 認証 ---
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

  // --- ファイルバリデーション ---
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
      {
        error: `PDFは${MAX_PDF_PAGES}ページ以内のファイルのみ対応しています。（このPDFは${pageCount}ページです）`,
      },
      { status: 400 }
    );
  }

  // 事前チェック：現在の使用量が上限に達していれば変換せずに早期リターン
  const { count: currentCount } = await supabase
    .from("conversions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if ((currentCount ?? 0) >= limit) {
    return NextResponse.json(
      {
        error: "conversion_limit_exceeded",
        message: "今月の変換枚数上限に達しています。",
        required: pageCount,
        remaining: 0,
      },
      { status: 429 }
    );
  }

  // --- ここからSSEストリーム ---
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        // PDFを1ページずつに分割
        const pageBase64Array: string[] = [];
        for (let i = 0; i < pageCount; i++) {
          const singlePageDoc = await PDFDocument.create();
          const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [i]);
          singlePageDoc.addPage(copiedPage);
          const singlePageBytes = await singlePageDoc.save();
          pageBase64Array.push(Buffer.from(singlePageBytes).toString("base64"));
        }

        // 開始イベント
        send({ type: "start", totalPages: pageCount });

        // 各ページをGemini APIに順番に送信
        const pageResults: string[] = [];
        let successCount = 0;

        for (let i = 0; i < pageBase64Array.length; i++) {
          // 2ページ目以降は待機してからリクエスト（レート制限対策）
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // 変換中イベント
          send({ type: "progress", page: i + 1, status: "converting" });

          try {
            const text = await callGeminiWithRetry(pageBase64Array[i]);
            pageResults.push(`% ===== ページ ${i + 1} =====\n${text}`);
            successCount++;
            send({ type: "progress", page: i + 1, status: "success" });
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            const errorStatus = (err as { status?: number })?.status;
            console.error(`[api/pdf_convert] ページ${i + 1}の変換失敗:`, {
              message: errorMessage,
              status: errorStatus,
              page: i + 1,
            });
            pageResults.push(`% ===== ページ ${i + 1}: 変換失敗 =====`);
            send({ type: "progress", page: i + 1, status: "failed" });
          }
        }

        // 全ページ失敗した場合は枚数を消費せずにエラー
        if (successCount === 0) {
          console.error("[api/pdf_convert] 全ページの変換に失敗しました");
          send({ type: "error", message: "変換に失敗しました。しばらく経ってから再度お試しください。" });
          return;
        }

        // 成功ページ数分だけINSERT（TOCTOU対策：INSERT→COUNT→超過ならrollback）
        const insertData = Array.from({ length: successCount }, () => ({
          user_id: userId,
          created_at: new Date().toISOString(),
        }));

        const { data: inserted, error: insertError } = await supabase
          .from("conversions")
          .insert(insertData)
          .select("id");

        if (insertError) {
          console.error("[api/pdf_convert] INSERT失敗:", insertError);
          send({ type: "error", message: "サーバーエラーが発生しました。" });
          return;
        }

        const insertedIds: string[] = inserted?.map((r: { id: string }) => r.id) ?? [];

        // INSERT後に今月の合計使用枚数を再カウント
        const { count: totalCount } = await supabase
          .from("conversions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", startOfMonth.toISOString());

        const newTotal = totalCount ?? 0;

        // 合計が上限を超えていたらINSERTをロールバック
        if (newTotal > limit) {
          if (insertedIds.length > 0) {
            await supabase.from("conversions").delete().in("id", insertedIds);
          }
          const remaining = Math.max(0, limit - (newTotal - successCount));
          send({
            type: "error",
            error: "conversion_limit_exceeded",
            message: `変換枚数が不足しています。今回の変換は${successCount}ページ分消費しますが、残り枚数は${remaining}枚です。`,
            required: successCount,
            remaining,
          });
          return;
        }

        // ページ結果を結合し、full モードはプリアンブルで包む
        const body = pageResults.join("\n\n");
        const latex =
          outputMode === "full"
            ? `${PREAMBLE}\n\n${body}\n\n\\end{document}`
            : body;

        const failedCount = pageCount - successCount;

        // 完了イベント
        send({ type: "complete", latex, pageCount, successCount, failedCount });

      } catch (err) {
        console.error("[api/pdf_convert] 予期せぬエラー:", err);
        send({ type: "error", message: "変換に失敗しました。しばらく経ってから再度お試しください。" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
