import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word（.docx）からLaTeX変換 | LaTeX Converter",
  description:
    "WordファイルをPDFに変換してからLaTeXに変換する方法を解説。研究者・大学院生向けの無料LaTeX変換ツール。Word LaTeX 変換・docx latex 変換に対応。",
};

export default function WordConvertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
