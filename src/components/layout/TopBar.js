import React from "react";

export default function TopBar({ user, onLogout, themeMode, toggleTheme, theme }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.topBarBg,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: theme.accentSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            border: `1px solid ${theme.border}`,
          }}
        >
          {user.avatar}
        </div>

        <div>
          <p
            style={{
              fontSize: "11px",
              color: theme.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              fontWeight: 800,
              marginBottom: "3px",
            }}
          >
            Finchly
          </p>
          <p style={{ color: theme.text, fontSize: "15px", fontWeight: 800 }}>
            {user.name}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={toggleTheme}
          style={{
            background: theme.buttonBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            padding: "9px 10px",
            cursor: "pointer",
            fontWeight: 700,
            color: theme.textSub,
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          {themeMode === "light" ? "🌙" : "☀️"}
        </button>

        <button
          onClick={onLogout}
          style={{
            background: theme.buttonBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            padding: "9px 12px",
            cursor: "pointer",
            fontWeight: 700,
            color: theme.textSub,
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}