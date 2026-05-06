import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WordからLaTeX変換",
  description: "Word（.docx）ファイルをLaTeXに変換する方法を解説。PDF経由で数式・日本語テキストを高精度変換。月10枚まで無料。",
  openGraph: {
    title: "WordからLaTeX変換 | かんたんTeX",
    description: "Word（.docx）ファイルをLaTeXに変換する方法を解説。PDF経由で数式・日本語テキストを高精度変換。",
    url: "/word_convert",
  },
  alternates: { canonical: "/word_convert" },
};

export default function WordConvertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
