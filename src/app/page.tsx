"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/convert");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div style={{ background: "#FFFFFF", color: "#1A1A1A", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ヘッダー */}
      <header style={{ borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#0017C1" }}>画像をLaTeXに変換</span>
          <SignInButton mode="modal">
            <button style={{ background: "#0017C1", color: "#fff", padding: "8px 20px", borderRadius: "4px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              ログイン
            </button>
          </SignInButton>
        </div>
      </header>

      {/* ヒーロー */}
      <section style={{ padding: "96px 40px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "38px", fontWeight: "700", lineHeight: "1.6", color: "#1A1A1A", marginBottom: "24px" }}>
            教科書・論文の数式を、<br />高精度でLaTeX形式に。
          </h1>
          <p style={{ fontSize: "17px", color: "#555", lineHeight: "1.9", marginBottom: "48px" }}>
            画像をアップロードするだけで、数式・日本語混在の文書をLaTeXコードに変換。<br />
            研究者・大学院生・大学生の論文執筆を支援します。
          </p>
          <SignInButton mode="modal">
            <button style={{ background: "#0017C1", color: "#fff", padding: "14px 48px", borderRadius: "4px", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
              無料で始める
            </button>
          </SignInButton>
        </div>
      </section>

      {/* 特徴セクション */}
      <section style={{ background: "#F8F8F8", padding: "72px 40px", borderTop: "1px solid #E5E5E5", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", textAlign: "center", marginBottom: "48px", color: "#1A1A1A" }}>特徴</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {[
              {
                title: "日本語対応",
                desc: "数式と日本語テキストが混在する画像にも対応。教科書や試験問題もそのまま変換できます。",
              },
              {
                title: "高精度変換",
                desc: "最新のAIモデルを使用し、複雑な数式も高精度でLaTeXコードに変換します。",
              },
              {
                title: "簡単操作",
                desc: "画像をドラッグ＆ドロップするだけ。LaTeXの知識がなくても直感的に使えます。",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px", borderRadius: "4px" }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0017C1", marginBottom: "12px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.8", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section style={{ padding: "72px 40px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", textAlign: "center", marginBottom: "48px", color: "#1A1A1A" }}>料金プラン</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ border: "1px solid #E5E5E5", padding: "36px", borderRadius: "4px" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#888", marginBottom: "8px", letterSpacing: "0.05em" }}>FREE</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#1A1A1A", marginBottom: "4px" }}>¥0</div>
              <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "28px" }}>月10枚まで</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#555", lineHeight: "2.2" }}>
                <li>✓ 月10枚の変換</li>
                <li>✓ 日本語・数式対応</li>
              </ul>
            </div>
            <div style={{ border: "2px solid #0017C1", padding: "36px", borderRadius: "4px" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#0017C1", marginBottom: "8px", letterSpacing: "0.05em" }}>BASIC</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#1A1A1A", marginBottom: "4px" }}>
                ¥500
                <span style={{ fontSize: "14px", fontWeight: "400", color: "#aaa" }}>/月</span>
              </div>
              <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "28px" }}>月500枚まで</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#555", lineHeight: "2.2" }}>
                <li>✓ 月500枚の変換</li>
                <li>✓ 日本語・数式対応</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer style={{ borderTop: "1px solid #E5E5E5", padding: "24px 40px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#bbb" }}>© 2025 画像をLaTeXに変換</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <a href="/privacy" style={{ fontSize: "13px", color: "#888", textDecoration: "none" }}>プライバシーポリシー</a>
            <a href="/terms" style={{ fontSize: "13px", color: "#888", textDecoration: "none" }}>利用規約</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
