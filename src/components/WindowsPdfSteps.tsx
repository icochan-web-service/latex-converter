export default function WindowsPdfSteps() {
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif", padding: "1rem 0", color: "#333" }}>

      {/* STEP 1: Detailed Ribbon Interface */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "1.5rem", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2B579A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>1</div>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>左上の「ファイル」タブをクリック</span>
        </div>

        <div style={{ background: "#f3f2f1", borderRadius: "8px", border: "1px solid #d1d1d1", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", minWidth: "600px" }}>
          {/* Title Bar */}
          <div style={{ background: "#2B579A", height: "32px", display: "flex", alignItems: "center", padding: "0 12px", justifyContent: "space-between", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "8px", opacity: 0.8 }}></div>
              <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.3)" }}></div>
              <span style={{ fontSize: "12px", fontWeight: "400" }}>文書1 - Word</span>
            </div>
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ width: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>&#8213;</div>
              <div style={{ width: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>&#9633;</div>
              <div style={{ width: "46px", background: "#e81123", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>&#10005;</div>
            </div>
          </div>

          {/* Ribbon Tabs */}
          <div style={{ background: "#2B579A", display: "flex", alignItems: "flex-end", paddingLeft: "4px" }}>
            <div style={{ position: "relative", background: "#fff", color: "#2B579A", padding: "8px 20px", fontSize: "13px", fontWeight: "600", borderRadius: "4px 4px 0 0", cursor: "pointer" }}>
              ファイル
            </div>
            <div style={{ color: "#fff", padding: "8px 16px", fontSize: "13px", background: "rgba(255,255,255,0.1)", borderRadius: "4px 4px 0 0", margin: "0 1px" }}>ホーム</div>
            <div style={{ color: "#fff", padding: "8px 16px", fontSize: "13px" }}>挿入</div>
            <div style={{ color: "#fff", padding: "8px 16px", fontSize: "13px" }}>描画</div>
            <div style={{ color: "#fff", padding: "8px 16px", fontSize: "13px" }}>デザイン</div>
            <div style={{ color: "#fff", padding: "8px 16px", fontSize: "13px" }}>レイアウト</div>
          </div>

          {/* Ribbon Content */}
          <div style={{ background: "#fff", borderBottom: "1px solid #d1d1d1", padding: "8px 15px", display: "flex", gap: "0", alignItems: "stretch" }}>
            {/* Clipboard Group */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingRight: "12px", borderRight: "1px solid #edebe9" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px" }}>📋</div>
                  <div style={{ fontSize: "10px", color: "#616161", marginTop: "2px" }}>貼り付け</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", color: "#444" }}>
                  <div>✂️ 切り取り</div>
                  <div>📄 コピー</div>
                  <div>🖌️ 書式のコピー</div>
                </div>
              </div>
              <div style={{ fontSize: "10px", color: "#a19f9d", marginTop: "4px" }}>クリップボード</div>
            </div>

            {/* Font Group */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px", borderRight: "1px solid #edebe9" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                  <div style={{ width: "120px", height: "22px", border: "1px solid #d1d1d1", borderRadius: "3px", padding: "0 6px", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
                    <span>遊明朝 (本文)</span><span>▼</span>
                  </div>
                  <div style={{ width: "48px", height: "22px", border: "1px solid #d1d1d1", borderRadius: "3px", padding: "0 6px", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
                    <span>10.5</span><span>▼</span>
                  </div>
                  <div style={{ display: "flex", gap: "2px", marginLeft: "4px" }}>
                    <div style={{ width: "22px", height: "22px", border: "1px solid #d1d1d1", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>A<sup>^</sup></div>
                    <div style={{ width: "22px", height: "22px", border: "1px solid #d1d1d1", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>A<sub>v</sub></div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                  <div style={{ width: "24px", height: "24px", border: "1px solid #d1d1d1", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "13px" }}>B</div>
                  <div style={{ width: "24px", height: "24px", border: "1px solid #d1d1d1", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontSize: "13px", fontFamily: "serif" }}>I</div>
                  <div style={{ width: "24px", height: "24px", border: "1px solid #d1d1d1", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "underline", fontSize: "13px" }}>U</div>
                  <div style={{ width: "1px", height: "16px", background: "#edebe9", margin: "0 4px" }}></div>
                  <div style={{ fontSize: "16px" }}>🖋️<span style={{ fontSize: "8px", verticalAlign: "middle" }}>▼</span></div>
                  <div style={{ fontSize: "16px", color: "#c00" }}>A<span style={{ fontSize: "8px", verticalAlign: "middle" }}>▼</span></div>
                </div>
              </div>
              <div style={{ fontSize: "10px", color: "#a19f9d", marginTop: "4px" }}>フォント</div>
            </div>

            {/* Paragraph Group */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "6px", fontSize: "14px", color: "#616161" }}>
                  <div>⋮📋</div>
                  <div>1.📋</div>
                  <div>📑</div>
                  <div style={{ width: "1px", height: "16px", background: "#edebe9" }}></div>
                  <div>⬅️</div>
                  <div>➡️</div>
                </div>
                <div style={{ display: "flex", gap: "2px", justifyContent: "center" }}>
                  <div style={{ width: "24px", height: "22px", border: "1px solid #d1d1d1", background: "#f3f2f1", display: "flex", flexDirection: "column", gap: "2px", padding: "4px" }}>
                    <div style={{ height: "1.5px", background: "#616161" }}></div>
                    <div style={{ height: "1.5px", background: "#616161", width: "70%" }}></div>
                    <div style={{ height: "1.5px", background: "#616161" }}></div>
                  </div>
                  <div style={{ width: "24px", height: "22px", border: "1px solid #d1d1d1", display: "flex", flexDirection: "column", gap: "2px", padding: "4px", alignItems: "center" }}>
                    <div style={{ height: "1.5px", background: "#616161", width: "100%" }}></div>
                    <div style={{ height: "1.5px", background: "#616161", width: "60%" }}></div>
                    <div style={{ height: "1.5px", background: "#616161", width: "80%" }}></div>
                  </div>
                  <div style={{ width: "24px", height: "22px", border: "1px solid #d1d1d1", display: "flex", flexDirection: "column", gap: "2px", padding: "4px", alignItems: "flex-end" }}>
                    <div style={{ height: "1.5px", background: "#616161", width: "100%" }}></div>
                    <div style={{ height: "1.5px", background: "#616161", width: "70%" }}></div>
                    <div style={{ height: "1.5px", background: "#616161", width: "100%" }}></div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "10px", color: "#a19f9d", marginTop: "4px" }}>段落</div>
            </div>
          </div>

          {/* Blank Document Area */}
          <div style={{ background: "#e1dfdd", padding: "25px", display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#fff", width: "420px", height: "120px", boxShadow: "0 0 15px rgba(0,0,0,0.1)", padding: "40px" }}>
              <div style={{ height: "8px", background: "#f3f2f1", marginBottom: "12px", width: "40%" }}></div>
              <div style={{ height: "8px", background: "#f3f2f1", marginBottom: "12px", width: "90%" }}></div>
              <div style={{ height: "8px", background: "#f3f2f1", width: "75%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: Backstage View */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "1.5rem", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2B579A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>2</div>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>「名前を付けて保存」から「参照」を選択</span>
        </div>

        <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid #d1d1d1", overflow: "hidden", display: "flex", height: "260px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
          {/* Left Sidebar */}
          <div style={{ background: "#2B579A", width: "180px", flexShrink: 0, paddingTop: "10px" }}>
            <div style={{ padding: "10px 20px", color: "#fff", opacity: 0.7, fontSize: "18px" }}>←</div>
            <div style={{ padding: "10px 25px", color: "#fff", fontSize: "14px", opacity: 0.8 }}>ホーム</div>
            <div style={{ padding: "10px 25px", color: "#fff", fontSize: "14px", opacity: 0.8 }}>新規</div>
            <div style={{ padding: "10px 25px", color: "#fff", fontSize: "14px", opacity: 0.8 }}>開く</div>
            <div style={{ margin: "10px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}></div>
            <div style={{ background: "#fff", color: "#2B579A", padding: "12px 25px", fontSize: "14px", fontWeight: "bold", borderRadius: "20px 0 0 20px", marginLeft: "10px" }}>
              名前を付けて保存
            </div>
            <div style={{ padding: "10px 25px", color: "#fff", fontSize: "14px", opacity: 0.8 }}>印刷</div>
          </div>

          {/* Right Content */}
          <div style={{ flex: 1, padding: "30px", background: "#fff", overflowY: "auto" }}>
            <h3 style={{ fontSize: "22px", fontWeight: 300, margin: "0 0 25px 0" }}>名前を付けて保存</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "12px", border: "1px solid #edebe9", borderRadius: "4px" }}>
                <div style={{ fontSize: "24px" }}>☁️</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>OneDrive - 個人用</div>
                  <div style={{ fontSize: "11px", color: "#616161" }}>user@example.com</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "12px", border: "1.5px solid #0078d4", background: "#f3f9ff", borderRadius: "4px", position: "relative" }}>
                <div style={{ fontSize: "24px" }}>💻</div>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>この PC</div>
              </div>

              {/* Reference Button */}
              <div style={{ marginTop: "10px", position: "relative", width: "fit-content" }}>
                <div style={{ border: "1px solid #8a8886", padding: "8px 30px", borderRadius: "4px", fontSize: "14px", fontWeight: "600", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                  <span>📁</span> 参照
                </div>
                <div style={{ position: "absolute", right: "-100px", top: "50%", transform: "translateY(-50%)", background: "#c42b1c", color: "#fff", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", animation: "pulse 2s infinite" }}>
                  ◀ クリック
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: Windows File Dialog */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2B579A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>3</div>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>ファイルの種類を「PDF」に変えて保存</span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #d1d1d1", borderRadius: "8px", overflow: "hidden", width: "90%", margin: "0 auto", boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}>
          {/* Dialog Header */}
          <div style={{ background: "#faf9f8", padding: "10px 15px", fontSize: "12px", borderBottom: "1px solid #e1dfdd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>名前を付けて保存</span>
            <div style={{ color: "#616161" }}>✕</div>
          </div>

          {/* Address Bar */}
          <div style={{ padding: "8px 12px", background: "#fff", borderBottom: "1px solid #f3f2f1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", color: "#616161", fontSize: "14px" }}>
              <span>←</span><span>→</span><span>↑</span>
            </div>
            <div style={{ flex: 1, border: "1px solid #d1d1d1", padding: "4px 10px", fontSize: "12px", background: "#fff", borderRadius: "2px", color: "#333" }}>
              PC &gt; ドキュメント
            </div>
          </div>

          {/* File Content */}
          <div style={{ height: "100px", display: "flex" }}>
            <div style={{ width: "140px", background: "#faf9f8", borderRight: "1px solid #e1dfdd", padding: "10px", fontSize: "11px", color: "#323130" }}>
              <div style={{ padding: "4px", opacity: 0.7 }}>⭐ クイック アクセス</div>
              <div style={{ padding: "4px", background: "#e1dfdd", borderRadius: "3px" }}>📁 ドキュメント</div>
              <div style={{ padding: "4px" }}>📁 デスクトップ</div>
              <div style={{ padding: "4px" }}>☁️ OneDrive</div>
            </div>
            <div style={{ flex: 1, padding: "15px", display: "flex", gap: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px" }}>📄</div>
                <div style={{ fontSize: "10px" }}>レポート.docx</div>
              </div>
            </div>
          </div>

          {/* Footer Inputs */}
          <div style={{ background: "#f3f2f1", padding: "20px", borderTop: "1px solid #e1dfdd" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "100px", fontSize: "12px", textAlign: "right" }}>ファイル名:</div>
              <div style={{ flex: 1, background: "#fff", border: "1px solid #8a8886", padding: "5px 10px", fontSize: "13px", borderRadius: "2px" }}>文書1</div>
            </div>

            {/* Key Selection */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "100px", fontSize: "12px", textAlign: "right" }}>ファイルの種類:</div>
              <div style={{ flex: 1, background: "#fff", border: "2px solid #0078d4", padding: "5px 10px", fontSize: "13px", borderRadius: "2px", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 0 8px rgba(0,120,212,0.2)" }}>
                <span>PDF (*.pdf)</span>
                <span style={{ fontSize: "10px" }}>▼</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <div style={{ padding: "6px 25px", background: "#fff", border: "1px solid #8a8886", fontSize: "13px", borderRadius: "2px" }}>キャンセル</div>
              <div style={{ position: "relative" }}>
                <div style={{ padding: "6px 30px", background: "#0078d4", color: "#fff", fontSize: "13px", fontWeight: "bold", borderRadius: "2px", border: "1px solid #0078d4", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                  保存(S)
                </div>
                <div style={{ position: "absolute", top: "-35px", left: "50%", transform: "translateX(-50%)", background: "#0078d4", color: "#fff", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", whiteSpace: "nowrap" }}>
                  最後にここ！
                  <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%) rotate(45deg)", width: "8px", height: "8px", background: "#0078d4" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
