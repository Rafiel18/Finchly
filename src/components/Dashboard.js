import { useTheme } from "../context/theme";
import Card from "./ui/Card";
import { formatBRL } from "../utils/formatters";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();
  const totalInv = d.investments.reduce((s, i) => s + Number(i.principal), 0);
  const isHealthy = daily >= 0 && balance >= 0;

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "18px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: t.text,
            marginBottom: "4px",
          }}
        >
          Visão Geral
        </h2>

        <p
          style={{
            color: t.textMuted,
            fontSize: "13px",
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
          borderRadius: "28px",
          padding: "28px 22px",
          marginBottom: "18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-25px",
            right: "-25px",
            width: "120px",
            height: "120px",
            background: isHealthy
              ? "rgba(61,140,95,0.10)"
              : "rgba(192,57,43,0.08)",
            borderRadius: "50%",
            filter: "blur(32px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.45)",
              border: `1px solid ${t.border}`,
              borderRadius: "999px",
              padding: "10px 14px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ fontSize: "18px" }}>{isHealthy ? "🌿" : "⚠️"}</span>
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
              color: t.textSub,
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {remDays} dias
          </span>
        </div>

        <p
          style={{
            color: t.heroText,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Pode gastar por dia
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: daily >= 0 ? t.heroText : t.negative,
              opacity: 0.78,
              lineHeight: 1.1,
            }}
          >
            {daily < 0 ? "- R$" : "R$"}
          </span>

          <span
            style={{
              fontSize: "58px",
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: daily >= 0 ? t.heroText : t.negative,
              letterSpacing: "-1.8px",
              lineHeight: 0.95,
            }}
          >
            {Math.abs(daily < 0 ? daily : daily).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <p
          style={{
            color: t.textSub,
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          Restam {remDays} dias neste mês
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.72)",
              border: `1px solid ${t.border}`,
              borderRadius: "18px",
              padding: "14px 14px",
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Saldo do mês
            </p>
            <p
              style={{
                fontSize: "15px",
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
              borderRadius: "18px",
              padding: "14px 14px",
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Gastos atuais
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: t.warning,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {formatBRL(totalExp)}
            </p>
          </div>
        </div>

        {daily < 0 && (
          <div
            style={{
              marginTop: "14px",
              background: t.negativeSoft,
              border: `1px solid ${t.negative}30`,
              borderRadius: "12px",
              padding: "10px 12px",
            }}
          >
            <p style={{ color: t.negative, fontSize: "12px", fontWeight: 700 }}>
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
        {[
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
        ].map((c) => (
          <Card
            key={c.label}
            style={{
              padding: "16px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              transform: "translateY(0)",
              transition: "all 0.2s ease",
              border: `1px solid ${t.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
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
                  flexShrink: 0,
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
                  letterSpacing: "0.4px",
                }}
              >
                {c.label}
              </p>
            </div>

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
              justifyContent: "space-between",
              alignItems: "center",
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

            <span
              style={{
                fontSize: "12px",
                color: t.textMuted,
                fontWeight: 700,
              }}
            >
              {d.expenses.length} itens
            </span>
          </div>

          {d.expenses.slice(-3).reverse().map((e) => (
            <Card
              key={e.id}
              style={{
                padding: "14px 15px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: `1px solid ${t.border}`,
                background: t.bgCard,
                boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "14px",
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
                  marginLeft: "10px",
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
            💡 Dica: vá em Config e cadastre sua receita mensal para ativar o gasto diário.
          </p>
        </Card>
      )}
    </div>
  );
}