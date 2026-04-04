import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/theme";
import Card from "./ui/Card";
import { formatBRL } from "../utils/formatters";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();
  const [animatedDaily, setAnimatedDaily] = useState(0);

  const totalInv = d.investments.reduce((s, i) => s + Number(i.principal || 0), 0);
  const expenses = Array.isArray(d.expenses) ? d.expenses : [];

  const spentPercent = salary > 0 ? Math.min((totalExp / salary) * 100, 100) : 0;
  const monthProgress = useMemo(() => {
    const now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Math.min((now.getDate() / totalDays) * 100, 100);
  }, []);

  const averageSpentPerExpense = expenses.length > 0 ? totalExp / expenses.length : 0;

  const averageSpentPerDaySoFar = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    return currentDay > 0 ? totalExp / currentDay : 0;
  }, [totalExp]);

  const projectedMonthSpend = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    if (currentDay <= 0) return totalExp;
    return (totalExp / currentDay) * totalDays;
  }, [totalExp]);

  const projectedMonthBalance = salary - projectedMonthSpend;

  const categoryMap = useMemo(() => {
    const map = {};
    for (const expense of expenses) {
      const category = expense.category || "Outros";
      const amount = Number(expense.amount || 0);
      map[category] = (map[category] || 0) + amount;
    }
    return map;
  }, [expenses]);

  const topCategoryEntry = useMemo(() => {
    const entries = Object.entries(categoryMap);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [categoryMap]);

  const topCategoryName = topCategoryEntry ? topCategoryEntry[0] : "Nenhuma";
  const topCategoryValue = topCategoryEntry ? topCategoryEntry[1] : 0;
  const topCategoryPercent = totalExp > 0 ? (topCategoryValue / totalExp) * 100 : 0;

  const status = useMemo(() => {
    if (salary <= 0) {
      return {
        label: "Sem receita cadastrada",
        tone: "neutral",
        icon: "🫥",
        color: t.textSub,
        soft: t.bgInput,
        border: t.border,
        message: "Cadastre sua receita para liberar análises mais inteligentes.",
      };
    }

    if (totalExp > salary || daily < 0) {
      return {
        label: "Crítico",
        tone: "negative",
        icon: "🚨",
        color: t.negative,
        soft: t.negativeSoft,
        border: `${t.negative}30`,
        message: "Seu ritmo atual indica risco real de fechar o mês no vermelho.",
      };
    }

    if (spentPercent >= 90) {
      return {
        label: "Atenção máxima",
        tone: "warning",
        icon: "⚠️",
        color: t.warning,
        soft: t.warningSoft,
        border: `${t.warning}30`,
        message: "Você já consumiu quase toda a renda do mês.",
      };
    }

    if (spentPercent >= 70) {
      return {
        label: "Atenção",
        tone: "warning",
        icon: "👀",
        color: t.warning,
        soft: t.warningSoft,
        border: `${t.warning}30`,
        message: "Ainda dá para ajustar a rota, mas o orçamento apertou.",
      };
    }

    return {
      label: "Planejamento em dia",
      tone: "positive",
      icon: "🌿",
      color: t.heroText,
      soft: t.accentSoft,
      border: `${t.accent}25`,
      message: "Seu orçamento está saudável até aqui.",
    };
  }, [salary, totalExp, daily, spentPercent, t]);

  const insights = useMemo(() => {
    const list = [];

    if (salary <= 0) {
      list.push("Cadastre sua receita mensal para liberar projeções e metas diárias.");
      if (expenses.length > 0) {
        list.push(`Você já registrou ${expenses.length} gasto${expenses.length > 1 ? "s" : ""}.`);
      }
      return list.slice(0, 3);
    }

    list.push(`Você já usou ${spentPercent.toFixed(1)}% da sua renda no mês.`);

    if (topCategoryEntry) {
      list.push(
        `${topCategoryName} é sua maior categoria, com ${topCategoryPercent.toFixed(1)}% dos gastos.`
      );
    }

    if (projectedMonthBalance < 0) {
      list.push(`Mantendo esse ritmo, você pode fechar o mês em ${formatBRL(projectedMonthBalance)}.`);
    } else {
      list.push(`Mantendo esse ritmo, a projeção é fechar o mês com ${formatBRL(projectedMonthBalance)}.`);
    }

    if (averageSpentPerDaySoFar > 0) {
      list.push(`Seu gasto médio por dia está em ${formatBRL(averageSpentPerDaySoFar)}.`);
    }

    if (daily >= 0 && salary > 0) {
      list.push(`Seu limite seguro por dia agora é ${formatBRL(daily)}.`);
    }

    return list.slice(0, 3);
  }, [
    salary,
    expenses.length,
    spentPercent,
    topCategoryEntry,
    topCategoryName,
    topCategoryPercent,
    projectedMonthBalance,
    averageSpentPerDaySoFar,
    daily,
  ]);

  useEffect(() => {
    const target = daily < 0 ? 0 : daily;
    let frame;
    let start = null;
    const duration = 700;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedDaily(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [daily]);

  const recentExpenses = expenses.slice(-3).reverse();

  return (
    <div className="fade-up">
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

      <div
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
            position: "absolute",
            top: "-28px",
            right: "-18px",
            width: "120px",
            height: "120px",
            background:
              status.tone === "negative"
                ? "rgba(192,57,43,0.10)"
                : status.tone === "warning"
                ? "rgba(196,90,26,0.10)"
                : "rgba(61,140,95,0.10)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }}
        />

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
              background: "rgba(255,255,255,0.58)",
              border: `1px solid ${status.border}`,
              borderRadius: "999px",
              padding: "10px 14px",
              backdropFilter: "blur(6px)",
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

          <div
            style={{
              textAlign: "right",
              minWidth: "70px",
            }}
          >
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
            fontSize: "clamp(40px, 10vw, 54px)",
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', monospace",
            color: daily >= 0 ? t.heroText : t.negative,
            letterSpacing: "-1.4px",
            lineHeight: 1,
          }}
        >
          {formatBRL(animatedDaily)}
        </p>

        <p style={{ color: t.textSub, fontSize: "13px", marginTop: "8px", marginBottom: "14px" }}>
          {status.message}
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
              background: "rgba(255,255,255,0.55)",
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
              background: "rgba(255,255,255,0.72)",
              border: `1px solid ${t.border}`,
              borderRadius: "18px",
              padding: "14px",
              backdropFilter: "blur(6px)",
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
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                color: balance >= 0 ? t.positive : t.negative,
              }}
            >
              {formatBRL(balance)}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.72)",
              border: `1px solid ${t.border}`,
              borderRadius: "18px",
              padding: "14px",
              backdropFilter: "blur(6px)",
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
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                color: projectedMonthBalance >= 0 ? t.positive : t.negative,
              }}
            >
              {formatBRL(projectedMonthBalance)}
            </p>
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
        ].map((c, index) => (
          <Card
            key={c.label}
            style={{
              padding: "16px",
              transform: "translateY(0)",
              animation: `fadeUp 0.35s ease forwards`,
              animationDelay: `${index * 0.05}s`,
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
                fontFamily: "'JetBrains Mono', monospace",
                color: c.color,
                lineHeight: 1.2,
              }}
            >
              {formatBRL(c.value)}
            </p>
          </Card>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <Card style={{ padding: "16px" }}>
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
                background: t.accentSoft,
                color: t.accent,
                borderRadius: "12px",
                padding: "10px 12px",
                minWidth: "88px",
                textAlign: "center",
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

        <Card style={{ padding: "16px" }}>
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
            {insights.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: t.bgInput,
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
          }}
        >
          <Card style={{ padding: "14px" }}>
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
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: t.text,
              }}
            >
              {formatBRL(averageSpentPerDaySoFar)}
            </p>
            <p style={{ fontSize: "11px", color: t.textSub, marginTop: "6px" }}>
              média gasta por dia
            </p>
          </Card>

          <Card style={{ padding: "14px" }}>
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
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: t.text,
              }}
            >
              {formatBRL(averageSpentPerExpense)}
            </p>
            <p style={{ fontSize: "11px", color: t.textSub, marginTop: "6px" }}>
              por lançamento
            </p>
          </Card>
        </div>
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

          {recentExpenses.map((e, index) => (
            <Card
              key={e.id}
              style={{
                padding: "14px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                animation: `fadeUp 0.35s ease forwards`,
                animationDelay: `${index * 0.06}s`,
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
                  fontFamily: "'JetBrains Mono', monospace",
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
            background: t.accentSoft,
            border: `1px solid ${t.accent}30`,
          }}
        >
          <p style={{ fontSize: "13px", color: t.accent, fontWeight: 700 }}>
            💡 Dica: vá em Config e cadastre sua receita mensal para liberar o gasto diário, diagnóstico e projeções.
          </p>
        </Card>
      )}

      <Card style={{ padding: "14px", marginTop: "12px" }}>
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
            background: t.bgInput,
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
            background: t.bgInput,
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
  );
}