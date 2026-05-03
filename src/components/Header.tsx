"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header style={{ borderBottom: "1px solid #E5E5E5", background: "#FFFFFF" }}>
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="/"
          style={{ fontSize: "18px", fontWeight: "700", color: "#0017C1", textDecoration: "none" }}
        >
          LaTeX Tools
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isSignedIn ? (
            <>
              <span style={{ fontSize: "13px", color: "#666666" }}>
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
                }}
              >
                ログイン
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
