import React from "react";

export default function BottomNav({ tabs, activeTab, onChangeTab, theme }) {
  return (
    <div
      style={{
        position: "fixed",
        left: "10px",
        right: "10px",
        bottom: "10px",
        maxWidth: "700px",
        margin: "0 auto",
        display: "flex",
        background: theme.navBg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${theme.border}`,
        borderRadius: "20px",
        padding: "8px 4px 10px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        zIndex: 30,
        boxSizing: "border-box",
      }}
    >
      {tabs.map((item) => {
        const active = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            style={{
              flex: 1,
              border: "none",
              background: active ? theme.accentSoft : "transparent",
              color: active ? theme.accent : theme.textMuted,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              fontSize: "10px",
              fontWeight: active ? 800 : 600,
              cursor: "pointer",
              borderRadius: "16px",
              padding: "8px 4px",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span>{item.label}</span>

            {active && (
              <div
                style={{
                  width: "18px",
                  height: "3px",
                  borderRadius: "999px",
                  background: theme.accent,
                  marginTop: "2px",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}