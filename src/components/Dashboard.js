import React from "react";

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const expenses = Array.isArray(d?.expenses) ? d.expenses : [];
  const investments = Array.isArray(d?.investments) ? d.investments : [];

  const totalInv = investments.reduce((sum, item) => sum + Number(item.principal || 0), 0);
  const spentPercent = salary > 0 ? Math.min((totalExp / salary) * 100, 100) : 0;

  const categoryMap = {};
  expenses.forEach((expense) => {
    const category = expense.category || "Outros";
    const amount = Number(expense.amount || 0);
    categoryMap[category] = (categoryMap[category] || 0) + amount;
  });

  const topCategoryEntry = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
  const topCategoryName = topCategoryEntry ? topCategoryEntry[0] : "Nenhuma";
  const topCategoryValue = topCategoryEntry ? topCategoryEntry[1] : 0;

  const status =
    salary <= 0
      ? { label: "Sem receita", color: "#6b7280", emoji: "🫥" }
      : totalExp > salary || daily < 0
      ? { label: "Crítico", color: "#c0392b", emoji: "🚨" }
      : spentPercent >= 70
      ? { label: "Atenção", color: "#c45a1a", emoji: "👀" }
      : { label: "Em dia", color: "#2e7d52", emoji: "🌿" };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f2",
        padding: "24px 16px 40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ marginBottom: "18px" }}>
          <h1 style={{ fontSize: "28px", color: "#1f2937", marginBottom: "4px" }}>
            Visão Geral
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Seu resumo financeiro do mês
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #d6efe1 0%, #e8f4f8 100%)",
            border: "1px solid rgba(61,140,95,0.2)",
            borderRadius: "24px",
            padding: "22px",
            marginBottom: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.7)",
              borderRadius: "999px",
              padding: "8px 12px",
              marginBottom: "14px",
            }}
          >
            <span>{status.emoji}</span>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: status.color }}>
              {status.label}
            </span>
          </div>

          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
            Pode gastar por dia
          </p>
          <p
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: daily >= 0 ? "#2e7d52" : "#c0392b",
              marginBottom: "8px",
            }}
          >
            {formatBRL(daily)}
          </p>

          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px" }}>
            Restam {remDays} dias no mês
          </p>

          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "6px",
              }}
            >
              <span>Renda consumida</span>
              <span>{salary > 0 ? `${spentPercent.toFixed(1)}%` : "--"}</span>
            </div>

            <div
              style={{
                width: "100%",
                height: "10px",
                background: "rgba(255,255,255,0.7)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${spentPercent}%`,
                  height: "100%",
                  background:
                    spentPercent >= 90
                      ? "linear-gradient(90deg, #c45a1a, #c0392b)"
                      : "linear-gradient(90deg, #3d8c5f, #3b7dd8)",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {[
            { label: "Receita", value: salary, color: "#2e7d52" },
            { label: "Gastos", value: totalExp, color: "#c45a1a" },
            { label: "Saldo", value: balance, color: balance >= 0 ? "#2e7d52" : "#c0392b" },
            { label: "Investido", value: totalInv, color: "#3b7dd8" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                border: "1px solid #ececec",
              }}
            >
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                {item.label}
              </p>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: item.color }}>
                {formatBRL(item.value)}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "16px",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ececec",
          }}
        >
          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
            Maior categoria
          </p>
          <h3 style={{ fontSize: "20px", color: "#1f2937", marginBottom: "6px" }}>
            {topCategoryName}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            {topCategoryEntry
              ? `${topCategoryName} já consumiu ${formatBRL(topCategoryValue)} no mês.`
              : "Ainda não há dados suficientes."}
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #ececec",
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937", marginBottom: "12px" }}>
            Últimos lançamentos
          </p>

          {expenses.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Nenhum gasto registrado.
            </p>
          ) : (
            expenses
              .slice(-3)
              .reverse()
              .map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>
                      {e.description}
                    </p>
                    <p style={{ fontSize: "12px", color: "#6b7280" }}>
                      {e.category} • {e.date}
                    </p>
                  </div>

                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#c45a1a" }}>
                    {formatBRL(e.amount)}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}