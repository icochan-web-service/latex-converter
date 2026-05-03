import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { jaJP } from "@clerk/localizations";
import "./globals.css";

export const metadata: Metadata = {
  title: "数式 → LaTeX 変換",
  description: "日本語対応の数式LaTeX変換サービス",
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