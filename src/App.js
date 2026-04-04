import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Expenses from "./components/Expenses";
import DebtCard from "./components/DebtCard";
import Investments from "./components/Investments";
import Settings from "./components/Settings";
import { ThemeContext } from "./context/theme";
import { defaultData } from "./utils/finance";
import { daysInMonth, dayOfMonth } from "./utils/date";
import { useStorage } from "./hooks/useStorage";

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

function DebtsTest({ d, save }) {
  const removeDebt = (id) => {
    save({
      debts: d.debts.filter((dbt) => dbt.id !== id),
    });
  };

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
            onRemove={removeDebt}
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
          <p style={{ color: "#6b7280" }}>Nenhuma dívida cadastrada.</p>
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [users, setUsers] = useStorage("finchly_users");
  const [name, setName] = useState("");

  const existingUsers = users || {};

  const createUser = () => {
    if (!name.trim()) return;

    const id = "u_" + Date.now();
    const newUser = {
      id,
      name: name.trim(),
      avatar: "🌿",
    };

    setUsers({
      ...existingUsers,
      [id]: newUser,
    });

    onLogin(newUser);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid #ececec",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "8px", color: "#1f2937" }}>Finchly</h1>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>Escolha um perfil ou crie um novo</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {Object.values(existingUsers).map((user) => (
            <button
              key={user.id}
              onClick={() => onLogin(user)}
              style={{
                border: "1px solid #ececec",
                background: "#fff",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {user.avatar} {user.name}
            </button>
          ))}
        </div>

        <input
          placeholder="Novo usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ececec",
            marginBottom: "12px",
            fontSize: "14px",
          }}
        />

        <button
          onClick={createUser}
          style={{
            width: "100%",
            background: theme.accent,
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Criar usuário
        </button>
      </div>
    </div>
  );
}

function MainApp({ user, onLogout }) {
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
  const totalExp = d.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const balance = salary - totalExp;
  const remDays = daysInMonth() - dayOfMonth() + 1;
  const daily = remDays > 0 ? balance / remDays : 0;

  const tabs = [
    { id: "dashboard", label: "Início", icon: "🏠" },
    { id: "expenses", label: "Gastos", icon: "💳" },
    { id: "debts", label: "Dívidas", icon: "📋" },
    { id: "invest", label: "Invest.", icon: "🌱" },
    { id: "settings", label: "Config", icon: "⚙️" },
  ];

  return (
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Finchly</h1>
          <p style={{ color: theme.textSub, fontSize: "12px" }}>
            {user.avatar} {user.name}
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            background: "#fff",
            border: "1px solid #ececec",
            borderRadius: "10px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>

      <div style={{ flex: 1, padding: "16px 16px 100px" }}>
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
        {tab === "debts" && <DebtsTest d={d} save={save} />}
        {tab === "invest" && <Investments d={d} save={save} />}
        {tab === "settings" && <Settings d={d} save={save} user={user} />}
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
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <ThemeContext.Provider value={theme}>
      {currentUser ? (
        <MainApp user={currentUser} onLogout={() => setCurrentUser(null)} />
      ) : (
        <LoginScreen onLogin={setCurrentUser} />
      )}
    </ThemeContext.Provider>
  );
}