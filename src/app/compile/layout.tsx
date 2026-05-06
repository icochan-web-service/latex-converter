import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LaTeX数式を画像変換・プレビュー",
  description: "LaTeX数式をリアルタイムでプレビューしてPNG・SVG形式でダウンロード。無料で使えるオンラインLaTeX数式エディタ。",
  openGraph: {
    title: "LaTeX数式を画像変換・プレビュー | かんたんTeX",
    description: "LaTeX数式をリアルタイムでプレビューしてPNG・SVG形式でダウンロード。無料で使えるオンラインツール。",
    url: "/compile",
  },
  alternates: { canonical: "/compile" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
