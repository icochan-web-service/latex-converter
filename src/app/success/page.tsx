import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Success() {
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            background: "#EBF8F0",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            marginBottom: "24px",
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1A1A1A", margin: "0 0 12px" }}>
          アップグレード完了
        </h1>
        <p style={{ fontSize: "15px", color: "#666666", margin: "0 0 8px", lineHeight: "1.8" }}>
          Basicプランへのアップグレードが完了しました。
        </p>
        <p style={{ fontSize: "14px", color: "#888", margin: "0 0 40px" }}>
          月500枚の変換をご利用いただけます。
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/convert"
            style={{
              background: "#0017C1",
              color: "#fff",
              padding: "10px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            変換を始める
          </Link>
          <Link
            href="/account"
            style={{
              background: "#FFFFFF",
              color: "#1A1A1A",
              padding: "10px 28px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              border: "1px solid #E5E5E5",
            }}
          >
            マイページへ
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}