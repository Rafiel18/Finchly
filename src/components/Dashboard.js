import React, { useEffect, useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();
  const [mensagem, setMensagem] = useState("Carregando diagnóstico...");

  const expenses = Array.isArray(d?.expenses) ? d.expenses : [];
  const investments = Array.isArray(d?.investments) ? d.investments : [];

  const totalInv = investments.reduce((sum, item) => sum + Number(item.principal || 0), 0);
  const spentPercent = salary > 0 ? Math.min((totalExp / salary) * 100, 100) : 0;

  const now = new Date();
  const currentDay = now.getDate();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthProgress = Math.min((currentDay / totalDays) * 100, 100);

  const averageSpentPerExpense = expenses.length > 0 ? totalExp / expenses.length : 0;
  const averageSpentPerDaySoFar = currentDay > 0 ? totalExp / currentDay : 0;
  const projectedMonthSpend = currentDay > 0 ? (totalExp / currentDay) * totalDays : totalExp;
  const projectedMonthBalance = salary - projectedMonthSpend;

  const categoryMap = {};
  expenses.forEach((expense) => {
    const category = expense.category || "Outros";
    const amount = Number(expense.amount || 0);
    categoryMap[category] = (categoryMap[category] || 0) + amount;
  });

  const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const topCategoryEntry = entries.length ? entries[0] : null;
  const topCategoryName = topCategoryEntry ? topCategoryEntry[0] : "Nenhuma";
  const topCategoryValue = topCategoryEntry ? topCategoryEntry[1] : 0;
  const topCategoryPercent = totalExp > 0 ? (topCategoryValue / totalExp) * 100 : 0;

  const glassCard = t.glassCard || "rgba(255,255,255,0.72)";
  const softTile = t.softTile || t.bgInput;
  const softTile2 = t.softTile2 || t.bgCard;

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

  useEffect(() => {
    setMensagem(status.message);
  }, [status.message]);

  const insights = [];

  if (salary <= 0) {
    insights.push("Cadastre sua receita mensal para liberar projeções e metas diárias.");
    if (expenses.length > 0) {
      insights.push(`Você já registrou ${expenses.length} gasto${expenses.length > 1 ? "s" : ""}.`);
    }
  } else {
    insights.push(`Você já usou ${spentPercent.toFixed(1)}% da sua renda no mês.`);
    if (topCategoryEntry) {
      insights.push(
        `${topCategoryName} é sua maior categoria, com ${topCategoryPercent.toFixed(1)}% dos gastos.`
      );
    }
    if (projectedMonthBalance < 0) {
      insights.push(`Mantendo esse ritmo, você pode fechar o mês em ${formatBRL(projectedMonthBalance)}.`);
    } else {
      insights.push(`Mantendo esse ritmo, a projeção é fechar o mês com ${formatBRL(projectedMonthBalance)}.`);
    }
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
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        <Card
          style={{
            background: t.heroGrad,
            border: `1px solid ${t.heroBorder}`,
            borderRadius: "24px",
            padding: "24px 20px 18px",
            marginBottom: "16px",
            position: "relative",
            overflow: "hidden",
            boxShadow: t.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: glassCard,
                border: `1px solid ${t.border}`,
                borderRadius: "999px",
                padding: "10px 14px",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
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

            <div style={{ textAlign: "right", minWidth: "70px" }}>
              <p style={{ fontSize: "12px", color: t.textSub, fontWeight: 700 }}>Restam</p>
              <p style={{ fontSize: "18px", color: t.text, fontWeight: 800 }}>{remDays} dias</p>
            </div>
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
            {mensagem}
          </p>

          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: t.textSub,
                marginBottom: "6px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span>Renda consumida</span>
              <span>{salary > 0 ? `${spentPercent.toFixed(1)}%` : "Sem dado"}</span>
            </div>

            <div
              style={{
                background: glassCard,
                borderRadius: "999px",
                height: "10px",
                overflow: "hidden",
                border: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  width: `${salary > 0 ? Math.min(spentPercent, 100) : 0}%`,
                  height: "100%",
                  borderRadius: "999px",
                  transition: "width 0.8s ease",
                  background:
                    spentPercent >= 90
                      ? `linear-gradient(90deg, ${t.warning}, ${t.negative})`
                      : `linear-gradient(90deg, ${t.accent}, ${t.accentBlue})`,
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div
              style={{
                background: glassCard,
                border: `1px solid ${t.border}`,
                borderRadius: "18px",
                padding: "14px",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: t.textMuted,
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "7px",
                }}
              >
                Saldo do mês
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: balance >= 0 ? t.positive : t.negative,
                }}
              >
                {formatBRL(balance)}
              </p>
            </div>

            <div
              style={{
                background: glassCard,
                border: `1px solid ${t.border}`,
                borderRadius: "18px",
                padding: "14px",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: t.textMuted,
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "7px",
                }}
              >
                Projeção do mês
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: projectedMonthBalance >= 0 ? t.positive : t.negative,
                }}
              >
                {formatBRL(projectedMonthBalance)}
              </p>
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
            <Card
              key={c.label}
              style={{
                padding: "16px",
                background: t.bgCard,
                border: `1px solid ${t.border}`,
              }}
            >
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

              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: c.color,
                  lineHeight: 1.2,
                }}
              >
                {formatBRL(c.value)}
              </p>
            </Card>
          ))}
        </div>

        <Card style={{ padding: "16px", marginBottom: "12px", background: t.bgCard, border: `1px solid ${t.border}` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  color: t.textMuted,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                }}
              >
                Maior categoria
              </p>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: t.text }}>
                {topCategoryName}
              </h3>
            </div>

            <div
              style={{
                background: softTile,
                color: t.accent,
                borderRadius: "12px",
                padding: "10px 12px",
                minWidth: "88px",
                textAlign: "center",
                border: `1px solid ${t.border}`,
              }}
            >
              <p style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>
                Impacto
              </p>
              <p style={{ fontSize: "16px", fontWeight: 800 }}>
                {topCategoryEntry ? `${topCategoryPercent.toFixed(0)}%` : "--"}
              </p>
            </div>
          </div>

          <p style={{ color: t.textSub, fontSize: "13px" }}>
            {topCategoryEntry
              ? `${topCategoryName} já consumiu ${formatBRL(topCategoryValue)} no mês.`
              : "Ainda não há gastos suficientes para identificar uma categoria dominante."}
          </p>
        </Card>

        <Card style={{ padding: "16px", marginBottom: "12px", background: t.bgCard, border: `1px solid ${t.border}` }}>
          <p
            style={{
              fontSize: "11px",
              color: t.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            Insights rápidos
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {insights.slice(0, 3).map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: softTile,
                  border: `1px solid ${t.border}`,
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: 1 }}>
                  {index === 0 ? "📌" : index === 1 ? "🧠" : "📈"}
                </span>
                <p style={{ fontSize: "13px", color: t.textSub, lineHeight: 1.45 }}>{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <Card style={{ padding: "14px", background: t.bgCard, border: `1px solid ${t.border}` }}>
            <p
              style={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Ritmo diário
            </p>
            <p style={{ fontSize: "15px", fontWeight: 800, color: t.text }}>
              {formatBRL(averageSpentPerDaySoFar)}
            </p>
            <p style={{ fontSize: "11px", color: t.textSub, marginTop: "6px" }}>
              média gasta por dia
            </p>
          </Card>

          <Card style={{ padding: "14px", background: t.bgCard, border: `1px solid ${t.border}` }}>
            <p
              style={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Ticket médio
            </p>
            <p style={{ fontSize: "15px", fontWeight: 800, color: t.text }}>
              {formatBRL(averageSpentPerExpense)}
            </p>
            <p style={{ fontSize: "11px", color: t.textSub, marginTop: "6px" }}>
              por lançamento
            </p>
          </Card>
        </div>

        {recentExpenses.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <p style={{ fontSize: "14px", fontWeight: 800, color: t.text }}>Últimos lançamentos</p>
              <span style={{ fontSize: "12px", color: t.textMuted, fontWeight: 700 }}>
                {expenses.length} itens
              </span>
            </div>

            {recentExpenses.map((e) => (
              <Card
                key={e.id}
                style={{
                  padding: "14px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: t.text,
                      marginBottom: "4px",
                    }}
                  >
                    {e.description}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: t.textMuted,
                    }}
                  >
                    {e.category} · {e.date}
                  </p>
                </div>

                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: t.warning,
                    marginLeft: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatBRL(e.amount)}
                </p>
              </Card>
            ))}
          </>
        )}

        {salary === 0 && (
          <Card
            style={{
              padding: "16px",
              marginTop: "12px",
              background: softTile2,
              border: `1px solid ${t.accent}30`,
            }}
          >
            <p style={{ fontSize: "13px", color: t.accent, fontWeight: 700 }}>
              💡 Dica: cadastre sua receita mensal para liberar o gasto diário, diagnóstico e projeções.
            </p>
          </Card>
        )}

        <Card style={{ padding: "14px", marginTop: "12px", background: t.bgCard, border: `1px solid ${t.border}` }}>
          <p
            style={{
              fontSize: "11px",
              color: t.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            Ritmo do mês
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: t.textSub }}>Tempo do mês</span>
            <span style={{ fontSize: "12px", color: t.text, fontWeight: 700 }}>
              {monthProgress.toFixed(0)}%
            </span>
          </div>

          <div
            style={{
              background: softTile,
              borderRadius: "999px",
              overflow: "hidden",
              height: "8px",
              marginBottom: "12px",
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                width: `${monthProgress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${t.accentBlue}, ${t.accent})`,
                borderRadius: "999px",
                transition: "width 0.8s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: t.textSub }}>Gasto da renda</span>
            <span style={{ fontSize: "12px", color: t.text, fontWeight: 700 }}>
              {salary > 0 ? `${spentPercent.toFixed(0)}%` : "--"}
            </span>
          </div>

          <div
            style={{
              background: softTile,
              borderRadius: "999px",
              overflow: "hidden",
              height: "8px",
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                width: `${salary > 0 ? Math.min(spentPercent, 100) : 0}%`,
                height: "100%",
                background:
                  spentPercent > monthProgress
                    ? `linear-gradient(90deg, ${t.warning}, ${t.negative})`
                    : `linear-gradient(90deg, ${t.accent}, ${t.accentBlue})`,
                borderRadius: "999px",
                transition: "width 0.8s ease",
              }}
            />
          </div>

          <p style={{ fontSize: "12px", color: t.textMuted, marginTop: "10px", lineHeight: 1.4 }}>
            {salary > 0
              ? spentPercent > monthProgress
                ? "Seu gasto está correndo mais rápido que o calendário do mês."
                : "Seu consumo está acompanhando bem o ritmo do mês."
              : "Cadastre sua receita para comparar gasto versus tempo do mês."}
          </p>
        </Card>
      </div>
    </div>
  );
}