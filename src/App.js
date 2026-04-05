import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Expenses from "./components/Expenses";
import Debts from "./components/Debts";
import Investments from "./components/Investments";
import Settings from "./components/Settings";
import LoginScreen from "./components/LoginScreen";
import { ThemeContext } from "./context/theme";
import { defaultData } from "./utils/finance";
import { daysInMonth, dayOfMonth } from "./utils/date";
import { useStorage } from "./hooks/useStorage";

const LIGHT_THEME = {
  bg: "#f5f7f2",
  bgCard: "#ffffff",
  bgInput: "#f0f4ee",
  border: "#ececec",
  text: "#1f2937",
  textSub: "#6b7280",
  textMuted: "#9ca3af",
  accent: "#3d8c5f",
  accentSoft: "#eaf4ee",
  accentBlue: "#3b7dd8",
  accentBlueSoft: "#ebf2fc",
  positive: "#2e7d52",
  positiveSoft: "#e6f4ed",
  warning: "#c45a1a",
  warningSoft: "#fef0e6",
  negative: "#c0392b",
  negativeSoft: "#fdecea",
  heroGrad: "linear-gradient(135deg, #d6efe1 0%, #e8f4f8 100%)",
  heroBorder: "rgba(61,140,95,0.2)",
  heroText: "#2e7d52",
  shadow: "0 4px 14px rgba(0,0,0,0.06)",
  shadowCard: "0 4px 12px rgba(0,0,0,0.06)",
  topBarBg: "rgba(255,255,255,0.88)",
  navBg: "rgba(255,255,255,0.92)",
  buttonBg: "#ffffff",
  glassCard: "rgba(255,255,255,0.72)",
  softTile: "#f0f4ee",
  softTile2: "#ffffff",
  avatarTile: "#ffffff",
};

const DARK_THEME = {
  bg: "#0f1412",
  bgCard: "#171d1a",
  bgInput: "#1d2521",
  border: "#28312c",
  text: "#eef4f0",
  textSub: "#b6c5bb",
  textMuted: "#7d8d83",
  accent: "#57b97d",
  accentSoft: "#1a2a22",
  accentBlue: "#5f99e8",
  accentBlueSoft: "#182433",
  positive: "#61c48b",
  positiveSoft: "#1b2b22",
  warning: "#f0a24f",
  warningSoft: "#33261a",
  negative: "#ea6b60",
  negativeSoft: "#331d1b",
  heroGrad: "linear-gradient(135deg, #183225 0%, #162734 100%)",
  heroBorder: "rgba(87,185,125,0.18)",
  heroText: "#7fd8a1",
  shadow: "0 4px 18px rgba(0,0,0,0.24)",
  shadowCard: "0 4px 12px rgba(0,0,0,0.22)",
  topBarBg: "rgba(23,29,26,0.88)",
  navBg: "rgba(23,29,26,0.92)",
  buttonBg: "#1b221f",
  glassCard: "rgba(255,255,255,0.04)",
  softTile: "#202925",
  softTile2: "#1b2320",
  avatarTile: "#202925",
};

const avatars = ["🦊", "🦁", "🐺", "🐻", "🦅", "🐼", "🐱", "🐶", "🐸", "🐙"];

const tabs = [
  { id: "dashboard", label: "Início", icon: "🏠" },
  { id: "expenses", label: "Gastos", icon: "💳" },
  { id: "debts", label: "Dívidas", icon: "📋" },
  { id: "invest", label: "Invest.", icon: "🌱" },
  { id: "settings", label: "Config", icon: "⚙️" },
];

function createInitialData() {
  const base = defaultData();

  return {
    ...base,
    salary: 2500,
    expenses: [
      { id: 1, description: "Mercado", category: "Casa", date: "04/04/2026", amount: 250 },
      { id: 2, description: "Gasolina", category: "Transporte", date: "04/04/2026", amount: 180 },
      { id: 3, description: "Lanche", category: "Alimentação", date: "04/04/2026", amount: 35 },
    ],
    investments: [
      { id: 1, principal: 500 },
      { id: 2, principal: 300 },
    ],
    debts: [
      {
        id: 1,
        description: "Cartão Nubank",
        creditor: "Nubank",
        totalAmount: 1200,
        installmentValue: 200,
        totalInstallments: 6,
        remainingInstallments: 4,
        dueDay: 10,
      },
    ],
  };
}


function MainApp({ user, onLogout, onUpdateUser, themeMode, toggleTheme, theme }) {
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
            avatars={avatars}
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
        {tabs.map((item) => {
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

export default function App() {
  const [users, setUsers] = useStorage("finchly_users");
  const [themeMode, setThemeMode] = useStorage("finchly_theme_mode");
  const [currentUser, setCurrentUser] = useState(null);

  const resolvedThemeMode = themeMode === "dark" ? "dark" : "light";
  const theme = resolvedThemeMode === "dark" ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    setThemeMode(resolvedThemeMode === "dark" ? "light" : "dark");
  };

  const handleUpdateUser = (patch) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...patch,
    };

    setCurrentUser(updatedUser);

    const currentUsers = users || {};
    setUsers({
      ...currentUsers,
      [updatedUser.id]: updatedUser,
    });
  };

  return (
    <ThemeContext.Provider value={theme}>
      {currentUser ? (
        <MainApp
          user={currentUser}
          onLogout={() => setCurrentUser(null)}
          onUpdateUser={handleUpdateUser}
          themeMode={resolvedThemeMode}
          toggleTheme={toggleTheme}
          theme={theme}
        />
      ) : (
        <LoginScreen
          onLogin={setCurrentUser}
          users={users}
          setUsers={setUsers}
          themeMode={resolvedThemeMode}
          toggleTheme={toggleTheme}
          theme={theme}
        />
      )}
    </ThemeContext.Provider>
  );
}