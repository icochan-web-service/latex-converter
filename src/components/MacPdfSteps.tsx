export default function MacPdfSteps() {
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif", padding: "1rem 0", color: "#333" }}>

      {/* STEP 1 */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "1.5rem", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2B579A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>1</div>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>「ファイル」メニュー →「名前を付けて保存」をクリック</span>
        </div>
        <div style={{ background: "#f3f2f1", borderRadius: "8px", padding: "10px" }}>
          <div style={{ border: "1px solid #b8b8b8", borderRadius: "10px", overflow: "hidden", position: "relative", background: "#fff", minHeight: "280px" }}>

            {/* macOS System Menu Bar */}
            <div style={{ background: "#ebebeb", height: "22px", display: "flex", alignItems: "center", padding: "0 10px", borderBottom: "0.5px solid rgba(0,0,0,0.15)", position: "relative", zIndex: 20 }}>
              <div style={{ width: "13px", height: "13px", background: "#1d1d1f", borderRadius: "50%", marginRight: "12px", flexShrink: 0 }}></div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#1d1d1f", marginRight: "12px", flexShrink: 0 }}>Word</span>
              <span style={{ fontSize: "12px", color: "#fff", background: "#2040c8", padding: "1px 7px", borderRadius: "3px", marginRight: "12px", flexShrink: 0 }}>ファイル</span>
              <span style={{ fontSize: "12px", color: "#1d1d1f", marginRight: "12px", flexShrink: 0 }}>編集</span>
              <span style={{ fontSize: "12px", color: "#1d1d1f", marginRight: "12px", flexShrink: 0 }}>表示</span>
              <span style={{ fontSize: "12px", color: "#1d1d1f", marginRight: "12px", flexShrink: 0 }}>挿入</span>
              <span style={{ fontSize: "12px", color: "#1d1d1f", marginRight: "12px", flexShrink: 0 }}>書式</span>
              <span style={{ fontSize: "12px", color: "#1d1d1f", marginRight: "12px", flexShrink: 0 }}>ツール</span>
              <span style={{ fontSize: "12px", color: "#1d1d1f", flexShrink: 0 }}>ウィンドウ</span>
            </div>

            {/* Word window title bar */}
            <div style={{ background: "#ececec", height: "26px", display: "grid", gridTemplateColumns: "80px 1fr 80px", alignItems: "center", padding: "0 12px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", gap: "7px" }}>
                <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5F57" }}></div>
                <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FFBD2E" }}></div>
                <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#28C840" }}></div>
              </div>
              <div style={{ textAlign: "center", fontSize: "12px", color: "#555", fontWeight: "400" }}>文書1 - Word</div>
            </div>

            {/* Decorative ribbon area */}
            <div style={{ background: "#f9f9f9", height: "40px", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}></div>

            {/* Dropdown */}
            <div style={{ position: "absolute", top: "22px", left: "59px", background: "#f4f4f4", border: "0.5px solid rgba(0,0,0,0.18)", borderBottomLeftRadius: "6px", borderBottomRightRadius: "6px", padding: "4px 0", minWidth: "215px", zIndex: 30, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              <div style={{ padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1d1d1f" }}>
                <span>新規...</span><span style={{ color: "#8e8e93", fontSize: "11px" }}>&#8984;N</span>
              </div>
              <div style={{ padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1d1d1f" }}>
                <span>開く...</span><span style={{ color: "#8e8e93", fontSize: "11px" }}>&#8984;O</span>
              </div>
              <div style={{ margin: "3px 8px", borderTop: "0.5px solid rgba(0,0,0,0.12)" }}></div>
              <div style={{ padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1d1d1f" }}>
                <span>閉じる</span><span style={{ color: "#8e8e93", fontSize: "11px" }}>&#8984;W</span>
              </div>
              <div style={{ padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1d1d1f" }}>
                <span>保存</span><span style={{ color: "#8e8e93", fontSize: "11px" }}>&#8984;S</span>
              </div>
              {/* Highlighted: 名前を付けて保存 */}
              <div style={{ background: "#2040c8", padding: "4px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#fff" }}>
                <span>名前を付けて保存...</span><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)" }}>&#8679;&#8984;S</span>
              </div>
              <div style={{ padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1d1d1f" }}>
                <span>コピーを保存...</span>
              </div>
              <div style={{ margin: "3px 8px", borderTop: "0.5px solid rgba(0,0,0,0.12)" }}></div>
              <div style={{ padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1d1d1f" }}>
                <span>PDF として保存...</span>
              </div>
              <div style={{ margin: "3px 8px", borderTop: "0.5px solid rgba(0,0,0,0.12)" }}></div>
              <div style={{ padding: "3px 14px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1d1d1f" }}>
                <span>印刷...</span><span style={{ color: "#8e8e93", fontSize: "11px" }}>&#8984;P</span>
              </div>
            </div>

          </div>
        </div>
        <div style={{ fontSize: "14px", color: "#555", marginTop: "16px", textAlign: "center" }}>画面上部のメニューバーで「ファイル」をクリックし、「名前を付けて保存...」を選択します</div>
      </div>

      {/* STEP 2 */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "1.5rem", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2B579A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>2</div>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>「ファイル形式」を「PDF」に変更する</span>
        </div>
        <div style={{ background: "#f3f2f1", borderRadius: "8px", padding: "10px" }}>
          <div style={{ border: "1px solid #b8b8b8", borderRadius: "12px", overflow: "hidden" }}>

            {/* Word title bar */}
            <div style={{ background: "#ececec", height: "28px", display: "grid", gridTemplateColumns: "90px 1fr 90px", alignItems: "center", padding: "0 12px", borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", gap: "7px" }}>
                <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5F57" }}></div>
                <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FFBD2E" }}></div>
                <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#28C840" }}></div>
              </div>
              <div style={{ textAlign: "center", fontSize: "12px", color: "#1d1d1f", fontWeight: "500" }}>文書1 - Word</div>
            </div>

            {/* Ribbon tabs */}
            <div style={{ background: "#fff", borderBottom: "0.5px solid rgba(0,0,0,0.1)", padding: "0 10px", display: "flex", height: "32px", alignItems: "flex-end" }}>
              <div style={{ padding: "5px 10px", fontSize: "12px", color: "#0F6CBD", borderBottom: "2px solid #0F6CBD", fontWeight: "500", flexShrink: 0 }}>ホーム</div>
              <div style={{ padding: "5px 9px", fontSize: "12px", color: "#6e6e73", flexShrink: 0 }}>挿入</div>
              <div style={{ padding: "5px 9px", fontSize: "12px", color: "#6e6e73", flexShrink: 0 }}>描画</div>
              <div style={{ padding: "5px 9px", fontSize: "12px", color: "#6e6e73", flexShrink: 0 }}>レイアウト</div>
              <div style={{ padding: "5px 9px", fontSize: "12px", color: "#6e6e73", flexShrink: 0 }}>参考資料</div>
              <div style={{ padding: "5px 9px", fontSize: "12px", color: "#6e6e73", flexShrink: 0 }}>校閲</div>
              <div style={{ padding: "5px 9px", fontSize: "12px", color: "#6e6e73", flexShrink: 0 }}>表示</div>
            </div>

            {/* Ribbon commands */}
            <div style={{ background: "#f9f9f9", height: "40px", display: "flex", alignItems: "center", padding: "0 10px", gap: "10px", borderBottom: "0.5px solid rgba(0,0,0,0.07)" }}>
              <div style={{ width: "20px", height: "16px", background: "#d0d0d0", borderRadius: "3px", flexShrink: 0 }}></div>
              <div style={{ width: "0.5px", height: "26px", background: "rgba(0,0,0,0.12)" }}></div>
              <div style={{ display: "flex", gap: "2px" }}>
                <div style={{ width: "19px", height: "19px", border: "0.5px solid #ccc", borderRadius: "4px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#333" }}>B</div>
                <div style={{ width: "19px", height: "19px", border: "0.5px solid #ccc", borderRadius: "4px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontStyle: "italic", color: "#333" }}>I</div>
                <div style={{ width: "19px", height: "19px", border: "0.5px solid #ccc", borderRadius: "4px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", textDecoration: "underline", color: "#333" }}>U</div>
              </div>
              <div style={{ width: "0.5px", height: "26px", background: "rgba(0,0,0,0.12)" }}></div>
              <div style={{ fontSize: "11px", color: "#555", display: "flex", gap: "3px", alignItems: "center" }}>
                <div style={{ width: "16px", height: "12px", border: "0.5px solid #bbb", borderRadius: "1px", background: "#f8f8f8" }}></div>
                <div style={{ width: "16px", height: "12px", border: "0.5px solid #bbb", borderRadius: "1px", background: "#f8f8f8" }}></div>
              </div>
            </div>

            {/* macOS Save Sheet */}
            <div style={{ background: "rgba(30,30,30,0.06)" }}>
              <div style={{ background: "#f2f2f2", width: "100%", overflow: "hidden" }}>

                {/* Sheet header */}
                <div style={{ background: "#e4e4e4", padding: "9px 14px", borderBottom: "0.5px solid rgba(0,0,0,0.12)", textAlign: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1d1d1f" }}>名前を付けて保存</span>
                </div>

                {/* Sidebar + file area */}
                <div style={{ display: "flex", height: "120px" }}>
                  <div style={{ width: "116px", background: "#dcdcdc", borderRight: "0.5px solid rgba(0,0,0,0.1)", padding: "5px 0", flexShrink: 0, fontSize: "11px" }}>
                    <div style={{ padding: "2px 8px", fontSize: "10px", color: "#888", fontWeight: "600", letterSpacing: "0.3px", marginBottom: "2px" }}>よく使う項目</div>
                    <div style={{ padding: "3px 8px", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#0064D2", flexShrink: 0 }}></div>AirDrop
                    </div>
                    <div style={{ padding: "3px 8px", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "11px", height: "9px", background: "#636366", borderRadius: "2px", flexShrink: 0 }}></div>デスクトップ
                    </div>
                    <div style={{ padding: "3px 8px", background: "#c6c6c6", borderRadius: "5px", margin: "1px 4px", color: "#1d1d1f", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "11px", height: "9px", background: "#0064D2", borderRadius: "2px", flexShrink: 0 }}></div>書類
                    </div>
                    <div style={{ padding: "3px 8px", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "11px", height: "9px", background: "#5ac8fa", borderRadius: "2px", flexShrink: 0 }}></div>ダウンロード
                    </div>
                    <div style={{ padding: "2px 8px", fontSize: "10px", color: "#888", fontWeight: "600", letterSpacing: "0.3px", marginTop: "5px", marginBottom: "2px" }}>iCloud</div>
                    <div style={{ padding: "3px 8px", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "11px", height: "11px", background: "#5e5ce6", borderRadius: "2px", flexShrink: 0 }}></div>iCloud Drive
                    </div>
                  </div>
                  <div style={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "34px", height: "38px", background: "#0F6CBD", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "15px", fontWeight: "700" }}>W</span>
                      </div>
                      <div style={{ fontSize: "10px", color: "#555" }}>文書1.docx</div>
                    </div>
                  </div>
                </div>

                {/* Bottom fields */}
                <div style={{ background: "#e4e4e4", padding: "8px 14px", borderTop: "0.5px solid rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", color: "#444", width: "76px", textAlign: "right", flexShrink: 0 }}>名前:</span>
                    <div style={{ flex: 1, background: "#fff", border: "0.5px solid #a8a8a8", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", color: "#333" }}>文書1</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", color: "#444", width: "76px", textAlign: "right", flexShrink: 0 }}>タグ:</span>
                    <div style={{ flex: 1, background: "#fff", border: "0.5px solid #a8a8a8", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", color: "#b0b0b0" }}>タグを追加...</div>
                  </div>
                  {/* ファイル形式 HIGHLIGHTED */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "12px", color: "#444", width: "76px", textAlign: "right", flexShrink: 0 }}>ファイル形式:</span>
                    <div style={{ flex: 1, background: "#fff9c4", border: "2px solid #e6c200", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", color: "#333", fontWeight: "500", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>PDF (.pdf)</span>
                      <span style={{ fontSize: "10px", color: "#666" }}>&#9660;</span>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <div style={{ padding: "5px 14px", background: "#fff", border: "0.5px solid #a8a8a8", borderRadius: "6px", fontSize: "12px", color: "#333" }}>キャンセル</div>
                    <div style={{ padding: "5px 16px", background: "#007AFF", borderRadius: "6px", fontSize: "12px", color: "#fff", fontWeight: "500" }}>保存</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
        <div style={{ fontSize: "14px", color: "#555", marginTop: "16px", textAlign: "center" }}>表示されたダイアログの「ファイル形式」ドロップダウンで「PDF (.pdf)」を選択します</div>
      </div>

      {/* STEP 3 */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "1.5rem", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2B579A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "bold", flexShrink: 0 }}>3</div>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>「保存」ボタンをクリックして完了</span>
        </div>
        <div style={{ background: "#f3f2f1", borderRadius: "8px", padding: "10px" }}>
          <div style={{ border: "1px solid #b8b8b8", borderRadius: "12px", overflow: "hidden", background: "#f2f2f2", maxWidth: "460px", margin: "0 auto" }}>

            <div style={{ background: "#e4e4e4", padding: "9px 14px", borderBottom: "0.5px solid rgba(0,0,0,0.1)", textAlign: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#1d1d1f" }}>名前を付けて保存</span>
            </div>

            <div style={{ display: "flex", height: "80px" }}>
              <div style={{ width: "116px", background: "#dcdcdc", borderRight: "0.5px solid rgba(0,0,0,0.1)", padding: "5px 0", flexShrink: 0, fontSize: "11px" }}>
                <div style={{ padding: "2px 8px", fontSize: "10px", color: "#888", fontWeight: "600", letterSpacing: "0.3px" }}>よく使う項目</div>
                <div style={{ padding: "3px 8px", background: "#c6c6c6", borderRadius: "5px", margin: "2px 4px", color: "#1d1d1f", display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "8px", background: "#0064D2", borderRadius: "2px", flexShrink: 0 }}></div>書類
                </div>
                <div style={{ padding: "3px 8px", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "8px", background: "#5ac8fa", borderRadius: "2px", flexShrink: 0 }}></div>ダウンロード
                </div>
              </div>
              <div style={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "28px", height: "32px", background: "#0F6CBD", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: "700" }}>W</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#555" }}>文書1.docx</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#e4e4e4", padding: "8px 14px", borderTop: "0.5px solid rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                <span style={{ fontSize: "12px", color: "#444", width: "76px", textAlign: "right", flexShrink: 0 }}>名前:</span>
                <div style={{ flex: 1, background: "#fff", border: "0.5px solid #a8a8a8", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", color: "#333" }}>文書1</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: "#444", width: "76px", textAlign: "right", flexShrink: 0 }}>ファイル形式:</span>
                <div style={{ flex: 1, background: "#fff", border: "0.5px solid #a8a8a8", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", color: "#333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>PDF (.pdf)</span><span style={{ fontSize: "10px", color: "#666" }}>&#9660;</span>
                </div>
              </div>
              {/* Buttons: 保存 HIGHLIGHTED */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", alignItems: "center" }}>
                <div style={{ padding: "5px 14px", background: "#fff", border: "0.5px solid #a8a8a8", borderRadius: "6px", fontSize: "12px", color: "#333" }}>キャンセル</div>
                <span style={{ fontSize: "11px", color: "#c00", fontWeight: "700" }}>クリック &#8594;</span>
                <div style={{ padding: "5px 18px", background: "#007AFF", borderRadius: "6px", fontSize: "12px", color: "#fff", fontWeight: "500", border: "2px solid #0060d4" }}>保存</div>
              </div>
            </div>

          </div>
        </div>
        <div style={{ fontSize: "14px", color: "#555", marginTop: "16px", textAlign: "center" }}>「PDF (.pdf)」が選択されていることを確認し、青い「保存」ボタンをクリックして完了です</div>
      </div>

    </div>
  );
}
