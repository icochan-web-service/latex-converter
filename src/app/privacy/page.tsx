import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
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
          プライバシーポリシー
        </h1>

        <div style={{ color: "#555", lineHeight: "1.9", fontSize: "15px" }}>
          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              1. 収集する情報
            </h2>
            <p style={{ margin: "0 0 8px" }}>当サービスでは、以下の情報を収集します。</p>
            <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
              <li>メールアドレス（ログイン認証のため）</li>
              <li>変換した画像データ（変換処理のみに使用し、保存しません）</li>
              <li>変換枚数の利用履歴</li>
              <li>決済情報（Stripeが管理し、当サービスでは保存しません）</li>
            </ul>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              2. 情報の利用目的
            </h2>
            <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
              <li>サービスの提供・運営</li>
              <li>利用状況の管理（変換枚数の制限管理）</li>
              <li>サービス改善のための分析</li>
              <li>重要なお知らせの送信</li>
            </ul>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              3. 第三者への提供
            </h2>
            <p style={{ margin: "0 0 8px" }}>当サービスは、以下のサービスを利用しています。</p>
            <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
              <li>Clerk（認証サービス）</li>
              <li>Stripe（決済サービス）</li>
              <li>Supabase（データベース）</li>
              <li>Google Gemini API（画像変換処理）</li>
              <li>Vercel（ホスティング）</li>
            </ul>
            <p style={{ margin: "8px 0 0" }}>法令に基づく場合を除き、第三者に個人情報を提供しません。</p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              4. Cookie
            </h2>
            <p style={{ margin: 0 }}>
              認証状態の維持のためにCookieを使用します。ブラウザの設定でCookieを無効にすることができますが、サービスが正常に動作しない場合があります。
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              5. 個人情報の管理
            </h2>
            <p style={{ margin: 0 }}>
              収集した個人情報は適切に管理し、不正アクセス・紛失・破壊・改ざん・漏洩等を防止するために必要な措置を講じます。
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              6. お問い合わせ
            </h2>
            <p style={{ margin: 0 }}>
              プライバシーポリシーに関するお問い合わせは、下記メールアドレスよりご連絡ください。<br />
              <a href="mailto:notebizhack@gmail.com" style={{ color: "#0017C1" }}>notebizhack@gmail.com</a>
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1A1A1A", marginBottom: "12px" }}>
              7. 改定
            </h2>
            <p style={{ margin: 0 }}>
              本プライバシーポリシーは必要に応じて改定することがあります。重要な変更がある場合はサービス上でお知らせします。
            </p>
          </section>

          <p style={{ fontSize: "13px", color: "#aaa", marginTop: "48px" }}>制定日：2026年5月3日</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
