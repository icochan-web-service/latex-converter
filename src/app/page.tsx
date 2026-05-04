"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handleConvert = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/convert");
  };

  const handleComingSoon = () => {
    toast.info("近日公開です。お楽しみに！");
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        color: "#1A1A1A",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toaster position="top-right" />
      <Header />

      {/* ヒーロー */}
      <section style={{ background: "#F8F9FF", padding: "64px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "700",
              lineHeight: "1.5",
              color: "#1A1A1A",
              marginBottom: "20px",
            }}
          >
            数式・LaTeXをもっと簡単に。
          </h1>
          <p style={{ fontSize: "17px", color: "#666666", lineHeight: "1.9", margin: 0 }}>
            画像から LaTeX に変換、LaTeX を PDF にコンパイル。
            <br />
            日本語対応の数式ツールセット。
          </p>
        </div>
      </section>

      {/* ツールカード一覧 */}
      <section style={{ padding: "64px 40px", flex: 1 }}>
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {/* カード1：画像→LaTeX（アクティブ） */}
          <a href="/convert" className="tool-card-active" onClick={handleConvert}>
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              <div style={{ width: "48px", height: "48px", minWidth: "48px", flexShrink: 0 }}>
                {/* アイコン差し替え：public/icons/image-to-tex.svg を同名ファイルで上書きすると反映されます */}
                <img src="/icons/image-to-tex.svg" alt="" style={{ width: "48px", height: "48px" }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    marginTop: 0,
                  }}
                >
                  画像 → LaTeX 変換
                </h2>
                <p style={{ fontSize: "13px", color: "#666666", lineHeight: "1.7", margin: 0 }}>
                  数式・日本語テキストの混在画像をLaTeXコードに変換
                </p>
              </div>
            </div>
            <div
              className="card-arrow"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "24px",
                color: "#0017C1",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              →
            </div>
          </a>

          {/* カード2：PDF→LaTeX変換（アクティブ） */}
          <a href="/pdf_convert" className="tool-card-active">
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              <div style={{ width: "48px", height: "48px", minWidth: "48px", flexShrink: 0 }}>
                {/* アイコン差し替え：public/icons/pdf-to-tex.svg を同名ファイルで上書きすると反映されます */}
                <img src="/icons/pdf-to-tex.svg" alt="" style={{ width: "48px", height: "48px" }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    marginTop: 0,
                  }}
                >
                  PDF → LaTeX 変換
                </h2>
                <p style={{ fontSize: "13px", color: "#666666", lineHeight: "1.7", margin: 0 }}>
                  PDFをアップロードして数式・本文をLaTeXに変換
                </p>
              </div>
            </div>
            <div
              className="card-arrow"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "24px",
                color: "#0017C1",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              →
            </div>
          </a>

          {/* カード3：Word→LaTeX変換（アクティブ） */}
          <a href="/word_convert" className="tool-card-active">
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              <div style={{ width: "48px", height: "48px", minWidth: "48px", flexShrink: 0 }}>
                {/* アイコン差し替え：public/icons/word-to-tex.svg を同名ファイルで上書きすると反映されます */}
                <img src="/icons/word-to-tex.svg" alt="" style={{ width: "48px", height: "48px" }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    marginTop: 0,
                  }}
                >
                  Word → LaTeX 変換
                </h2>
                <p style={{ fontSize: "13px", color: "#666666", lineHeight: "1.7", margin: 0 }}>
                  Word（.docx）ファイルをPDF経由でLaTeXに高精度変換
                </p>
              </div>
            </div>
            <div
              className="card-arrow"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "24px",
                color: "#0017C1",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              →
            </div>
          </a>

          {/* カード4：LaTeX数式プレビュー（アクティブ） */}
          <a href="/compile" className="tool-card-active">
            <span
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "#0A8A4A",
                color: "#fff",
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              無料
            </span>
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              <div style={{ width: "48px", height: "48px", minWidth: "48px", flexShrink: 0 }}>
                {/* アイコン差し替え：public/icons/tex-preview.svg を同名ファイルで上書きすると反映されます */}
                <img src="/icons/tex-preview.svg" alt="" style={{ width: "48px", height: "48px" }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    marginTop: 0,
                  }}
                >
                  LaTeX 数式プレビュー
                </h2>
                <p style={{ fontSize: "13px", color: "#666666", lineHeight: "1.7", margin: 0 }}>
                  数式をリアルタイムでレンダリング。PNG・SVGでエクスポート可能
                </p>
              </div>
            </div>
            <div
              className="card-arrow"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "24px",
                color: "#0017C1",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              →
            </div>
          </a>

          {/* カード3：LaTeX→PDF（近日公開） */}
          <div className="tool-card-active" onClick={handleComingSoon}>
            <span
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "#FF6B35",
                color: "#fff",
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              近日公開
            </span>
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  minWidth: "48px",
                  background: "#CDD3E8",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                📄
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    marginTop: 0,
                  }}
                >
                  LaTeX → PDF コンパイル
                </h2>
                <p style={{ fontSize: "13px", color: "#666666", lineHeight: "1.7", margin: 0 }}>
                  LaTeXコードをそのままPDFに変換・プレビュー
                </p>
              </div>
            </div>
            <div
              className="card-arrow"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "24px",
                color: "#CDD3E8",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              →
            </div>
          </div>

          {/* カード3：将来用（非アクティブ） */}
          <div className="tool-card-inactive">
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  minWidth: "48px",
                  background: "#CDD3E8",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                ✨
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    marginTop: 0,
                  }}
                >
                  新機能を準備中
                </h2>
                <p style={{ fontSize: "13px", color: "#666666", lineHeight: "1.7", margin: 0 }}>
                  さらに便利なツールを追加予定です
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section style={{ background: "#FFFFFF", padding: "64px 40px", borderTop: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "48px",
              color: "#1A1A1A",
            }}
          >
            特徴
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {[
              {
                icon: "🌏",
                title: "日本語完全対応",
                desc: "日本語テキストと数式の混在に対応。教科書や試験問題もそのまま変換できます。",
              },
              {
                icon: "⚡",
                title: "高精度変換",
                desc: "Gemini 2.5 Flashによる業界最高水準の精度で複雑な数式を正確に変換します。",
              },
              {
                icon: "🔒",
                title: "安全・安心",
                desc: "画像データは変換後即時削除。個人情報やデータの安全を最優先に管理します。",
              },
            ].map((f) => (
              <div key={f.title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1A1A1A", marginBottom: "10px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#666666", lineHeight: "1.8", margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section style={{ background: "#F8F9FF", padding: "64px 40px", borderTop: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "48px",
              color: "#1A1A1A",
            }}
          >
            料金プラン
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Free */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5E5",
                borderRadius: "8px",
                padding: "36px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#888", marginBottom: "8px", letterSpacing: "0.05em" }}>
                FREE
              </div>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#1A1A1A", marginBottom: "4px" }}>¥0</div>
              <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "24px" }}>月10枚まで</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", fontSize: "14px", color: "#555", lineHeight: "2.2" }}>
                <li>✓ 月10枚の変換</li>
                <li>✓ 主要機能すべて</li>
              </ul>
              <button
                onClick={() => openSignIn({ fallbackRedirectUrl: "/convert" })}
                style={{
                  width: "100%",
                  background: "#FFFFFF",
                  color: "#0017C1",
                  border: "1px solid #0017C1",
                  padding: "10px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                無料で始める
              </button>
            </div>

            {/* Basic */}
            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid #0017C1",
                borderRadius: "8px",
                padding: "36px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#0017C1",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "3px 16px",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                おすすめ
              </span>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#0017C1", marginBottom: "8px", letterSpacing: "0.05em" }}>
                BASIC
              </div>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#0017C1", marginBottom: "4px" }}>
                ¥500<span style={{ fontSize: "14px", fontWeight: "400", color: "#aaa" }}>/月</span>
              </div>
              <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "24px" }}>月500枚まで</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", fontSize: "14px", color: "#555", lineHeight: "2.2" }}>
                <li>✓ 月500枚の変換</li>
                <li>✓ 優先サポート</li>
              </ul>
              <button
                onClick={() => openSignIn({ fallbackRedirectUrl: "/convert" })}
                style={{
                  width: "100%",
                  background: "#0017C1",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Basicプランを始める
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
