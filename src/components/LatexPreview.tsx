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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#666666" }}>プレビュー</span>
      </div>
      <div
        ref={containerRef}
        style={{
          background: "#F9F9F9",
          border: "1px solid #E5E5E5",
          borderRadius: "4px",
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
