import React from "react";

export default function AppShell({ theme, header, children, footer }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        overflowX: "hidden",
      }}
    >
      {header}

      <main
        style={{
          flex: 1,
          padding: "18px 16px 160px",
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
      >
        {children}
      </main>

      {footer}
    </div>
  );
}