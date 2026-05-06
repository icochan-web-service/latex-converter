"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LatexPreview from "@/components/LatexPreview";

type OutputMode = "simple" | "full";

export default function ConvertPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [latex, setLatex] = useState("");
  const [loading, setLoading] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>("simple");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  const [loadingStep, setLoadingStep] = useState<"upload" | "ai" | null>(null);

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
      openSignIn({ fallbackRedirectUrl: "/convert" });
      return;
    }
    setLoading(true);
    setLoadingStep("upload");
    const uploadTimer = setTimeout(() => setLoadingStep("ai"), 600);
    try {
      const form = new FormData();
      form.append("image", imageFile);
      form.append("outputMode", outputMode);
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
      clearTimeout(uploadTimer);
      setLoading(false);
      setLoadingStep(null);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDisabled = !imageFile || loading || (isSignedIn ? usage?.remaining === 0 : false);

  const segBtnStyle = (active: boolean) => ({
    background: active ? "#0017C1" : "#FFFFFF",
    color: active ? "#FFFFFF" : "#666666",
    border: "1px solid #E5E5E5",
    padding: "6px 16px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.12s",
  } as React.CSSProperties);

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
      <Toaster position="top-right" />
      <Header />

      <main style={{ flex: 1, padding: "48px 40px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* ページタイトル + 利用状況 / ログインCTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px", color: "#1A1A1A" }}>
              画像 → LaTeX 変換
            </h1>
            <p style={{ fontSize: "14px", color: "#666666", margin: 0 }}>
              日本語テキスト・数式の混在画像に対応
            </p>
          </div>

          {isLoaded && (
            isSignedIn && usage ? (
              <div
                style={{
                  background: "#F8F9FF",
                  border: "1px solid #E8EEFF",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  textAlign: "right",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666666", marginBottom: "2px" }}>今月の変換枚数</div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: usage.remaining <= 5 ? "#B91C1C" : "#0017C1",
                  }}
                >
                  {usage.used} / {usage.limit} 枚
                </div>
              </div>
            ) : !isSignedIn ? (
              <SignInButton mode="modal" fallbackRedirectUrl="/convert">
                <button
                  style={{
                    background: "#0017C1",
                    color: "#fff",
                    padding: "10px 24px",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ログインして変換する
                </button>
              </SignInButton>
            ) : null
          )}
        </div>

        {/* 画像アップロードエリア */}
        <div
          {...getRootProps()}
          style={{
            height: "240px",
            border: `2px dashed ${isDragActive ? "#0017C1" : "#E5E5E5"}`,
            background: isDragActive ? "#EEF2FF" : "#F8F8F8",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s",
            marginBottom: "12px",
            overflow: "hidden",
          }}
        >
          <input {...getInputProps()} />
          {image ? (
            <img
              src={image}
              alt="preview"
              style={{ maxHeight: "220px", maxWidth: "100%", borderRadius: "4px", objectFit: "contain" }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#999" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>📷</div>
              <p style={{ margin: "0 0 4px", fontSize: "14px" }}>画像をドラッグ＆ドロップ</p>
              <p style={{ margin: "4px 0 0", fontSize: "13px" }}>または クリックして選択</p>
              <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#bbb" }}>
                PNG / JPG / WEBP・3MB以下
              </p>
            </div>
          )}
        </div>

        {/* 設定エリア */}
        <div
          style={{
            background: "#F8F9FF",
            border: "1px solid #E5E5E5",
            borderRadius: "4px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#666666", whiteSpace: "nowrap" }}>出力形式</span>
          <div style={{ display: "flex" }}>
            <button
              onClick={() => setOutputMode("simple")}
              style={{
                ...segBtnStyle(outputMode === "simple"),
                borderRadius: "4px 0 0 4px",
              }}
            >
              数式・テキストのみ
            </button>
            <button
              onClick={() => setOutputMode("full")}
              style={{
                ...segBtnStyle(outputMode === "full"),
                borderLeft: "none",
                borderRadius: "0 4px 4px 0",
              }}
            >
              プリアンブル付き
            </button>
          </div>
        </div>

        {/* 変換ボタン */}
        <button
          onClick={convert}
          disabled={isDisabled}
          style={{
            width: "100%",
            marginBottom: "12px",
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
          {loading
            ? "変換中..."
            : isSignedIn && usage?.remaining === 0
            ? "無料枠を使い切りました"
            : "LaTeX に変換"}
        </button>

        {/* プログレスバー */}
        {loadingStep && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: loadingStep === "upload" ? "#0017C1" : "#999", fontWeight: loadingStep === "upload" ? "600" : "400" }}>
                ① アップロード中
              </span>
              <span style={{ fontSize: "11px", color: "#ccc" }}>›</span>
              <span style={{ fontSize: "12px", color: loadingStep === "ai" ? "#0017C1" : "#999", fontWeight: loadingStep === "ai" ? "600" : "400" }}>
                ② 変換中
              </span>
              <span style={{ fontSize: "11px", color: "#ccc" }}>›</span>
              <span style={{ fontSize: "12px", color: "#999" }}>③ 完了</span>
            </div>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 8px" }}>
              {loadingStep === "upload" ? "ファイルをアップロード中..." : "変換中です。しばらくお待ちください..."}
            </p>
            <div style={{ width: "100%", height: "6px", backgroundColor: "#E5E5E5", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", backgroundColor: "#0017C1", borderRadius: "4px", width: "40%", animation: "indeterminate 1.5s infinite ease-in-out" }} />
            </div>
          </div>
        )}

        {/* アップグレード案内 */}
        {isSignedIn && usage?.remaining === 0 && (
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", color: "#B91C1C", marginBottom: "8px" }}>
              今月の無料枠（10枚）を使い切りました
            </p>
            <button
              onClick={async () => {
                const res = await fetch("/api/checkout", { method: "POST" });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
              style={{
                background: "#0017C1",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "4px",
                border: "none",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Basicプランにアップグレード（¥500/月）
            </button>
          </div>
        )}

        {/* 出力エリアヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#666666" }}>出力 LaTeX</span>
          {latex && (
            <button
              onClick={copy}
              style={{
                fontSize: "12px",
                background: copied ? "#0A3FA0" : "#0017C1",
                color: "#FFFFFF",
                padding: "6px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s",
                fontWeight: "600",
              }}
            >
              {copied ? "✓ コピー済み" : "コピー"}
            </button>
          )}
        </div>

        {/* 出力テキストエリア */}
        <textarea
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          placeholder="変換結果がここに表示されます..."
          style={{
            width: "100%",
            height: "240px",
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
        <p style={{ fontSize: "12px", color: "#bbb", marginTop: "6px" }}>結果は直接編集できます</p>
        <LatexPreview latex={latex} />

        {/* FAQ */}
        <section style={{ marginTop: "64px", borderTop: "1px solid #E5E5E5", paddingTop: "48px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1A1A1A", marginBottom: "28px", marginTop: 0 }}>
            よくある質問
          </h2>
          {[
            {
              q: "どの画像形式に対応していますか？",
              a: "PNG・JPG・JPEG・WEBP形式に対応しています。ファイルサイズは3MB以内でご利用ください。",
            },
            {
              q: "日本語テキストと数式が混在した画像も変換できますか？",
              a: "はい、対応しています。教科書・試験問題・ノートなど、日本語テキストと数式が混在した画像を高精度でLaTeXに変換します。",
            },
            {
              q: "変換結果の精度はどのくらいですか？",
              a: "Google Gemini AIを使用しており、印刷された数式は高精度で変換できます。複雑な数式や特殊記号が含まれる場合は、変換後に内容を確認・修正することをお勧めします。",
            },
            {
              q: "出力形式「数式・テキストのみ」と「プリアンブル付き」の違いは？",
              a: "「数式・テキストのみ」は\\begin{document}〜\\end{document}の中身だけを出力します。「プリアンブル付き」は\\documentclassから始まる完全なLaTeXファイルとして出力します。",
            },
            {
              q: "無料プランで使える変換枚数は？",
              a: "月10枚まで無料でご利用いただけます。より多く使いたい方はBasicプラン（¥500/月・月500枚）をご利用ください。",
            },
          ].map((item, i, arr) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid #E5E5E5",
                paddingTop: "20px",
                paddingBottom: "20px",
                borderBottom: i === arr.length - 1 ? "1px solid #E5E5E5" : "none",
              }}
            >
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#1A1A1A", margin: "0 0 8px" }}>
                Q. {item.q}
              </p>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.8", margin: 0 }}>
                A. {item.a}
              </p>
            </div>
          ))}
        </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
