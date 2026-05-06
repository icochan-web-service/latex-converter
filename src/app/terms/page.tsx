import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "利用規約",
  description: "かんたんTeXの利用規約。料金プラン・禁止事項・免責事項について記載しています。",
  openGraph: {
    title: "利用規約 | かんたんTeX",
    description: "かんたんTeXの利用規約。料金プラン・禁止事項・免責事項について記載しています。",
    url: "/terms",
  },
  alternates: { canonical: "/terms" },
};

export default function Terms() {
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

      <main style={{ flex: 1, maxWidth: "720px", width: "100%", margin: "0 auto", padding: "56px 40px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "40px", color: "#1A1A1A" }}>
          利用規約
        </h1>

        <div style={{ color: "#555", lineHeight: "1.9", fontSize: "15px" }}>
          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第1条（適用）
            </h2>
            <p style={{ margin: 0 }}>
              本規約は、当サービス（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意した上で本サービスを利用するものとします。
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第2条（利用登録）
            </h2>
            <p style={{ margin: 0 }}>
              本サービスはメールアドレスまたは外部認証サービス（Google等）を通じて利用登録を行います。登録情報に虚偽がないことを保証するものとします。
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第3条（料金・支払い）
            </h2>
            <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
              <li>無料プラン：月10枚まで無料で利用できます</li>
              <li>Basicプラン：月額¥500で月500枚まで利用できます</li>
              <li>料金はStripeを通じて毎月自動的に請求されます</li>
              <li>月途中でのアップグレードは即時反映されます</li>
              <li>返金は原則として行いません</li>
            </ul>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第4条（禁止事項）
            </h2>
            <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
              <li>法令または公序良俗に違反する行為</li>
              <li>不正アクセスやサービスへの攻撃</li>
              <li>他のユーザーへの迷惑行為</li>
              <li>本サービスの変換結果を大量に転売する行為</li>
              <li>本サービスを自動化ツールで大量利用する行為</li>
            </ul>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第5条（サービスの変更・停止）
            </h2>
            <p style={{ margin: 0 }}>
              当サービスは、事前の通知なくサービスの内容を変更・停止することがあります。これによりユーザーに生じた損害について、当サービスは責任を負いません。
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第6条（免責事項）
            </h2>
            <p style={{ margin: 0 }}>
              本サービスの変換結果の正確性は保証しません。変換結果の利用によって生じた損害について、当サービスは責任を負いません。
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第7条（著作権）
            </h2>
            <p style={{ margin: 0 }}>
              ユーザーがアップロードした画像の著作権はユーザーに帰属します。当サービスはサービス提供の目的以外に画像を使用しません。
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              第8条（準拠法・管轄裁判所）
            </h2>
            <p style={{ margin: 0 }}>
              本規約は日本法に準拠します。本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <p style={{ fontSize: "13px", color: "#aaa", marginTop: "48px" }}>制定日：2026年5月3日</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
