import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { jaJP } from "@clerk/localizations";
import "./globals.css";

export const metadata: Metadata = {
  title: "かんたんTeX",
  description: "日本語対応のオンラインLaTeXツール",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.png",
  },
  openGraph: {
    title: "かんたんTeX",
    description: "日本語対応のオンラインLaTeXツール",
    url: "https://latex.viztechlab.com",
    siteName: "かんたんTeX",
    images: [{ url: "https://latex.viztechlab.com/logo.png", width: 512, height: 512 }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "かんたんTeX",
    description: "日本語対応のオンラインLaTeXツール",
    images: ["https://latex.viztechlab.com/logo.png"],
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
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}