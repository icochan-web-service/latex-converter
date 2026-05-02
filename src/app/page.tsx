"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [latex, setLatex] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);

  // 変換枚数を取得
  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage);
  }, [isSignedIn]);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setLatex("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  const convert = async () => {
    if (!imageFile) return;
    if (!isSignedIn) {
      toast.error("変換するにはログインが必要です");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", imageFile);
      const res = await fetch("/api/convert", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLatex(data.latex);
      // 変換後に枚数を更新
      fetch("/api/usage")
        .then((r) => r.json())
        .then(setUsage);
    } catch (e: any) {
      toast.error(e.message || "変換に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(latex);
    toast.success("コピーしました");
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <Toaster position="top-right" />

      {/* ヘッダー */}
      <div className="max-w-4xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">数式 → LaTeX 変換</h1>
          <p className="text-gray-400">日本語テキスト・数式の混在画像に対応</p>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn && usage && (
            <div className="text-sm text-right">
              <div className="text-gray-400">今月の変換枚数</div>
              <div className={`font-bold ${usage.remaining <= 5 ? "text-red-400" : "text-blue-400"}`}>
                {usage.used} / {usage.limit} 枚
              </div>
            </div>
          )}
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {user.emailAddresses[0].emailAddress}
              </span>
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition">
                ログイン
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左：画像アップロード */}
        <div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
              ${isDragActive
                ? "border-blue-400 bg-blue-950/30"
                : "border-gray-700 hover:border-gray-500"}`}
          >
            <input {...getInputProps()} />
            {image ? (
              <img src={image} alt="preview" className="max-h-64 mx-auto rounded-lg" />
            ) : (
              <div className="text-gray-500">
                <div className="text-4xl mb-3">📷</div>
                <p>画像をドラッグ＆ドロップ</p>
                <p className="text-sm mt-1">または クリックして選択</p>
                <p className="text-xs mt-3">PNG / JPG / WEBP・5MB以下</p>
              </div>
            )}
          </div>

          <button
            onClick={convert}
            disabled={!imageFile || loading || (usage?.remaining === 0)}
            className="w-full mt-4 py-3 rounded-xl font-bold text-white
              bg-blue-600 hover:bg-blue-500
              disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
              transition"
          >
            {loading ? "変換中..." : usage?.remaining === 0 ? "無料枠を使い切りました" : "LaTeX に変換"}
          </button>

          {usage?.remaining === 0 && (
            <div className="text-center mt-2">
              <p className="text-sm text-red-400 mb-2">
                今月の無料枠（10枚）を使い切りました
              </p>
              <button
                onClick={async () => {
                  const res = await fetch("/api/checkout", { method: "POST" });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg text-sm font-bold transition"
              >
                Basicプランにアップグレード（¥500/月）
              </button>
            </div>
          )}
        </div>

        {/* 右：LaTeX出力 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">出力 LaTeX</span>
            {latex && (
              <button
                onClick={copy}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition"
              >
                コピー
              </button>
            )}
          </div>
          <textarea
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder="変換結果がここに表示されます..."
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4
              text-sm font-mono text-gray-200 resize-none
              focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-600 mt-2">結果は直接編集できます</p>
        </div>
      </div>
    </main>
  );
}