"use client";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const TEX_CONVERT_ITEMS = [
  { label: "画像からTeX", href: "/convert",      icon: "/icons/image-to-tex.svg" },
  { label: "PDFからTeX",  href: "/pdf_convert",  icon: "/icons/pdf-to-tex.svg"   },
  { label: "WordからTeX", href: "/word_convert", icon: "/icons/word-to-tex.svg"  },
];

export default function Header() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [texHover, setTexHover]             = useState(false);
  const [previewHover, setPreviewHover]     = useState(false);
  const [hoveredItem, setHoveredItem]       = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDropdownEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setDropdownOpen(true);
    setTexHover(true);
  };
  const handleDropdownLeave = () => {
    setTexHover(false);
    closeTimerRef.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const isTexConvertActive = TEX_CONVERT_ITEMS.some((i) => i.href === pathname);
  const isPreviewActive    = pathname === "/compile";

  return (
    <header
      style={{
        borderBottom: "1px solid #E5E5E5",
        background: "#FFFFFF",
        position: "relative",
        zIndex: 200,
      }}
    >
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 40px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* ── ロゴ ── */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <picture>
            <source srcSet="/logo.svg" type="image/svg+xml" />
            <img
              src="/logo.png"
              alt="かんたんTeX"
              style={{ height: "36px", width: "auto", display: "block" }}
              onError={(e) => {
                // logo.svg/png が未配置の場合はテキストロゴにフォールバック
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "block";
              }}
            />
          </picture>
          <span
            style={{
              display: "none",
              fontSize: "18px",
              fontWeight: "700",
              color: "#0017C1",
            }}
          >
            かんたんTeX
          </span>
        </Link>

        {/* ── デスクトップ ナビ ── */}
        <nav
          className="header-desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}
        >
          {/* TeX変換 ドロップダウン */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              className="header-nav-item"
              style={{
                color: (isTexConvertActive || texHover || dropdownOpen) ? "#0017C1" : "#1A1A1A",
                fontWeight: isTexConvertActive ? "600" : "400",
                background: isTexConvertActive ? "#F0F4FF" : "transparent",
              }}
            >
              TeX変換
              <span
                style={{
                  fontSize: "9px",
                  color: "#888",
                  marginLeft: "2px",
                  display: "inline-block",
                  transform: dropdownOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                }}
              >
                ▼
              </span>
            </button>

            {/* 透明ブリッジ：ボタンとドロップダウンの隙間をマウスが通過してもcloseしない */}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                height: "8px",
              }}
            />

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "0",
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  borderRadius: "4px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  padding: "6px",
                  minWidth: "210px",
                  zIndex: 300,
                }}
              >
                {TEX_CONVERT_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="header-dropdown-item"
                    style={{
                      background: pathname === item.href ? "#EEF2FF" : hoveredItem === item.href ? "#F0F3FF" : "transparent",
                      color: (pathname === item.href || hoveredItem === item.href) ? "#0017C1" : "#1A1A1A",
                    }}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      style={{ width: "24px", height: "24px", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: pathname === item.href ? "600" : "400",
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* TeXプレビュー（直リンク） */}
          <Link
            href="/compile"
            className="header-nav-item"
            style={{
              color: (isPreviewActive || previewHover) ? "#0017C1" : "#1A1A1A",
              fontWeight: isPreviewActive ? "600" : "400",
              background: isPreviewActive ? "#F0F4FF" : "transparent",
            }}
            onMouseEnter={() => setPreviewHover(true)}
            onMouseLeave={() => setPreviewHover(false)}
          >
            {/* アイコン差し替え：public/icons/tex-preview.svg を同名ファイルで上書きすると反映されます */}
            {/* <img
              src="/icons/tex-preview.svg"
              alt=""
              style={{ width: "20px", height: "20px" }}
            /> */}
            TeXから画像
          </Link>
        </nav>

        {/* ── 右端：Auth + ハンバーガー ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {isSignedIn ? (
            <>
              <span className="header-user-email" style={{ fontSize: "13px", color: "#666666" }}>
                {user.emailAddresses[0].emailAddress}
              </span>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button
                style={{
                  background: "#0017C1",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                ログイン
              </button>
            </SignInButton>
          )}

          {/* ハンバーガーボタン（モバイルのみ表示） */}
          <button
            className="header-hamburger"
            onClick={() => setMobileMenuOpen((v) => !v)}
            style={{
              display: "none", // globals.css の media query で制御
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              background: "transparent",
              border: "1px solid #E5E5E5",
              borderRadius: "4px",
              cursor: "pointer",
              flexDirection: "column",
              gap: "5px",
              padding: "7px",
            }}
            aria-label="メニュー"
          >
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                background: "#1A1A1A",
                borderRadius: "1px",
                transition: "all 0.15s",
                transform: mobileMenuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                background: "#1A1A1A",
                borderRadius: "1px",
                opacity: mobileMenuOpen ? 0 : 1,
                transition: "opacity 0.15s",
              }}
            />
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                background: "#1A1A1A",
                borderRadius: "1px",
                transition: "all 0.15s",
                transform: mobileMenuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* ── モバイルメニュー ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            right: 0,
            background: "#FFFFFF",
            borderBottom: "1px solid #E5E5E5",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            zIndex: 300,
            padding: "12px 16px 16px",
          }}
        >
          {/* TeX変換 グループ */}
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#888",
                letterSpacing: "0.06em",
                padding: "4px 8px 8px",
                textTransform: "uppercase",
              }}
            >
              TeX変換
            </div>
            {TEX_CONVERT_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header-dropdown-item"
                style={{
                  background: pathname === item.href ? "#EEF2FF" : "transparent",
                  color: pathname === item.href ? "#0017C1" : "#1A1A1A",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <img src={item.icon} alt="" style={{ width: "24px", height: "24px", flexShrink: 0 }} />
                <span style={{ fontSize: "15px", fontWeight: pathname === item.href ? "600" : "400" }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* TeXプレビュー */}
          <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "8px" }}>
            <Link
              href="/compile"
              className="header-dropdown-item"
              style={{
                background: isPreviewActive ? "#EEF2FF" : "transparent",
                color: isPreviewActive ? "#0017C1" : "#1A1A1A",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/icons/tex-preview.svg" alt="" style={{ width: "24px", height: "24px", flexShrink: 0 }} />
              <span style={{ fontSize: "15px", fontWeight: isPreviewActive ? "600" : "400" }}>
                TeXから画像
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
