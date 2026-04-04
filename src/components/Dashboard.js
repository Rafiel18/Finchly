import React from "react";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f2",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "16px", color: "#222" }}>Dashboard</h1>

        <p><strong>Salário:</strong> R$ {salary}</p>
        <p><strong>Saldo:</strong> R$ {balance}</p>
        <p><strong>Pode gastar por dia:</strong> R$ {daily}</p>
        <p><strong>Total de gastos:</strong> R$ {totalExp}</p>
        <p><strong>Dias restantes:</strong> {remDays}</p>
        <p><strong>Qtd. de despesas:</strong> {d?.expenses?.length || 0}</p>
        <p><strong>Qtd. de investimentos:</strong> {d?.investments?.length || 0}</p>
      </div>
    </div>
  );
}