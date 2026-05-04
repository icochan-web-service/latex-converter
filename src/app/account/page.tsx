"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type UsageData = {
  used: number;
  limit: number;
  remaining: number;
  plan: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.replace("/");
        } else {
          setUsage(data);
        }
      })
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePortal = async () => {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "エラーが発生しました");
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const planLabel = usage?.plan === "basic" ? "Basic" : "Free";
  const usedPct = usage ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0;

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

      <main style={{ flex: 1, maxWidth: "560px", width: "100%", margin: "0 auto", padding: "56px 40px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "40px", color: "#1A1A1A" }}>
          マイページ
        </h1>

        {loading && (
          <p style={{ color: "#888", fontSize: "15px" }}>読み込み中...</p>
        )}

        {!loading && usage && (
          <>
            {/* プランカード */}
            <div
              style={{
                border: usage.plan === "basic" ? "2px solid #0017C1" : "1px solid #E5E5E5",
                borderRadius: "8px",
                padding: "28px 32px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: usage.plan === "basic" ? "#0017C1" : "#888", letterSpacing: "0.05em" }}>
                  {planLabel.toUpperCase()} プラン
                </span>
                <span style={{ fontSize: "22px", fontWeight: "700", color: usage.plan === "basic" ? "#0017C1" : "#1A1A1A" }}>
                  {usage.plan === "basic" ? "¥500 / 月" : "¥0"}
                </span>
              </div>

              {/* 使用量バー */}
              <div style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#555", marginBottom: "8px" }}>
                  <span>今月の変換枚数</span>
                  <span>{usage.used} / {usage.limit} 枚</span>
                </div>
                <div style={{ height: "8px", background: "#E5E5E5", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${usedPct}%`,
                      background: usedPct >= 90 ? "#E53E3E" : "#0017C1",
                      borderRadius: "4px",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#888" }}>
                  残り {usage.remaining} 枚
                </p>
              </div>
            </div>

            {/* エラー */}
            {error && (
              <p style={{ color: "#E53E3E", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
            )}

            {/* アクションボタン */}
            {usage.plan === "basic" ? (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#FFFFFF",
                  color: "#1A1A1A",
                  border: "1px solid #E5E5E5",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: portalLoading ? "not-allowed" : "pointer",
                  opacity: portalLoading ? 0.6 : 1,
                }}
              >
                {portalLoading ? "移動中..." : "サブスクリプションを管理・解約する"}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#0017C1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Basicプランにアップグレード（¥500/月）
              </button>
            )}

            <p style={{ fontSize: "12px", color: "#aaa", marginTop: "16px", lineHeight: "1.7" }}>
              解約後は当月末まで引き続きご利用いただけます。日割り返金は行いません。
            </p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
