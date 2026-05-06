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
      <main style={{ flex: 1, padding: "48px 40px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px", color: "#1A1A1A" }}>
              PDF → LaTeX 変換
            </h1>
            <p style={{ fontSize: "14px", color: "#666666", margin: 0 }}>
              PDFをアップロードして数式・本文をLaTeXコードに変換
            </p>
          </div>
          <PdfConvertTool redirectUrl="/pdf_convert" />

          {/* FAQ */}
          <section style={{ marginTop: "64px", borderTop: "1px solid #E5E5E5", paddingTop: "48px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1A1A1A", marginBottom: "28px", marginTop: 0 }}>
              よくある質問
            </h2>
            {[
              {
                q: "対応しているPDFファイルの条件は？",
                a: "4MB以下・最大10ページのPDFファイルに対応しています。10ページを超える場合は、必要なページを分割・抜粋してからアップロードしてください。",
              },
              {
                q: "日本語テキストと数式が混在したPDFも変換できますか？",
                a: "はい、対応しています。教科書・論文・試験問題など、日本語テキストと数式が混在したPDFを高精度でLaTeXに変換します。",
              },
              {
                q: "複数ページのPDFはどのように処理されますか？",
                a: "複数ページのPDFは全ページをまとめてAIに送信し、1つのLaTeXファイルとして変換されます。利用枠は1回の変換につき1枚として消費されます。",
              },
              {
                q: "変換に失敗した場合、利用枚数は消費されますか？",
                a: "AIエラーによる変換失敗の場合は、利用枚数は消費されません。ただし、ファイル形式・サイズ・ページ数の制限違反による失敗は対象外です。",
              },
              {
                q: "無料プランで使える変換枚数は？",
                a: "月10枚まで無料でご利用いただけます。より多く使いたい方はBasicプラン（¥500/月・月500枚）をご利用ください。",
              },
            ].map((item, i, arr) => (
              <div
                key={i}
                style={{
                  borderTop: "1px solid #E5E5E5",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  borderBottom: i === arr.length - 1 ? "1px solid #E5E5E5" : "none",
                }}
              >
                <p style={{ fontSize: "15px", fontWeight: "600", color: "#1A1A1A", margin: "0 0 8px" }}>
                  Q. {item.q}
                </p>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.8", margin: 0 }}>
                  A. {item.a}
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
