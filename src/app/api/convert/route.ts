import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
    return NextResponse.json({ latex });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "変換に失敗しました" },
      { status: 500 }
    );
  }
}