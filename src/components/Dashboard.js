import React from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();

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
      ? { label: "Sem receita", color: t.textMuted, emoji: "🫥" }
      : totalExp > salary || daily < 0
      ? { label: "Crítico", color: t.negative, emoji: "🚨" }
      : spentPercent >= 70
      ? { label: "Atenção", color: t.warning, emoji: "👀" }
      : { label: "Em dia", color: t.positive, emoji: "🌿" };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        padding: "24px 16px 40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ marginBottom: "18px" }}>
          <h1 style={{ fontSize: "28px", color: t.text, marginBottom: "4px" }}>
            Visão Geral
          </h1>
          <p style={{ color: t.textSub, fontSize: "14px" }}>
            Seu resumo financeiro do mês
          </p>
        </div>

        <Card
          style={{
            background: t.heroGrad,
            border: `1px solid ${t.heroBorder}`,
            borderRadius: "24px",
            padding: "22px",
            marginBottom: "16px",
            boxShadow: t.shadow,
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

          <p style={{ fontSize: "12px", color: t.textSub, marginBottom: "6px" }}>
            Pode gastar por dia
          </p>
          <p
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: daily >= 0 ? t.positive : t.negative,
              marginBottom: "8px",
            }}
          >
            {formatBRL(daily)}
          </p>

          <p style={{ fontSize: "13px", color: t.textSub, marginBottom: "14px" }}>
            Restam {remDays} dias no mês
          </p>

          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: t.textSub,
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
                      ? `linear-gradient(90deg, ${t.warning}, ${t.negative})`
                      : `linear-gradient(90deg, ${t.accent}, ${t.accentBlue})`,
                }}
              />
            </div>
          </div>
        </Card>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {[
            { label: "Receita", value: salary, color: t.positive },
            { label: "Gastos", value: totalExp, color: t.warning },
            { label: "Saldo", value: balance, color: balance >= 0 ? t.positive : t.negative },
            { label: "Investido", value: totalInv, color: t.accentBlue },
          ].map((item) => (
            <Card
              key={item.label}
              style={{
                background: t.bgCard,
                borderRadius: "18px",
                padding: "16px",
                boxShadow: t.shadowCard,
                border: `1px solid ${t.border}`,
              }}
            >
              <p style={{ fontSize: "12px", color: t.textSub, marginBottom: "8px" }}>
                {item.label}
              </p>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: item.color }}>
                {formatBRL(item.value)}
              </p>
            </Card>
          ))}
        </div>

        <Card
          style={{
            background: t.bgCard,
            borderRadius: "18px",
            padding: "16px",
            marginBottom: "16px",
            boxShadow: t.shadowCard,
            border: `1px solid ${t.border}`,
          }}
        >
          <p style={{ fontSize: "12px", color: t.textSub, marginBottom: "8px" }}>
            Maior categoria
          </p>
          <h3 style={{ fontSize: "20px", color: t.text, marginBottom: "6px" }}>
            {topCategoryName}
          </h3>
          <p style={{ color: t.textSub, fontSize: "14px" }}>
            {topCategoryEntry
              ? `${topCategoryName} já consumiu ${formatBRL(topCategoryValue)} no mês.`
              : "Ainda não há dados suficientes."}
          </p>
        </Card>

        <Card
          style={{
            background: t.bgCard,
            borderRadius: "18px",
            padding: "16px",
            boxShadow: t.shadowCard,
            border: `1px solid ${t.border}`,
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: "bold", color: t.text, marginBottom: "12px" }}>
            Últimos lançamentos
          </p>

          {expenses.length === 0 ? (
            <p style={{ color: t.textSub, fontSize: "14px" }}>
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
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: t.text }}>
                      {e.description}
                    </p>
                    <p style={{ fontSize: "12px", color: t.textSub }}>
                      {e.category} • {e.date}
                    </p>
                  </div>

                  <p style={{ fontSize: "14px", fontWeight: "bold", color: t.warning }}>
                    {formatBRL(e.amount)}
                  </p>
                </div>
              ))
          )}
        </Card>
      </div>
    </div>
  );
}