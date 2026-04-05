import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Debts from "./Debts";
import Expenses from "./Expenses";
import Investments from "./Investments";
import Settings from "./Settings";
import TopBar from "./layout/TopBar";
import BottomNav from "./layout/BottomNav";

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

  const handleResetData = () => {
    const fresh = createInitialData();
    setDados(fresh);
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
      <TopBar
        user={user}
        onLogout={onLogout}
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        theme={theme}
      />

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
            onResetData={handleResetData}
          />
        )}
      </div>

      <BottomNav
        tabs={TABS}
        activeTab={tab}
        onChangeTab={setTab}
        theme={theme}
      />
    </div>
  );
}