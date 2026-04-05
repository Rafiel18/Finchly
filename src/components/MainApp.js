import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Debts from "./Debts";
import Expenses from "./Expenses";
import Investments from "./Investments";
import Settings from "./Settings";

import { useStorage } from "../hooks/useStorage";
import { TABS, AVATARS } from "../config/appConfig";
import { daysInMonth, dayOfMonth } from "../utils/date";
import { createInitialData } from "../utils/createInitialData";

export default function MainApp({
  user,
  onLogout,
  onUpdateUser,
  themeMode,
  toggleTheme,
  theme,
}) {
  const [tab, setTab] = useState("dashboard");
  const [dados, setDados] = useStorage(`finchly_data_${user.id}`);

  const d = dados || createInitialData();

  const save = (patch) => {
    setDados({
      ...d,
      ...patch,
    });
  };

  const salary = Number(d.salary) || 0;
  const totalExp = d.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const balance = salary - totalExp;
  const remDays = daysInMonth() - dayOfMonth() + 1;
  const daily = remDays > 0 ? balance / remDays : 0;

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

      <div
        style={{
          flex: 1,
          padding: "18px 16px 120px",
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
      >
        {tab === "dashboard" && (
          <Dashboard
            d={d}
            salary={salary}
            balance={balance}
            daily={daily}
            totalExp={totalExp}
            remDays={remDays}
          />
        )}

        {tab === "expenses" && <Expenses d={d} save={save} />}
        {tab === "debts" && <Debts d={d} save={save} />}
        {tab === "invest" && <Investments d={d} save={save} />}
        {tab === "settings" && (
          <Settings
            d={d}
            save={save}
            user={user}
            onUpdateUser={onUpdateUser}
            avatars={AVATARS}
          />
        )}
      </div>

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
        {TABS.map((item) => {
          const active = tab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
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
    </div>
  );
}