"use client";
import { useState, useCallback, useEffect } from "react";
import LatexPreview from "@/components/LatexPreview";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";

type OutputMode = "simple" | "full";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  redirectUrl?: string;
}

export default function PdfConvertTool({ redirectUrl = "/pdf_convert" }: Props) {
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [latex, setLatex] = useState("");
  const [loading, setLoading] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>("simple");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  const [limitError, setLimitError] = useState<{ required: number; remaining: number } | null>(null);
  const [loadingStep, setLoadingStep] = useState<"upload" | "ai" | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage);
  }, [isSignedIn]);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPdfFile(file);
    setLatex("");
    setLimitError(null);
    setPageCount(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const ab = await file.arrayBuffer();
      const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      // ページ数取得失敗はサーバー側バリデーションに委ねる
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const convert = async () => {
    if (!pdfFile) return;
    if (!isSignedIn) {
      openSignIn({ fallbackRedirectUrl: redirectUrl });
      return;
    }
    setLoading(true);
    setLoadingStep("upload");
    const uploadTimer = setTimeout(() => setLoadingStep("ai"), 600);
    try {
      const form = new FormData();
      form.append("pdf", pdfFile);
      form.append("outputMode", outputMode);
      const res = await fetch("/api/pdf_convert", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "conversion_limit_exceeded") {
          setLimitError({ required: data.required, remaining: data.remaining });
          return;
        }
        throw new Error(data.message || data.error || "変換に失敗しました");
      }
      setLimitError(null);
      setLatex(data.latex);
      if (data.pageCount) setPageCount(data.pageCount);
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

  const isDisabled = !pdfFile || loading || (isSignedIn ? usage?.remaining === 0 : false);

  const segBtnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "#0017C1" : "#FFFFFF",
    color: active ? "#FFFFFF" : "#666666",
    border: "1px solid #E5E5E5",
    padding: "6px 16px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.12s",
  });

  return (
    <>
      <Toaster position="top-right" />

      {/* 利用状況 / ログインCTA */}
      {isLoaded && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          {isSignedIn && usage ? (
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
            <SignInButton mode="modal" fallbackRedirectUrl={redirectUrl}>
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
          ) : null}
        </div>
      )}

      {/* PDFアップロードエリア */}
      <div
        {...getRootProps()}
        style={{
          height: "200px",
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
        {pdfFile ? (
          <div style={{ textAlign: "center", color: "#1A1A1A" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📑</div>
            <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "600" }}>{pdfFile.name}</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{formatBytes(pdfFile.size)}</p>
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#aaa" }}>クリックして別のPDFを選択</p>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#999" }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📑</div>
            <p style={{ margin: "0 0 4px", fontSize: "14px" }}>PDFをドラッグ＆ドロップ</p>
            <p style={{ margin: "4px 0 0", fontSize: "13px" }}>または クリックして選択</p>
            <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#bbb" }}>PDF・4MB以下・10ページ以内</p>
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
            style={{ ...segBtnStyle(outputMode === "simple"), borderRadius: "4px 0 0 4px" }}
          >
            数式・テキストのみ
          </button>
          <button
            onClick={() => setOutputMode("full")}
            style={{ ...segBtnStyle(outputMode === "full"), borderLeft: "none", borderRadius: "0 4px 4px 0" }}
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
              ② AI変換中
            </span>
            <span style={{ fontSize: "11px", color: "#ccc" }}>›</span>
            <span style={{ fontSize: "12px", color: "#999" }}>③ 完了</span>
          </div>
          <p style={{ fontSize: "13px", color: "#555", margin: "0 0 8px" }}>
            {loadingStep === "upload"
              ? "ファイルをアップロード中..."
              : pageCount
              ? `${pageCount}ページを1ページずつ変換中です。しばらくお待ちください...`
              : "1ページずつ変換中です。しばらくお待ちください..."}
          </p>
          <div style={{ width: "100%", height: "6px", backgroundColor: "#E5E5E5", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", backgroundColor: "#0017C1", borderRadius: "4px", width: "40%", animation: "indeterminate 1.5s infinite ease-in-out" }} />
          </div>
        </div>
      )}

      {/* ページ数不足エラー */}
      {limitError && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "4px",
            padding: "16px 20px",
            marginBottom: "12px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#B91C1C", fontWeight: "600", margin: "0 0 4px" }}>
            変換枚数が不足しています
          </p>
          <p style={{ fontSize: "13px", color: "#7F1D1D", margin: "0 0 12px" }}>
            このPDFは <strong>{limitError.required}ページ</strong> 分消費しますが、残り枚数は{" "}
            <strong>{limitError.remaining}枚</strong> です。
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
              padding: "9px 20px",
              borderRadius: "4px",
              border: "none",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Basicプランにアップグレード（¥500/月）
          </button>
        </div>
      )}

      {/* アップグレード案内（残り0枚） */}
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
    </>
  );
}
