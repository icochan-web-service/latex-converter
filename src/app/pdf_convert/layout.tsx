import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDFからLaTeX変換",
  description: "PDFファイルの数式・日本語テキストをLaTeXコードに変換。10ページ・4MB以内対応。月10枚まで無料のオンラインツール。",
  openGraph: {
    title: "PDFからLaTeX変換 | かんたんTeX",
    description: "PDFファイルの数式・日本語テキストをLaTeXコードに変換。10ページ・4MB以内対応。月10枚まで無料。",
    url: "/pdf_convert",
  },
  alternates: { canonical: "/pdf_convert" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
