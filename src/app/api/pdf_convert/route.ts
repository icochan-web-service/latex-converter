import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument } from "pdf-lib";

// Fluid Compute有効時のデフォルト300秒が適用されるが念のため明示
export const maxDuration = 300;

const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash-lite"; // 503時のフォールバック

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
❌ \\begin{tikzpicture}（図はコメントで日本語説明のみ）
❌ \\includegraphics（図はコメントで日本語説明のみ）

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
図・グラフ・ダイアグラムが含まれる場合、必ず以下の形式のみを使う：

\\begin{figure}[h]
\\centering
% [図の説明：内容を日本語で詳細に記述。軸・ラベル・矢印・形状・数値をすべて含む]
\\caption{キャプションをそのまま転記}
\\end{figure}

tikzpictureもincludegraphicsも使わない。コメント説明のみ。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 出力前の自己チェック（必須）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ \\documentclass や \`\`\` が含まれていないか？
□ マイナス・∞・係数の見落としがないか？
□ 行列に重複行・文字と数字の取り違えがないか？
□ 小問テキストがalign*の中に入っていないか？
□ \\begin{tikzpicture} を使っていないか？
□ \\includegraphics を使っていないか？
□ 画像にない内容を追加していないか？`;

const SYSTEM_PROMPT_SIMPLE = `あなたは数式OCRの専門家です。
画像（またはPDFページ）に含まれる数式・テキストをLaTeXに変換してください。

${STRICT_RULES}

【出力形式】
LaTeXの本文コードのみを出力する。
最初の文字は \\section・\\subsection・テキストのいずれか。
\\documentclass から始めてはいけない。`;

const PREAMBLE = `\\documentclass[a4paper]{jsarticle}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{bm}
\\usepackage{graphicx}
\\begin{document}`;

async function callGemini(
  base64: string,
  mimeType: string,
  model: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const geminiModel = genAI.getGenerativeModel({ model });
  const result = await geminiModel.generateContent([
    SYSTEM_PROMPT_SIMPLE,
    {
      inlineData: {
        mimeType: mimeType as "application/pdf",
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
  maxRetries: number
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGemini(base64, mimeType, model);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;

      if ((status === 429 || status === 503) && attempt < maxRetries) {
        const baseWait = status === 503 ? 5000 : 3000;
        const jitter = Math.random() * 1000;
        const waitMs = baseWait * attempt + jitter;
        console.warn(
          `[api/pdf_convert] ${model} ${status}エラー。`,
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
  mimeType: string
): Promise<string> {
  // まずプライマリモデルで試行（リトライ2回）
  try {
    return await callGeminiWithRetry(base64, mimeType, PRIMARY_MODEL, 2);
  } catch (primaryErr: unknown) {
    const status = (primaryErr as { status?: number })?.status;

    // 503の場合のみフォールバック
    if (status === 503) {
      console.warn(
        "[api/pdf_convert] プライマリモデル503。",
        `${FALLBACK_MODEL}にフォールバックします`
      );
      return await callGeminiWithRetry(base64, mimeType, FALLBACK_MODEL, 3);
    }

    throw primaryErr;
  }
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
            await new Promise((r) => setTimeout(r, 1000));
          }

          // 変換中イベント
          send({ type: "progress", page: i + 1, status: "converting" });

          try {
            const text = await callGeminiWithFallback(
              pageBase64Array[i],
              "application/pdf"
            );
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
