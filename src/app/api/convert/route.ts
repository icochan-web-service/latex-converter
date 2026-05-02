import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FREE_LIMIT = 10;

const SYSTEM_PROMPT = `あなたは数式OCRの専門家です。
画像に含まれる数式・テキストをLaTeXに変換してください。

ルール：
- 文中数式は$と$で囲む
- 別立て数式は必ずalign*環境を使う（$$や\\[\\]は使わない）
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- コンパイル可能なLaTeXのみ出力する
- コードブロックや説明文は不要、LaTeXコードだけを返す
- section*, subsection*, subsubsection*で構造を表現する`;

export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    // 今月の変換枚数チェック
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("conversions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    if ((count ?? 0) >= FREE_LIMIT) {
      return NextResponse.json(
        { error: "今月の無料枠（10枚）を使い切りました。有料プランへのアップグレードをご検討ください。" },
        { status: 403 }
      );
    }

    // 画像取得
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "画像がありません" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "5MB以下の画像を使用してください" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Gemini API呼び出し
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
          data: base64,
        },
      },
    ]);

    const latex = result.response.text().trim();

    // 変換履歴を記録
    await supabase.from("conversions").insert({ user_id: userId });

    return NextResponse.json({ latex });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "変換に失敗しました" },
      { status: 500 }
    );
  }
}