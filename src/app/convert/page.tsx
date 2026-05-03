"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";
import { UserButton, useUser } from "@clerk/nextjs";

export default function ConvertPage() {
  const { isSignedIn, user } = useUser();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [latex, setLatex] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);

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
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", imageFile);
      const res = await fetch("/api/convert", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLatex(data.latex);
      fetch("/api/usage")
        .then((r) => r.json())
        .then(setUsage);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "変換に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(latex);
    toast.success("コピーしました");
  };

  const isDisabled = !imageFile || loading || usage?.remaining === 0;

  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", color: "#1A1A1A", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Toaster position="top-right" />

      {/* ヘッダー */}
      <header style={{ borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: "15px", fontWeight: "700", color: "#0017C1", textDecoration: "none" }}>
            画像をLaTeXに変換
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {isSignedIn && usage && (
              <div style={{ fontSize: "13px", textAlign: "right" }}>
                <div style={{ color: "#888" }}>今月の変換枚数</div>
                <div style={{ fontWeight: "700", color: usage.remaining <= 5 ? "#B91C1C" : "#0017C1" }}>
                  {usage.used} / {usage.limit} 枚
                </div>
              </div>
            )}
            {isSignedIn && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>
                  {user?.emailAddresses[0].emailAddress}
                </span>
                <UserButton />
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "48px 40px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px", color: "#1A1A1A" }}>数式 → LaTeX 変換</h1>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "40px" }}>日本語テキスト・数式の混在画像に対応</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {/* 左：画像アップロード */}
          <div>
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "#0017C1" : "#E5E5E5"}`,
                background: isDragActive ? "#EEF2FF" : "#F8F8F8",
                borderRadius: "4px",
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input {...getInputProps()} />
              {image ? (
                <img src={image} alt="preview" style={{ maxHeight: "256px", margin: "0 auto", display: "block", borderRadius: "4px" }} />
              ) : (
                <div style={{ color: "#999" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>📷</div>
                  <p style={{ margin: "0 0 4px", fontSize: "14px" }}>画像をドラッグ＆ドロップ</p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px" }}>または クリックして選択</p>
                  <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#bbb" }}>PNG / JPG / WEBP・5MB以下</p>
                </div>
              )}
            </div>

            <button
              onClick={convert}
              disabled={isDisabled}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "13px",
                borderRadius: "4px",
                border: "none",
                fontSize: "15px",
                fontWeight: "700",
                cursor: isDisabled ? "not-allowed" : "pointer",
                background: isDisabled ? "#E5E5E5" : "#0017C1",
                color: isDisabled ? "#999" : "#fff",
                transition: "background 0.15s",
              }}
            >
              {loading ? "変換中..." : usage?.remaining === 0 ? "無料枠を使い切りました" : "LaTeX に変換"}
            </button>

            {usage?.remaining === 0 && (
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <p style={{ fontSize: "13px", color: "#B91C1C", marginBottom: "10px" }}>
                  今月の無料枠（10枚）を使い切りました
                </p>
                <button
                  onClick={async () => {
                    const res = await fetch("/api/checkout", { method: "POST" });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }}
                  style={{ background: "#0017C1", color: "#fff", padding: "10px 24px", borderRadius: "4px", border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                >
                  Basicプランにアップグレード（¥500/月）
                </button>
              </div>
            )}
          </div>

          {/* 右：LaTeX出力 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#888" }}>出力 LaTeX</span>
              {latex && (
                <button
                  onClick={copy}
                  style={{ fontSize: "12px", background: "#F8F8F8", border: "1px solid #E5E5E5", padding: "4px 12px", borderRadius: "4px", cursor: "pointer", color: "#1A1A1A" }}
                >
                  コピー
                </button>
              )}
            </div>
            <textarea
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder="変換結果がここに表示されます..."
              style={{
                width: "100%",
                height: "320px",
                background: "#F8F8F8",
                border: "1px solid #E5E5E5",
                borderRadius: "4px",
                padding: "16px",
                fontSize: "13px",
                fontFamily: "monospace",
                color: "#1A1A1A",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <p style={{ fontSize: "12px", color: "#bbb", marginTop: "8px" }}>結果は直接編集できます</p>
          </div>
        </div>
      </div>
    </main>
  );
}
