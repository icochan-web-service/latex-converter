"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [latex, setLatex] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", imageFile);
      const res = await fetch("/api/convert", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLatex(data.latex);
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">数式 → LaTeX 変換</h1>
          <p className="text-gray-400">日本語テキスト・数式の混在画像に対応</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              disabled={!imageFile || loading}
              className="w-full mt-4 py-3 rounded-xl font-bold text-white
                bg-blue-600 hover:bg-blue-500
                disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                transition"
            >
              {loading ? "変換中..." : "LaTeX に変換"}
            </button>
          </div>

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
      </div>
    </main>
  );
}