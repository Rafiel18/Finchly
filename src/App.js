import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Expenses from "./components/Expenses";
import DebtCard from "./components/DebtCard";
import { ThemeContext } from "./context/theme";

const theme = {
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
};

function Placeholder({ titulo }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "18px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #ececec",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "8px", color: "#1f2937" }}>{titulo}</h2>
        <p style={{ color: "#6b7280" }}>Tela em reconexão controlada</p>
      </div>
    </div>
  );
}

function DebtsTest({ d }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Array.isArray(d?.debts) && d.debts.length > 0 ? (
        d.debts.map((dbt) => (
          <DebtCard
            key={dbt.id}
            dbt={dbt}
            editId={null}
            editVal=""
            setEditId={() => {}}
            setEditVal={() => {}}
            onUpdate={() => {}}
            onRemove={() => {}}
          />
        ))
      ) : (
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "18px",
            border: "1px solid #ececec",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "8px", color: "#1f2937" }}>Dívidas</h2>
          <p style={{ color: "#6b7280" }}>Nenhuma dívida de teste cadastrada.</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");

  const dadosTeste = {
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

  const salary = 2500;
  const totalExp = 465;
  const balance = 2035;
  const remDays = 25;
  const daily = 80;

  const tabs = [
    { id: "dashboard", label: "Início", icon: "🏠" },
    { id: "expenses", label: "Gastos", icon: "💳" },
    { id: "debts", label: "Dívidas", icon: "📋" },
    { id: "invest", label: "Invest.", icon: "🌱" },
    { id: "settings", label: "Config", icon: "⚙️" },
  ];

  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          color: theme.text,
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${theme.border}`,
            background: "#ffffffee",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Finchly</h1>
        </div>

        <div style={{ flex: 1, padding: "16px 16px 100px" }}>
          {tab === "dashboard" && (
            <Dashboard
              d={dadosTeste}
              salary={salary}
              balance={balance}
              daily={daily}
              totalExp={totalExp}
              remDays={remDays}
            />
          )}

          {tab === "expenses" && <Expenses d={dadosTeste} save={() => {}} />}
          {tab === "debts" && <DebtsTest d={dadosTeste} />}
          {tab === "invest" && <Placeholder titulo="Investimentos" />}
          {tab === "settings" && <Placeholder titulo="Configurações" />}
        </div>

        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background: "#ffffffee",
            borderTop: `1px solid ${theme.border}`,
            padding: "8px 0 12px",
          }}
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: tab === item.id ? theme.accent : theme.textMuted,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                fontWeight: tab === item.id ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}