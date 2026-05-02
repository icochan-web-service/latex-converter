export default function Success() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">ありがとうございます！</h1>
        <p className="text-gray-400 mb-8">Basicプランへのアップグレードが完了しました。</p>
        
          <a href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          サービスに戻る
        </a>
      </div>
    </main>
  );
}