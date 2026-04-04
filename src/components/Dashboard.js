import React, { useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();
  const [mostrarDetalhes, setMostrarDetalhes] = useState(true);

  const expenses = Array.isArray(d?.expenses) ? d.expenses : [];
  const investments = Array.isArray(d?.investments) ? d.investments : [];

  const totalInv = investments.reduce((sum, item) => sum + Number(item.principal || 0), 0);
  const spentPercent = salary > 0 ? Math.min((totalExp / salary) * 100, 100) : 0;

  let status;
  if (salary <= 0) {
    status = {
      label: "Sem receita cadastrada",
      icon: "🫥",
      color: t.textSub,
      message: "Cadastre sua receita para liberar análises mais inteligentes.",
    };
  } else if (totalExp > salary || daily < 0) {
    status = {
      label: "Crítico",
      icon: "🚨",
      color: t.negative,
      message: "Seu ritmo atual indica risco de fechar o mês no vermelho.",
    };
  } else if (spentPercent >= 90) {
    status = {
      label: "Atenção máxima",
      icon: "⚠️",
      color: t.warning,
      message: "Você já consumiu quase toda a renda do mês.",
    };
  } else if (spentPercent >= 70) {
    status = {
      label: "Atenção",
      icon: "👀",
      color: t.warning,
      message: "Ainda dá para ajustar a rota, mas o orçamento apertou.",
    };
  } else {
    status = {
      label: "Planejamento em dia",
      icon: "🌿",
      color: t.heroText,
      message: "Seu orçamento está saudável até aqui.",
    };
  }

  const recentExpenses = expenses.slice(-3).reverse();

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
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: t.text,
              letterSpacing: "-0.8px",
              marginBottom: "4px",
            }}
          >
            Visão Geral
          </h2>

          <p style={{ color: t.textSub, fontSize: "14px" }}>
            Dashboard em teste controlado
          </p>
        </div>

        <Card
          style={{
            background: t.heroGrad,
            border: `1px solid ${t.heroBorder}`,
            borderRadius: "24px",
            padding: "24px 20px 18px",
            marginBottom: "16px",
            boxShadow: t.shadow,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.58)",
              border: `1px solid ${t.border}`,
              borderRadius: "999px",
              padding: "10px 14px",
              marginBottom: "14px",
            }}
          >
            <span style={{ fontSize: "20px" }}>{status.icon}</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: status.color,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
              }}
            >
              {status.label}
            </span>
          </div>

          <p
            style={{
              color: t.heroText,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Pode gastar por dia
          </p>

          <p
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: daily >= 0 ? t.heroText : t.negative,
              letterSpacing: "-1.4px",
              lineHeight: 1,
            }}
          >
            {formatBRL(daily)}
          </p>

          <p style={{ color: t.textSub, fontSize: "13px", marginTop: "8px", marginBottom: "14px" }}>
            {status.message}
          </p>

          <button
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            style={{
              background: t.accent,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {mostrarDetalhes ? "Ocultar detalhes" : "Mostrar detalhes"}
          </button>
        </Card>

        {mostrarDetalhes && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {[
              { label: "Receita", value: salary, color: t.positive, soft: t.positiveSoft, icon: "💼" },
              { label: "Gastos", value: totalExp, color: t.warning, soft: t.warningSoft, icon: "💳" },
              {
                label: "Saldo",
                value: balance,
                color: balance >= 0 ? t.positive : t.negative,
                soft: balance >= 0 ? t.positiveSoft : t.negativeSoft,
                icon: "💰",
              },
              { label: "Investido", value: totalInv, color: t.accentBlue, soft: t.accentBlueSoft, icon: "🌱" },
            ].map((c) => (
              <Card key={c.label} style={{ padding: "16px", background: t.bgCard, border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "12px",
                      background: c.soft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    {c.icon}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "11px",
                    color: t.textSub,
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {c.label}
                </p>

                <p style={{ fontSize: "15px", fontWeight: 800, color: c.color, lineHeight: 1.2 }}>
                  {formatBRL(c.value)}
                </p>
              </Card>
            ))}
          </div>
        )}

        {recentExpenses.length > 0 && (
          <Card style={{ padding: "16px", marginTop: "12px", background: t.bgCard, border: `1px solid ${t.border}` }}>
            <p style={{ fontSize: "14px", fontWeight: 800, color: t.text, marginBottom: "12px" }}>
              Últimos lançamentos
            </p>

            {recentExpenses.map((e) => (
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
                  <p style={{ fontSize: "14px", fontWeight: 700, color: t.text }}>{e.description}</p>
                  <p style={{ fontSize: "12px", color: t.textMuted }}>
                    {e.category} · {e.date}
                  </p>
                </div>

                <p style={{ fontSize: "14px", fontWeight: 800, color: t.warning }}>
                  {formatBRL(e.amount)}
                </p>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}