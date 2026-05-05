"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PdfConvertTool from "@/components/PdfConvertTool";

type OsTab = "windows" | "mac";

const WIN_STEPS = [
  "Wordでファイルを開く",
  "「ファイル」→「名前を付けて保存」をクリック",
  "ファイル形式で「PDF」を選択して保存",
];

const MAC_STEPS = [
  "Wordでファイルを開く",
  "「ファイル」→「プリント」をクリック",
  "左下の「PDF」→「PDFとして保存」を選択して保存",
];

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

const PlaceholderImage = () => (
  <div
    style={{
      width: "100%",
      maxWidth: "480px",
      height: "240px",
      background: "#F5F5F5",
      border: "1px solid #E5E5E5",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#aaa",
      fontSize: "14px",
      gap: "8px",
      margin: "12px 0",
    }}
  >
    <span style={{ fontSize: "20px" }}>📷</span>
    GIF準備中
  </div>
);

export default function WordConvertPage() {
  const [activeTab, setActiveTab] = useState<OsTab>("windows");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabBtn = (tab: OsTab): React.CSSProperties => ({
    padding: "8px 24px",
    fontSize: "14px",
    fontWeight: activeTab === tab ? "700" : "400",
    color: activeTab === tab ? "#0017C1" : "#666666",
    background: activeTab === tab ? "#FFFFFF" : "#F5F5F5",
    border: "1px solid #E5E5E5",
    borderBottom: activeTab === tab ? "1px solid #FFFFFF" : "1px solid #E5E5E5",
    cursor: "pointer",
    transition: "all 0.12s",
    marginBottom: activeTab === tab ? "-1px" : "0",
  });

  const steps = activeTab === "windows" ? WIN_STEPS : MAC_STEPS;

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
          <div style={{ borderBottom: "1px solid #E5E5E5", marginBottom: "0" }}>
            <div style={{ display: "flex", gap: "0" }}>
              <button onClick={() => setActiveTab("windows")} style={{ ...tabBtn("windows"), borderRadius: "4px 0 0 0" }}>
                Windows
              </button>
              <button onClick={() => setActiveTab("mac")} style={{ ...tabBtn("mac"), borderRadius: "0 4px 0 0", borderLeft: "none" }}>
                Mac
              </button>
            </div>
          </div>

          {/* 手順パネル */}
          <div
            style={{
              border: "1px solid #E5E5E5",
              borderTop: "none",
              borderRadius: "0 4px 4px 4px",
              padding: "24px",
              background: "#FAFAFA",
              marginBottom: "8px",
            }}
          >
            <ol style={{ margin: 0, padding: "0 0 0 20px", listStyle: "decimal" }}>
              {steps.map((step, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "15px",
                    color: "#1A1A1A",
                    lineHeight: "1.7",
                    marginBottom: i < steps.length - 1 ? "10px" : 0,
                  }}
                >
                  {step}
                </li>
              ))}
            </ol>
            <PlaceholderImage />
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
