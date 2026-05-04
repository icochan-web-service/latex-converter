import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
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
        <p style={{ fontSize: "72px", fontWeight: "700", color: "#E5E5E5", margin: "0 0 8px", lineHeight: 1 }}>
          404
        </p>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1A1A1A", margin: "0 0 12px" }}>
          ページが見つかりません
        </h1>
        <p style={{ fontSize: "15px", color: "#888", margin: "0 0 40px", lineHeight: "1.8" }}>
          URLが間違っているか、ページが移動・削除された可能性があります。
        </p>
        <Link
          href="/"
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
          トップページへ戻る
        </Link>
      </main>

      <Footer />
    </div>
  );
}
