export default function Terms() {
  return (
    <main className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">利用規約</h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第1条（適用）</h2>
            <p>本規約は、当サービス（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意した上で本サービスを利用するものとします。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第2条（利用登録）</h2>
            <p>本サービスはGoogleアカウントによる認証を通じて利用登録を行います。登録情報に虚偽がないことを保証するものとします。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第3条（料金・支払い）</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>無料プラン：月10枚まで無料で利用できます</li>
              <li>Basicプラン：月額¥500で月500枚まで利用できます</li>
              <li>料金はStripeを通じて毎月自動的に請求されます</li>
              <li>月途中でのアップグレードは即時反映されます</li>
              <li>返金は原則として行いません</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第4条（禁止事項）</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>不正アクセスやサービスへの攻撃</li>
              <li>他のユーザーへの迷惑行為</li>
              <li>本サービスの変換結果を大量に転売する行為</li>
              <li>本サービスを自動化ツールで大量利用する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第5条（サービスの変更・停止）</h2>
            <p>当サービスは、事前の通知なくサービスの内容を変更・停止することがあります。これによりユーザーに生じた損害について、当サービスは責任を負いません。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第6条（免責事項）</h2>
            <p>本サービスの変換結果の正確性は保証しません。変換結果の利用によって生じた損害について、当サービスは責任を負いません。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第7条（著作権）</h2>
            <p>ユーザーがアップロードした画像の著作権はユーザーに帰属します。当サービスはサービス提供の目的以外に画像を使用しません。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第8条（準拠法・管轄裁判所）</h2>
            <p>本規約は日本法に準拠します。本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
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