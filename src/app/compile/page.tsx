'use client';
import { useState, useEffect, useRef } from 'react';
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
  const katexCSSRef = useRef<string>('');

  // KaTeX CSSをfetchで取得（一度だけ）
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css')
      .then((r) => r.text())
      .then((css) => { katexCSSRef.current = css; })
      .catch(() => {});
  }, []);

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

    const previewEl = document.getElementById('katex-preview-inner');
    const htmlContent = previewEl?.innerHTML ?? '';

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${bgFill !== 'none' ? `<rect width="${w}" height="${h}" fill="${bgFill}"/>` : ''}
  <foreignObject x="${padding}" y="${padding}" width="${w - padding * 2}" height="${h - padding * 2}">
    <xhtml:div xmlns="http://www.w3.org/1999/xhtml">
      <style>${katexCSSRef.current}</style>
      <div style="display:flex;align-items:center;justify-content:center;
        font-size:${fontSize}px;color:${textColor};width:${w - padding * 2}px;padding:0;margin:0;">
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

  // PNGエクスポート（html2canvasでDOMをそのままキャプチャ）
  const exportPNG = async () => {
    const areaEl = document.getElementById('katex-preview-area');
    if (!areaEl) return;
    const { default: html2canvas } = await import('html2canvas');
    const bgColor =
      currentBg === 'white' ? '#ffffff' :
      currentBg === 'dark'  ? '#0f0f14' : null;
    const canvas = await html2canvas(areaEl, {
      scale: 3,
      useCORS: true,
      backgroundColor: bgColor,
      logging: false,
    });
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

      <main style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '40px 40px 56px' }}>
        {/* ページタイトル */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px', color: '#1A1A1A' }}>
            LaTeX 数式 → 画像変換
          </h1>
          <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
            LaTeX数式をリアルタイムでレンダリング。PNG/SVGでエクスポートできます。
          </p>
        </div>

        {/* ─── 入力エリア ─── */}
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>LaTeX 入力</label>
          <textarea
            value={latexInput}
            onChange={(e) => setLatexInput(e.target.value)}
            placeholder={`\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}`}
            rows={7}
            style={{
              width: '100%',
              minHeight: '140px',
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

        {/* ─── コントロール行 ─── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'flex-end',
            marginBottom: '12px',
            padding: '12px 16px',
            background: '#F8F9FF',
            border: '1px solid #E5E5E5',
            borderRadius: '4px',
          }}
        >
          {/* 表示モード */}
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
                  {m === 'display' ? 'Display' : m === 'inline' ? 'Inline' : 'Text'}
                </button>
              ))}
            </div>
          </div>

          {/* フォントサイズ */}
          <div style={{ flex: 1, minWidth: '140px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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

          {/* 背景 */}
          <div>
            <label style={labelStyle}>背景</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentBg('white')}
                title="白"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: '#ffffff',
                  border: `2px solid ${currentBg === 'white' ? '#0017C1' : '#E5E5E5'}`,
                  cursor: 'pointer', boxShadow: currentBg === 'white' ? '0 0 0 2px #E8EEFF' : 'none', transition: 'all 0.12s',
                }}
              />
              <button
                onClick={() => setCurrentBg('transparent')}
                title="透過"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: CHECKER_BG,
                  border: `2px solid ${currentBg === 'transparent' ? '#0017C1' : '#E5E5E5'}`,
                  cursor: 'pointer', boxShadow: currentBg === 'transparent' ? '0 0 0 2px #E8EEFF' : 'none', transition: 'all 0.12s',
                }}
              />
              <button
                onClick={() => setCurrentBg('dark')}
                title="ダーク"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: '#0f0f14',
                  border: `2px solid ${currentBg === 'dark' ? '#0017C1' : '#E5E5E5'}`,
                  cursor: 'pointer', boxShadow: currentBg === 'dark' ? '0 0 0 2px #E8EEFF' : 'none', transition: 'all 0.12s',
                }}
              />
            </div>
          </div>

        </div>

        {/* ─── プリセット ─── */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>プリセット</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setLatexInput(p.val)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: latexInput === p.val ? '#0017C1' : '#1A1A1A',
                  background: latexInput === p.val ? '#EEF2FF' : '#FFFFFF',
                  border: `1px solid ${latexInput === p.val ? '#0017C1' : '#E5E5E5'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                  fontWeight: latexInput === p.val ? '600' : '400',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── プレビューエリア（下） ─── */}
        <div
          style={{
            border: '1px solid #E5E5E5',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            id="katex-preview-area"
            style={{
              minHeight: '360px',
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
                上の入力エリアに数式を入力してください
              </div>
            )}
          </div>
        </div>

        {/* ─── ダウンロードボタン ─── */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={exportSVG}
            disabled={!rendered}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 0',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '4px',
              border: `1px solid ${rendered ? '#0017C1' : '#E5E5E5'}`,
              background: '#FFFFFF',
              color: rendered ? '#0017C1' : '#bbb',
              cursor: rendered ? 'pointer' : 'not-allowed',
              transition: 'all 0.12s',
            }}
          >
            <span style={{ fontSize: '16px' }}>↓</span>
            SVG としてダウンロード
          </button>
          <button
            onClick={exportPNG}
            disabled={!rendered}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 0',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '4px',
              border: 'none',
              background: rendered ? '#0017C1' : '#E5E5E5',
              color: rendered ? '#FFFFFF' : '#999',
              cursor: rendered ? 'pointer' : 'not-allowed',
              transition: 'all 0.12s',
            }}
          >
            <span style={{ fontSize: '16px' }}>↓</span>
            PNG としてダウンロード
          </button>
        </div>

        {/* FAQ */}
        <section style={{ marginTop: '64px', borderTop: '1px solid #E5E5E5', paddingTop: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', marginBottom: '28px', marginTop: 0 }}>
            よくある質問
          </h2>
          {[
            {
              q: 'どのような数式コマンドに対応していますか？',
              a: 'KaTeXライブラリを使用しており、積分・総和・行列・分数・ギリシャ文字・矢印など、数学・物理でよく使われるLaTeXコマンドに対応しています。ただし、一部のLaTeX拡張パッケージ（TikZなど）はサポートしていません。',
            },
            {
              q: '入力した数式はサーバーに送信されますか？',
              a: 'いいえ。レンダリングはすべてブラウザ上で完結します。入力内容がサーバーに送信されることはなく、プライバシーの心配がありません。',
            },
            {
              q: 'ログインしなくても使えますか？',
              a: 'はい。数式プレビュー・PNG/SVGダウンロードはログイン不要で無制限に利用できます。',
            },
            {
              q: 'SVGとPNGどちらでダウンロードするのがおすすめですか？',
              a: 'プレゼンや印刷物への貼り付けにはSVG（ベクター形式・拡大しても綺麗）がおすすめです。WordやSlideなどラスター画像が必要な場面はPNGをご利用ください。',
            },
            {
              q: 'Display・Inline・Textモードの違いは何ですか？',
              a: 'Displayモードは数式を独立した行に大きく表示します。Inlineモードは文中に埋め込む形式で小さめに表示します。Textモードは数式記号を通常テキストとしてレンダリングします。',
            },
          ].map((item, i, arr) => (
            <div
              key={i}
              style={{
                borderTop: '1px solid #E5E5E5',
                paddingTop: '20px',
                paddingBottom: '20px',
                borderBottom: i === arr.length - 1 ? '1px solid #E5E5E5' : 'none',
              }}
            >
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A', margin: '0 0 8px' }}>
                Q. {item.q}
              </p>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8', margin: 0 }}>
                A. {item.a}
              </p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
