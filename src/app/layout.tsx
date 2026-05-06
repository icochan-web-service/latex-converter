import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { jaJP } from "@clerk/localizations";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://latex.viztechlab.com"),
  title: {
    default: "かんたんTeX | 日本語対応オンラインLaTeXツール",
    template: "%s | かんたんTeX",
  },
  description: "画像・PDF・WordをLaTeXコードに変換。数式・日本語テキスト混在対応。月10枚まで無料のオンラインツール。",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.png",
  },
  verification: {
    google: "d3wZfJwgNyLQ5GH7bSzaOE318xYWHimTOt2TbWnpUZ8",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "かんたんTeX | 日本語対応オンラインLaTeXツール",
    description: "画像・PDF・WordをLaTeXコードに変換。数式・日本語テキスト混在対応。月10枚まで無料。",
    url: "/",
    siteName: "かんたんTeX",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "かんたんTeX | 日本語対応オンラインLaTeXツール",
    description: "画像・PDF・WordをLaTeXコードに変換。数式・日本語テキスト混在対応。月10枚まで無料。",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja">
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          />
        </head>
        <body>
          <JsonLd />
          <GoogleAnalytics />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}