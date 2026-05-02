import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `あなたは数式OCRの専門家です。
画像に含まれる数式・テキストをLaTeXに変換してください。

ルール：
- 数式はalign*環境を使う
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- コンパイル可能なLaTeXのみ出力する
- コードブロックや説明文は不要、LaTeXコードだけを返す`;

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "baidu/qianfan-ocr-fast:free",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: SYSTEM_PROMPT },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${base64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      throw new Error(data.error?.message || "変換に失敗しました");
    }

    const latex = data.choices[0].message.content.trim();
    return NextResponse.json({ latex });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "変換に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}