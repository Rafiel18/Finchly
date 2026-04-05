import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Debts from "./Debts";
import Expenses from "./Expenses";
import Investments from "./Investments";
import Settings from "./Settings";
import TopBar from "./layout/TopBar";
import BottomNav from "./layout/BottomNav";

import { TABS, AVATARS } from "../config/appConfig";
import { useUserData } from "../hooks/useUserData";
import { getDashboardSummary } from "../utils/dashboardSummary";

export default function MainApp({
  user,
  onLogout,
  onUpdateUser,
  themeMode,
  toggleTheme,
  theme,
}) {
  const [tab, setTab] = useState("dashboard");
  const { data: d, save, reset } = useUserData(user.id);

  const { salary, totalExp, balance, remDays, daily } = getDashboardSummary(d);

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
          paddingTop: "18px",
          paddingRight: "16px",
          paddingLeft: "16px",
          paddingBottom: "160px",
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
            onResetData={reset}
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
