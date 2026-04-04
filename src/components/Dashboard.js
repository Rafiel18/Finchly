import { useTheme } from "../context/theme";
import Card from "./ui/Card";
import { formatBRL } from "../utils/formatters";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();
  const totalInv = d.investments.reduce((s, i) => s + Number(i.principal), 0);
  const isHealthy = daily >= 0 && balance >= 0;

  const summaryCards = [
    {
      label: "Receita",
      value: salary,
      color: t.positive,
      soft: t.positiveSoft,
      icon: "💼",
    },
    {
      label: "Gastos",
      value: totalExp,
      color: t.warning,
      soft: t.warningSoft,
      icon: "💳",
    },
    {
      label: "Saldo",
      value: balance,
      color: balance >= 0 ? t.positive : t.negative,
      soft: balance >= 0 ? t.positiveSoft : t.negativeSoft,
      icon: "💰",
    },
    {
      label: "Investido",
      value: totalInv,
      color: t.accentBlue,
      soft: t.accentBlueSoft,
      icon: "🌱",
    },
  ];

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: t.text,
            letterSpacing: "-0.6px",
          }}
        >
          Visão Geral
        </h2>

        <p
          style={{
            color: t.textSub,
            fontSize: "13px",
            marginTop: "4px",
            textTransform: "capitalize",
          }}
        >
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
          marginBottom: "18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: t.shadow,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-24px",
            right: "-24px",
            width: "120px",
            height: "120px",
            background: isHealthy
              ? "rgba(61,140,95,0.10)"
              : "rgba(192,57,43,0.08)",
            borderRadius: "50%",
            filter: "blur(34px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "110px",
            height: "110px",
            background: "rgba(255,255,255,0.18)",
            borderRadius: "50%",
            filter: "blur(36px)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.45)",
              border: `1px solid ${t.heroBorder}`,
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ fontSize: "20px" }}>{isHealthy ? "🌿" : "⚠️"}</span>
            <p
              style={{
                color: t.textSub,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
              }}
            >
              {isHealthy ? "Planejamento em dia" : "Atenção necessária"}
            </p>
          </div>

          <p
            style={{
              color: t.textSub,
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {remDays} dias
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <p
            style={{
              color: t.heroText,
              fontSize: "11px",
              fontWeight: 700,
              marginBottom: "8px",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Pode gastar por dia
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: daily >= 0 ? t.heroText : t.negative,
                lineHeight: 1.1,
                opacity: 0.88,
              }}
            >
              R$
            </span>

            <span
              style={{
                fontSize: "54px",
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: daily >= 0 ? t.heroText : t.negative,
                letterSpacing: "-2px",
                lineHeight: 0.95,
              }}
            >
              {(daily < 0 ? 0 : daily).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <p
            style={{
              color: t.textSub,
              fontSize: "12px",
              marginTop: "10px",
            }}
          >
            Restam {remDays} dias neste mês
          </p>
        </div>

        {daily < 0 && (
          <div
            style={{
              position: "relative",
              marginTop: "14px",
              background: t.negativeSoft,
              border: `1px solid ${t.negative}30`,
              borderRadius: "12px",
              padding: "10px 12px",
            }}
          >
            <p
              style={{
                color: t.negative,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Seus gastos estão acima da receita este mês.
            </p>
          </div>
        )}

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "18px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.72)",
              border: `1px solid ${t.border}`,
              borderRadius: "16px",
              padding: "14px 14px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Saldo do mês
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color: balance >= 0 ? t.positive : t.negative,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {formatBRL(balance)}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.72)",
              border: `1px solid ${t.border}`,
              borderRadius: "16px",
              padding: "14px 14px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Gastos atuais
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color: t.warning,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {formatBRL(totalExp)}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        {summaryCards.map((c) => (
          <Card
            key={c.label}
            style={{
              padding: "16px",
              borderRadius: "20px",
              boxShadow: t.shadowCard,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: c.soft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                marginBottom: "14px",
              }}
            >
              {c.icon}
            </div>

            <p
              style={{
                fontSize: "11px",
                color: t.textSub,
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.7px",
              }}
            >
              {c.label}
            </p>

            <p
              style={{
                fontSize: "16px",
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

      {d.expenses.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: t.text,
              }}
            >
              Últimos lançamentos
            </p>

            <p
              style={{
                fontSize: "12px",
                color: t.textMuted,
                fontWeight: 600,
              }}
            >
              {d.expenses.length} itens
            </p>
          </div>

          {d.expenses.slice(-3).reverse().map((e) => (
            <Card
              key={e.id}
              style={{
                padding: "13px 14px",
                marginBottom: "9px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "16px",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: t.text,
                    marginBottom: "3px",
                  }}
                >
                  {e.description}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: t.textMuted,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {e.category} · {e.date}
                </p>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: t.warning,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginLeft: "12px",
                  flexShrink: 0,
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
            borderRadius: "16px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: t.accent,
              fontWeight: 700,
            }}
          >
            💡 Dica: vá em Config e cadastre sua receita mensal para ativar o gasto diário.
          </p>
        </Card>
      )}
    </div>
  );
}