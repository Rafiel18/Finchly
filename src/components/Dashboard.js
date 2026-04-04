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
    <div className="fade-up" style={{ paddingBottom: "4px" }}>
      <div style={{ marginBottom: "22px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: t.text,
            letterSpacing: "-0.6px",
            marginBottom: "4px",
          }}
        >
          Visão Geral
        </h2>

        <p
          style={{
            color: t.textSub,
            fontSize: "13px",
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
          borderRadius: "26px",
          padding: "24px 20px 20px",
          marginBottom: "18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: t.shadow,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: "120px",
            height: "120px",
            background: isHealthy
              ? "rgba(61,140,95,0.12)"
              : "rgba(192,57,43,0.10)",
            borderRadius: "50%",
            filter: "blur(34px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-35px",
            left: "-20px",
            width: "100px",
            height: "100px",
            background: "rgba(255,255,255,0.10)",
            borderRadius: "50%",
            filter: "blur(28px)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.35)",
              border: `1px solid ${t.heroBorder}`,
              borderRadius: "999px",
              padding: "7px 12px",
            }}
          >
            <span style={{ fontSize: "16px" }}>{isHealthy ? "🌿" : "⚠️"}</span>
            <span
              style={{
                color: t.textSub,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
              }}
            >
              {isHealthy ? "Planejamento em dia" : "Atenção necessária"}
            </span>
          </div>

          <span
            style={{
              fontSize: "12px",
              color: t.textSub,
              fontWeight: 600,
            }}
          >
            {remDays} dias
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              color: t.textSub,
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Pode gastar por dia
          </p>

          <p
            style={{
              fontSize: "40px",
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: daily >= 0 ? t.heroText : t.negative,
              letterSpacing: "-1.4px",
              lineHeight: 1,
              marginBottom: "12px",
            }}
          >
            {formatBRL(daily < 0 ? 0 : daily)}
          </p>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: "14px",
                padding: "10px 12px",
                minWidth: "120px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  color: t.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                  fontWeight: 700,
                }}
              >
                Saldo do mês
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: balance >= 0 ? t.positive : t.negative,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {formatBRL(balance)}
              </p>
            </div>

            <div
              style={{
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                borderRadius: "14px",
                padding: "10px 12px",
                minWidth: "120px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  color: t.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                  fontWeight: 700,
                }}
              >
                Gastos atuais
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: t.warning,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {formatBRL(totalExp)}
              </p>
            </div>
          </div>
        </div>

        {daily < 0 && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: "14px",
              background: t.negativeSoft,
              border: `1px solid ${t.negative}30`,
              borderRadius: "14px",
              padding: "10px 12px",
            }}
          >
            <p
              style={{
                color: t.negative,
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              Seus gastos estão acima da receita este mês.
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {summaryCards.map((c) => (
          <Card
            key={c.label}
            style={{
              padding: "16px",
              borderRadius: "18px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: c.soft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              {c.icon}
            </div>

            <p
              style={{
                fontSize: "11px",
                color: t.textSub,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
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
                letterSpacing: "-0.3px",
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
                letterSpacing: "-0.2px",
              }}
            >
              Últimos lançamentos
            </p>

            <span
              style={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 600,
              }}
            >
              {d.expenses.length} itens
            </span>
          </div>

          {d.expenses.slice(-3).reverse().map((e) => (
            <Card
              key={e.id}
              style={{
                padding: "14px",
                marginBottom: "10px",
                borderRadius: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: t.text,
                      marginBottom: "4px",
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

                <div
                  style={{
                    background: t.warningSoft,
                    border: `1px solid ${t.warning}25`,
                    borderRadius: "12px",
                    padding: "8px 10px",
                    flexShrink: 0,
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: t.warning,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {formatBRL(e.amount)}
                  </p>
                </div>
              </div>
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
            borderRadius: "18px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: t.accent,
              fontWeight: 700,
              lineHeight: 1.45,
            }}
          >
            💡 Dica: vá em Config e cadastre sua receita mensal para ativar o gasto diário.
          </p>
        </Card>
      )}
    </div>
  );
}