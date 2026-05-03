"use client";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CompilePage() {
  const [latexCode, setLatexCode] = useState("");

  const handleCompile = () => {
    toast.info("近日公開です。お楽しみに！");
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
      <Toaster position="top-right" />
      <Header />

      <main style={{ flex: 1, maxWidth: "1080px", width: "100%", margin: "0 auto", padding: "48px 40px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px", color: "#1A1A1A" }}>
          LaTeX → PDF コンパイル
        </h1>
        <p style={{ fontSize: "14px", color: "#666666", marginBottom: "40px" }}>
          LaTeXコードをPDFに変換・プレビューできます
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {/* 左：LaTeXコード入力 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#666666" }}>LaTeX コード</span>
            </div>
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              placeholder={"\\documentclass{article}\n\\begin{document}\n\nHello, LaTeX!\n\n\\end{document}"}
              style={{
                width: "100%",
                height: "360px",
                background: "#F8F9FF",
                border: "1px solid #E5E5E5",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "13px",
                fontFamily: "monospace",
                color: "#1A1A1A",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleCompile}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "13px",
                borderRadius: "4px",
                border: "none",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                background: "#0017C1",
                color: "#fff",
                transition: "opacity 0.15s",
              }}
            >
              コンパイル
            </button>
          </div>

          {/* 右：近日公開プレースホルダー */}
          <div>
            <div style={{ fontSize: "13px", color: "#666666", marginBottom: "8px" }}>
              PDF プレビュー
            </div>
            <div
              style={{
                height: "360px",
                background: "#F8F9FF",
                border: "2px dashed #E5E5E5",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <span
                style={{
                  background: "#FF6B35",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 12px",
                  borderRadius: "4px",
                }}
              >
                近日公開
              </span>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📄</div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#1A1A1A", margin: "0 0 6px" }}>
                  PDFプレビュー機能を準備中
                </p>
                <p style={{ fontSize: "13px", color: "#666666", margin: 0 }}>
                  コンパイルボタンで先行体験できます
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
