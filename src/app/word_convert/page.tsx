"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PdfConvertTool from "@/components/PdfConvertTool";
import WindowsPdfSteps from "@/components/WindowsPdfSteps";
import MacPdfSteps from "@/components/MacPdfSteps";

const FAQ_ITEMS = [
  {
    q: "WordファイルをそのままアップロードできますかA",
    a: "現在はPDF形式のみ対応しています。上記の手順でPDFに変換してからご利用ください。",
  },
  {
    q: "数式はきれいに変換されますか？",
    a: "PDF経由でアップロードすることで、Wordの数式エディタで作成した数式も高精度でLaTeXに変換されます。",
  },
  {
    q: "無料で使えますか？",
    a: "月10枚まで無料でご利用いただけます。それ以上はBasicプラン（¥500/月・500枚）をご利用ください。",
  },
];

export default function WordConvertPage() {
  const [os, setOs] = useState<"windows" | "mac">("windows");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeTabStyle: React.CSSProperties = {
    padding: "8px 24px",
    backgroundColor: "#0017C1",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px 4px 0 0",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const inactiveTabStyle: React.CSSProperties = {
    padding: "8px 24px",
    backgroundColor: "#F5F5F5",
    color: "#666666",
    border: "1px solid #E5E5E5",
    borderBottom: "none",
    borderRadius: "4px 4px 0 0",
    fontSize: "14px",
    cursor: "pointer",
  };

  const contentStyle: React.CSSProperties = {
    border: "1px solid #E5E5E5",
    borderRadius: "0 4px 4px 4px",
    padding: "24px",
    backgroundColor: "#FFFFFF",
    overflowX: "auto",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        color: "#1A1A1A",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <main style={{ flex: 1, padding: "48px 40px 64px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* ─── 説明セクション ─── */}
        <div style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1A1A1A",
              marginBottom: "16px",
              marginTop: 0,
              lineHeight: "1.5",
            }}
          >
            Word（.docx）ファイルをLaTeXに変換する方法
          </h1>

          <p style={{ fontSize: "15px", color: "#444444", lineHeight: "1.8", marginBottom: "24px" }}>
            Word LaTeX 変換（docx latex 変換）を行うには、WordファイルをPDF形式に変換してからアップロードすることで、
            高精度なLaTeX変換が可能です。Word 数式 latex にも対応しており、
            Wordの数式エディタで作成した数式もそのままLaTeXコードに変換できます。
            以下の手順でWordからLaTeXへの変換を行ってください。
          </p>

          {/* OS タブ */}
          <div>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => setOs("windows")} style={os === "windows" ? activeTabStyle : inactiveTabStyle}>
                🪟 Windows
              </button>
              <button onClick={() => setOs("mac")} style={os === "mac" ? activeTabStyle : inactiveTabStyle}>
                🍎 Mac
              </button>
            </div>
            <div style={contentStyle}>
              {os === "windows" ? <WindowsPdfSteps /> : <MacPdfSteps />}
            </div>
          </div>
        </div>

        {/* ─── 区切り ─── */}
        <div
          style={{
            textAlign: "center",
            padding: "24px 0",
            marginBottom: "32px",
            borderTop: "1px solid #E5E5E5",
            borderBottom: "1px solid #E5E5E5",
          }}
        >
          <div style={{ fontSize: "28px", color: "#0017C1", marginBottom: "8px" }}>↓</div>
          <p style={{ fontSize: "15px", color: "#0017C1", fontWeight: "600", margin: 0 }}>
            PDFの準備ができたら、下のツールで変換してください
          </p>
        </div>

        {/* ─── 変換ツール ─── */}
        <section style={{ marginBottom: "56px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1A1A1A",
              marginBottom: "6px",
              marginTop: 0,
            }}
          >
            PDF → LaTeX 変換ツール
          </h2>
          <p style={{ fontSize: "14px", color: "#666666", margin: "0 0 24px" }}>
            wordからlatexへの変換はPDF経由で行います。準備したPDFをこちらにアップロードしてください。
          </p>
          <PdfConvertTool redirectUrl="/word_convert" />
        </section>

        {/* ─── FAQ ─── */}
        <section>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1A1A1A",
              marginBottom: "20px",
              marginTop: 0,
            }}
          >
            よくある質問
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  borderTop: "1px solid #E5E5E5",
                  borderBottom: i === FAQ_ITEMS.length - 1 ? "1px solid #E5E5E5" : "none",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "16px 0",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#1A1A1A" }}>
                    Q. {item.q}
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      color: "#0017C1",
                      flexShrink: 0,
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.15s",
                      fontWeight: "400",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 0 16px", paddingLeft: "0" }}>
                    <p style={{ fontSize: "14px", color: "#444444", lineHeight: "1.8", margin: 0 }}>
                      A. {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
