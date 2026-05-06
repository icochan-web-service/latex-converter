import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "画像からLaTeX変換",
  description: "数式・日本語テキストが混在した画像をLaTeXコードに変換。PNG・JPG・WEBP対応。月10枚まで無料のオンラインツール。",
  openGraph: {
    title: "画像からLaTeX変換 | かんたんTeX",
    description: "数式・日本語テキストが混在した画像をLaTeXコードに変換。PNG・JPG・WEBP対応。月10枚まで無料。",
    url: "/convert",
  },
  alternates: { canonical: "/convert" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
