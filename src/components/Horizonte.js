import React from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Horizonte({ d, salary = 0, balance = 0, remDays = 1 }) {
  const t = useTheme();

  const safeSalary = Number(salary || 0);
  const safeBalance = Number(balance || 0);
  const safeRemDays = Math.max(Number(remDays || 1), 1);

  const now = new Date();
  const currentDay = now.getDate();

  const dailyProjection = safeRemDays > 0 ? safeBalance / safeRemDays : safeBalance;

  const projectedDays = Array.from({ length: safeRemDays }, (_, index) => {
    const day = currentDay + index;
    const projectedBalance = safeBalance - dailyProjection * index;

    let tone = t.positive;
    let bg = t.positiveSoft;

    if (projectedBalance < 0) {
      tone = t.negative;
      bg = t.negativeSoft;
    } else if (projectedBalance <= safeSalary * 0.1) {
      tone = t.warning;
      bg = t.warningSoft;
    }

    return {
      day,
      projectedBalance,
      plannedSpend: dailyProjection,
      tone,
      bg,
    };
  });

  return (
    <div
      style={{
        padding: "4px 0 8px",
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
              marginBottom: "4px",
            }}
          >
            Horizonte
          </h2>

          <p style={{ color: t.textSub, fontSize: "14px" }}>
            Projeção simples do saldo até o fim do mês
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <Card
            style={{
              padding: "14px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
              Salário
            </p>
            <p style={{ fontSize: "15px", fontWeight: 800, color: t.text }}>
              {formatBRL(safeSalary)}
            </p>
          </Card>

          <Card
            style={{
              padding: "14px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
              Saldo atual
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: safeBalance >= 0 ? t.positive : t.negative,
              }}
            >
              {formatBRL(safeBalance)}
            </p>
          </Card>

          <Card
            style={{
              padding: "14px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
              Por dia
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: dailyProjection >= 0 ? t.accent : t.negative,
              }}
            >
              {formatBRL(dailyProjection)}
            </p>
          </Card>
        </div>

        <Card
          style={{
            padding: "16px",
            marginBottom: "14px",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: t.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Horizonte de saldo
          </p>

          <div style={{ display: "grid", gap: "10px" }}>
            {projectedDays.map((item) => (
              <div
                key={item.day}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr 1fr",
                  gap: "10px",
                  alignItems: "center",
                  padding: "12px",
                  borderRadius: "14px",
                  background: item.bg,
                  border: `1px solid ${t.border}`,
                }}
              >
                <div>
                  <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "4px" }}>
                    Dia
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: 800, color: t.text }}>
                    {item.day}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "4px" }}>
                    Meta diária
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: t.accent }}>
                    {formatBRL(item.plannedSpend)}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "4px" }}>
                    Saldo projetado
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: item.tone,
                    }}
                  >
                    {formatBRL(item.projectedBalance)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}