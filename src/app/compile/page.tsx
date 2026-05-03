'use client';
import { useState, useEffect } from 'react';
import katex from 'katex';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type DisplayMode = 'display' | 'inline' | 'text';
type BgType = 'white' | 'transparent' | 'dark';

const PRESETS = [
  { label: 'オイラーの等式',         val: 'e^{i\\pi} + 1 = 0' },
  { label: 'ガウス積分',             val: '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}' },
  { label: 'マクスウェル方程式',      val: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}' },
  { label: 'シュレーディンガー方程式', val: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi' },
  { label: 'フーリエ変換',           val: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)\\,e^{-2\\pi ix\\xi}\\,dx' },
  { label: 'コーシーの積分公式',      val: 'f(a) = \\frac{1}{2\\pi i}\\oint_{\\gamma}\\frac{f(z)}{z-a}\\,dz' },
  { label: '二項定理',               val: '(x+y)^n = \\sum_{k=0}^n \\binom{n}{k} x^k y^{n-k}' },
  { label: 'テイラー展開',           val: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n' },
];

const CHECKER_BG = `repeating-conic-gradient(#d0d0d0 0% 25%, #ffffff 0% 50%) 0 0 / 16px 16px`;

export default function CompilePage() {
  const [latexInput, setLatexInput] = useState<string>(PRESETS[0].val);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('display');
  const [fontSize, setFontSize] = useState<number>(64);
  const [currentBg, setCurrentBg] = useState<BgType>('white');
  const [rendered, setRendered] = useState<string>('');
  const [error, setError] = useState<string>('');

  // KaTeXレンダリング
  useEffect(() => {
    if (!latexInput.trim()) {
      setRendered('');
      setError('');
      return;
    }
    try {
      const html = katex.renderToString(latexInput, {
        throwOnError: true,
        displayMode: displayMode === 'display',
        output: 'html',
      });
      setRendered(html);
      setError('');
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
    }
  }, [latexInput, displayMode]);

  // プレビューの背景スタイル
  const previewBgStyle = (): React.CSSProperties => {
    if (currentBg === 'dark') return { background: '#0f0f14' };
    if (currentBg === 'transparent') return { background: CHECKER_BG };
    return { background: '#ffffff' };
  };

  // SVGビルド
  const buildSVGString = (w: number, h: number, padding: number): string => {
    const textColor = currentBg === 'dark' ? '#f0f0f0' : '#1A1A1A';
    const bgFill =
      currentBg === 'white' ? '#ffffff' : currentBg === 'dark' ? '#0f0f14' : 'none';

    const katexCSS = Array.from(document.styleSheets)
      .filter((s) => { try { return !!(s.href?.includes('katex')); } catch { return false; } })
      .map((s) => { try { return Array.from(s.cssRules).map((r) => r.cssText).join('\n'); } catch { return ''; } })
      .join('\n');

    const previewEl = document.getElementById('katex-preview-inner');
    const htmlContent = previewEl?.innerHTML ?? '';

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${bgFill !== 'none' ? `<rect width="${w}" height="${h}" fill="${bgFill}"/>` : ''}
  <foreignObject x="${padding}" y="${padding}" width="${w - padding * 2}" height="${h - padding * 2}">
    <xhtml:div xmlns="http://www.w3.org/1999/xhtml">
      <style>${katexCSS}</style>
      <div style="display:flex;align-items:center;justify-content:center;
        font-size:${fontSize}px;color:${textColor};width:${w - padding * 2}px;">
        ${htmlContent}
      </div>
    </xhtml:div>
  </foreignObject>
</svg>`;
  };

  // SVGエクスポート
  const exportSVG = () => {
    const previewEl = document.getElementById('katex-preview-inner');
    if (!previewEl) return;
    const padding = 48;
    const rect = previewEl.getBoundingClientRect();
    const w = Math.max(rect.width + padding * 2, 200);
    const h = Math.max(rect.height + padding * 2, 100);
    const svgString = buildSVGString(w, h, padding);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'latex-preview.svg';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // PNGエクスポート
  const exportPNG = async () => {
    const previewEl = document.getElementById('katex-preview-inner');
    if (!previewEl) return;
    const scale = 3;
    const padding = 48;
    const rect = previewEl.getBoundingClientRect();
    const w = Math.max(rect.width + padding * 2, 200);
    const h = Math.max(rect.height + padding * 2, 100);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    if (currentBg === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    } else if (currentBg === 'dark') {
      ctx.fillStyle = '#0f0f14';
      ctx.fillRect(0, 0, w, h);
    } else {
      const cs = 8;
      for (let x = 0; x < w; x += cs) {
        for (let y = 0; y < h; y += cs) {
          ctx.fillStyle =
            (Math.floor(x / cs) + Math.floor(y / cs)) % 2 === 0 ? '#e0e0e0' : '#ffffff';
          ctx.fillRect(x, y, cs, cs);
        }
      }
    }

    const svgString = buildSVGString(w, h, padding);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const link = document.createElement('a');
    link.download = 'latex-preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // --- スタイル定数 ---
  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#666666',
    marginBottom: '8px',
    letterSpacing: '0.03em',
    display: 'block',
  };

  const segBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: active ? '600' : '400',
    border: '1px solid #E5E5E5',
    background: active ? '#0017C1' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#666666',
    cursor: 'pointer',
    transition: 'all 0.12s',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        color: '#1A1A1A',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toaster position="top-right" />
      <Header />

      <main style={{ flex: 1, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '40px 40px 56px' }}>
        {/* ページタイトル */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px', color: '#1A1A1A' }}>
            LaTeX 数式プレビュー
          </h1>
          <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
            LaTeX数式をリアルタイムでレンダリング。PNG/SVGでエクスポートできます。
          </p>
        </div>

        {/* メインレイアウト */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {/* ─── プレビューエリア（左） ─── */}
          <div
            style={{
              flex: 1,
              minWidth: '280px',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 32px',
                ...previewBgStyle(),
              }}
            >
              {error ? (
                <div
                  style={{
                    color: '#B91C1C',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    maxWidth: '100%',
                    wordBreak: 'break-all',
                  }}
                >
                  {error}
                </div>
              ) : rendered ? (
                <div
                  id="katex-preview-inner"
                  dangerouslySetInnerHTML={{ __html: rendered }}
                  style={{
                    fontSize: `${fontSize}px`,
                    color: currentBg === 'dark' ? '#f0f0f0' : '#1A1A1A',
                    lineHeight: 1.4,
                  }}
                />
              ) : (
                <div style={{ color: '#bbb', fontSize: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>∑</div>
                  右のパネルに数式を入力してください
                </div>
              )}
            </div>
          </div>

          {/* ─── コントロールパネル（右） ─── */}
          <div
            style={{
              width: '320px',
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* ① 入力エリア */}
            <div>
              <label style={labelStyle}>LaTeX 入力</label>
              <textarea
                value={latexInput}
                onChange={(e) => setLatexInput(e.target.value)}
                placeholder={`\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}`}
                rows={5}
                style={{
                  width: '100%',
                  fontFamily: 'Menlo, Monaco, monospace',
                  fontSize: '13px',
                  color: '#1A1A1A',
                  background: '#F8F8F8',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* ② 表示モード */}
            <div>
              <label style={labelStyle}>表示モード</label>
              <div style={{ display: 'flex' }}>
                {(['display', 'inline', 'text'] as DisplayMode[]).map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setDisplayMode(m)}
                    style={{
                      ...segBtn(displayMode === m),
                      borderLeft: i > 0 ? 'none' : '1px solid #E5E5E5',
                      borderRadius:
                        i === 0 ? '4px 0 0 4px' : i === 2 ? '0 4px 4px 0' : '0',
                    }}
                  >
                    {m === 'display' ? 'Display（数式）' : m === 'inline' ? 'Inline' : 'Text'}
                  </button>
                ))}
              </div>
            </div>

            {/* ③ フォントサイズ */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>サイズ</label>
                <span style={{ fontSize: '12px', color: '#0017C1', fontWeight: '600' }}>{fontSize}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={120}
                step={1}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0017C1', cursor: 'pointer' }}
              />
            </div>

            {/* ④ 背景設定 */}
            <div>
              <label style={labelStyle}>背景</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* 白 */}
                <button
                  onClick={() => setCurrentBg('white')}
                  title="白"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: `2px solid ${currentBg === 'white' ? '#0017C1' : '#E5E5E5'}`,
                    cursor: 'pointer',
                    boxShadow: currentBg === 'white' ? '0 0 0 2px #E8EEFF' : 'none',
                    transition: 'all 0.12s',
                  }}
                />
                {/* 透過（チェッカー） */}
                <button
                  onClick={() => setCurrentBg('transparent')}
                  title="透過"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: CHECKER_BG,
                    border: `2px solid ${currentBg === 'transparent' ? '#0017C1' : '#E5E5E5'}`,
                    cursor: 'pointer',
                    boxShadow: currentBg === 'transparent' ? '0 0 0 2px #E8EEFF' : 'none',
                    transition: 'all 0.12s',
                  }}
                />
                {/* ダーク */}
                <button
                  onClick={() => setCurrentBg('dark')}
                  title="ダーク"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0f0f14',
                    border: `2px solid ${currentBg === 'dark' ? '#0017C1' : '#E5E5E5'}`,
                    cursor: 'pointer',
                    boxShadow: currentBg === 'dark' ? '0 0 0 2px #E8EEFF' : 'none',
                    transition: 'all 0.12s',
                  }}
                />
              </div>
            </div>

            {/* ⑤ プリセット */}
            <div>
              <label style={labelStyle}>プリセット</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setLatexInput(p.val)}
                    style={{
                      textAlign: 'left',
                      padding: '7px 12px',
                      fontSize: '12px',
                      color: latexInput === p.val ? '#0017C1' : '#1A1A1A',
                      background: latexInput === p.val ? '#EEF2FF' : '#FFFFFF',
                      border: `1px solid ${latexInput === p.val ? '#0017C1' : '#E5E5E5'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      fontWeight: latexInput === p.val ? '600' : '400',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ⑥ エクスポートボタン */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={exportSVG}
                disabled={!rendered}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  border: '1px solid #0017C1',
                  background: '#FFFFFF',
                  color: rendered ? '#0017C1' : '#bbb',
                  borderColor: rendered ? '#0017C1' : '#E5E5E5',
                  cursor: rendered ? 'pointer' : 'not-allowed',
                  transition: 'all 0.12s',
                }}
              >
                SVG
              </button>
              <button
                onClick={exportPNG}
                disabled={!rendered}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  border: 'none',
                  background: rendered ? '#0017C1' : '#E5E5E5',
                  color: rendered ? '#FFFFFF' : '#999',
                  cursor: rendered ? 'pointer' : 'not-allowed',
                  transition: 'all 0.12s',
                }}
              >
                PNG
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
