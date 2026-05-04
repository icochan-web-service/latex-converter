"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PdfConvertTool from "@/components/PdfConvertTool";

export default function PdfConvertPage() {
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
      <main
        style={{
          flex: 1,
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 40px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px", color: "#1A1A1A" }}>
            PDF → LaTeX 変換
          </h1>
          <p style={{ fontSize: "14px", color: "#666666", margin: 0 }}>
            PDFをアップロードして数式・本文をLaTeXコードに変換
          </p>
        </div>
        <PdfConvertTool redirectUrl="/pdf_convert" />
      </main>
      <Footer />
    </div>
  );
}
