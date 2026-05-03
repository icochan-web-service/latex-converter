"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handleConvertClick = () => {
    router.push("/convert");
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
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {/* カード1：画像→LaTeX */}
          <div className="tool-card">
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#0017C1",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                margin: "0 auto 20px",
              }}
            >
              📷
            </div>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "10px" }}>
              画像 → LaTeX 変換
            </h2>
            <p style={{ fontSize: "14px", color: "#666666", lineHeight: "1.7", marginBottom: "24px" }}>
              数式・日本語テキストの混在画像をLaTeXコードに変換
            </p>
            {isLoaded && (
              isSignedIn ? (
                <button
                  onClick={handleConvertClick}
                  style={{
                    background: "#0017C1",
                    color: "#fff",
                    padding: "10px 28px",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  変換する
                </button>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl="/convert">
                  <button
                    style={{
                      background: "#0017C1",
                      color: "#fff",
                      padding: "10px 28px",
                      borderRadius: "4px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    変換する
                  </button>
                </SignInButton>
              )
            )}
          </div>

          {/* カード2：LaTeX→PDF（近日公開） */}
          <div className="tool-card">
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
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#CDD3E8",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                margin: "0 auto 20px",
              }}
            >
              📄
            </div>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "10px" }}>
              LaTeX → PDF コンパイル
            </h2>
            <p style={{ fontSize: "14px", color: "#666666", lineHeight: "1.7", marginBottom: "24px" }}>
              LaTeXコードをそのままPDFに変換・プレビュー
            </p>
            <button
              disabled
              style={{
                background: "#E5E5E5",
                color: "#999",
                padding: "10px 28px",
                borderRadius: "4px",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "not-allowed",
              }}
            >
              準備中
            </button>
          </div>

          {/* カード3：将来用 */}
          <div className="tool-card">
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#CDD3E8",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                margin: "0 auto 20px",
              }}
            >
              ✨
            </div>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "10px" }}>
              新機能を準備中
            </h2>
            <p style={{ fontSize: "14px", color: "#666666", lineHeight: "1.7", marginBottom: "24px" }}>
              さらに便利なツールを追加予定です
            </p>
            <button
              disabled
              style={{
                background: "#E5E5E5",
                color: "#999",
                padding: "10px 28px",
                borderRadius: "4px",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "not-allowed",
              }}
            >
              準備中
            </button>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
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
                <h3
                  style={{ fontSize: "16px", fontWeight: "700", color: "#1A1A1A", marginBottom: "10px" }}
                >
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
              <div
                style={{ fontSize: "13px", fontWeight: "600", color: "#888", marginBottom: "8px", letterSpacing: "0.05em" }}
              >
                FREE
              </div>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#1A1A1A", marginBottom: "4px" }}>
                ¥0
              </div>
              <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "24px" }}>月10枚まで</div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px",
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "2.2",
                }}
              >
                <li>✓ 月10枚の変換</li>
                <li>✓ 主要機能すべて</li>
              </ul>
              <SignInButton mode="modal" fallbackRedirectUrl="/convert">
                <button
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
              </SignInButton>
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
              <div
                style={{ fontSize: "13px", fontWeight: "600", color: "#0017C1", marginBottom: "8px", letterSpacing: "0.05em" }}
              >
                BASIC
              </div>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#0017C1", marginBottom: "4px" }}>
                ¥500
                <span style={{ fontSize: "14px", fontWeight: "400", color: "#aaa" }}>/月</span>
              </div>
              <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "24px" }}>月500枚まで</div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px",
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "2.2",
                }}
              >
                <li>✓ 月500枚の変換</li>
                <li>✓ 優先サポート</li>
              </ul>
              <SignInButton mode="modal" fallbackRedirectUrl="/convert">
                <button
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
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
