export default function Privacy() {
  return (
    <main className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">プライバシーポリシー</h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. 収集する情報</h2>
            <p>当サービスでは、以下の情報を収集します。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>メールアドレス（ログイン認証のため）</li>
              <li>変換した画像データ（変換処理のみに使用し、保存しません）</li>
              <li>変換枚数の利用履歴</li>
              <li>決済情報（Stripeが管理し、当サービスでは保存しません）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>サービスの提供・運営</li>
              <li>利用状況の管理（変換枚数の制限管理）</li>
              <li>サービス改善のための分析</li>
              <li>重要なお知らせの送信</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. 第三者への提供</h2>
            <p>当サービスは、以下のサービスを利用しています。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Clerk（認証サービス）</li>
              <li>Stripe（決済サービス）</li>
              <li>Supabase（データベース）</li>
              <li>Google Gemini API（画像変換処理）</li>
              <li>Vercel（ホスティング）</li>
            </ul>
            <p className="mt-2">法令に基づく場合を除き、第三者に個人情報を提供しません。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookie</h2>
            <p>認証状態の維持のためにCookieを使用します。ブラウザの設定でCookieを無効にすることができますが、サービスが正常に動作しない場合があります。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. 個人情報の管理</h2>
            <p>収集した個人情報は適切に管理し、不正アクセス・紛失・破壊・改ざん・漏洩等を防止するために必要な措置を講じます。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. お問い合わせ</h2>
            <p>プライバシーポリシーに関するお問い合わせは、サービス内のお問い合わせフォームよりご連絡ください。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. 改定</h2>
            <p>本プライバシーポリシーは必要に応じて改定することがあります。重要な変更がある場合はサービス上でお知らせします。</p>
          </section>

          <p className="text-sm text-gray-400 mt-8">制定日：2026年5月3日</p>
        </div>

        <div className="mt-8">
          <a href="/" className="text-blue-500 hover:text-blue-400">← サービスに戻る</a>
        </div>
      </div>
    </main>
  );
}