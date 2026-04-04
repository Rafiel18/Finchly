import React from "react";
import Dashboard from "./components/Dashboard";

export default function App() {
  const dadosTeste = {
    expenses: [
      { id: 1, description: "Mercado", category: "Casa", date: "04/04/2026", amount: 250 },
      { id: 2, description: "Gasolina", category: "Transporte", date: "04/04/2026", amount: 180 },
      { id: 3, description: "Lanche", category: "Alimentação", date: "04/04/2026", amount: 35 },
    ],
    investments: [{ id: 1, principal: 500 }],
  };

  return (
    <Dashboard
      d={dadosTeste}
      salary={2500}
      balance={2035}
      daily={80}
      totalExp={465}
      remDays={25}
    />
  );
}