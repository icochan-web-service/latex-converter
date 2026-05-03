export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #E5E5E5", background: "#FFFFFF" }}>
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", color: "#bbb" }}>© 2026 LaTeX Tools</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="/privacy" style={{ fontSize: "13px", color: "#666666", textDecoration: "none" }}>
            プライバシーポリシー
          </a>
          <a href="/terms" style={{ fontSize: "13px", color: "#666666", textDecoration: "none" }}>
            利用規約
          </a>
        </div>
      </div>
    </footer>
  );
}
