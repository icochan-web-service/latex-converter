"use client";
import { useEffect, useRef } from "react";

interface Props {
  latex: string;
}

export default function LatexPreview({ latex }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!latex.trim()) {
      el.innerHTML = "";
      return;
    }
    el.textContent = latex;
    import("katex/contrib/auto-render")
      .then((mod) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const renderMathInElement = (mod as any).default ?? mod;
        renderMathInElement(el, {
          delimiters: [
            { left: "$$",            right: "$$",            display: true  },
            { left: "$",             right: "$",             display: false },
            { left: "\\[",           right: "\\]",           display: true  },
            { left: "\\(",           right: "\\)",           display: false },
            { left: "\\begin{equation}",  right: "\\end{equation}",  display: true },
            { left: "\\begin{equation*}", right: "\\end{equation*}", display: true },
            { left: "\\begin{align}",     right: "\\end{align}",     display: true },
            { left: "\\begin{align*}",    right: "\\end{align*}",    display: true },
          ],
          throwOnError: false,
          ignoredTags: ["script", "noscript", "style", "textarea", "pre"],
        });
      })
      .catch(() => {});
  }, [latex]);

  if (!latex.trim()) return null;

  return (
    <div style={{ marginTop: "16px" }}>
      {/* ヘッダーバー */}
      <div
        style={{
          backgroundColor: "#0017C1",
          color: "#FFFFFF",
          padding: "8px 16px",
          borderRadius: "4px 4px 0 0",
          fontSize: "13px",
          fontWeight: "600",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>👁 数式プレビュー</span>
        <span style={{ fontSize: "11px", opacity: 0.8 }}>powered by KaTeX</span>
      </div>

      {/* プレビュー本体 */}
      <div
        ref={containerRef}
        style={{
          backgroundColor: "#F5F7FF",
          border: "1px solid #0017C1",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
          padding: "16px",
          minHeight: "80px",
          maxHeight: "400px",
          overflowY: "auto",
          fontSize: "14px",
          lineHeight: "1.8",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      />

      <p style={{ fontSize: "12px", color: "#bbb", marginTop: "6px" }}>
        ※ TikZ・表レイアウト等はプレビュー非対応です
      </p>
    </div>
  );
}
