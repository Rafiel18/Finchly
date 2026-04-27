import React from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Horizonte({ salary = 0, balance = 0, remDays = 1 }) {
  const t = useTheme();

  const safeSalary = Number(salary || 0);
  const safeBalance = Number(balance || 0);
  const safeRemDays = Math.max(Number(remDays || 1), 1);

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonthLabel = now.toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  });

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

  const savedPercent =
    safeSalary > 0 ? Math.max((safeBalance / safeSalary) * 100, 0) : 0;

  let statusLabel = "Sem receita";
  let statusColor = t.textMuted;
  let statusBg = t.bgInput;
  let statusText = "Cadastre sua receita para analisar seu horizonte.";

  if (safeSalary > 0) {
    if (safeBalance < 0) {
      statusLabel = "No vermelho";
      statusColor = t.negative;
      statusBg = t.negativeSoft;
      statusText = "Seu saldo atual já indica risco no fechamento do mês.";
    } else if (savedPercent < 10) {
      statusLabel = "Atenção";
      statusColor = t.warning;
      statusBg = t.warningSoft;
      statusText = "Você ainda fecha positivo, mas com pouca margem.";
    } else if (savedPercent < 20) {
      statusLabel = "Dentro do ideal";
      statusColor = t.positive;
      statusBg = t.positiveSoft;
      statusText = "Seu mês está sob controle e dentro de uma faixa saudável.";
    } else {
      statusLabel = "Excelente";
      statusColor = t.accent;
      statusBg = t.accentSoft;
      statusText = "Você está com boa folga e desempenho financeiro forte.";
    }
  }

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
            Projeção visual do saldo até o fim do mês
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <Card
            style={{
              padding: "16px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: t.textMuted,
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: "6px",
                  }}
                >
                  Performance
                </p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: t.text }}>
                  {safeBalance >= 0 ? "Sobrou dinheiro" : "Saldo comprometido"}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: safeBalance >= 0 ? t.positive : t.negative,
                  }}
                >
                  {formatBRL(safeBalance)}
                </p>
                <p style={{ fontSize: "13px", color: t.textSub }}>
                  saldo atual
                </p>
              </div>
            </div>
          </Card>

          <Card
            style={{
              padding: "16px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: t.textMuted,
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: "6px",
                  }}
                >
                  Economizado
                </p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: t.text }}>
                  {safeSalary > 0 ? "Percentual do salário preservado" : "Sem base de cálculo"}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: savedPercent >= 10 ? t.positive : t.warning,
                  }}
                >
                  {safeSalary > 0 ? `${savedPercent.toFixed(0)}%` : "--"}
                </p>
                <p style={{ fontSize: "13px", color: t.textSub }}>
                  reservado
                </p>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "12px",
                borderRadius: "999px",
                background: t.bgInput,
                overflow: "hidden",
                border: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  width: `${Math.min(savedPercent, 100)}%`,
                  height: "100%",
                  background:
                    savedPercent >= 20
                      ? t.accent
                      : savedPercent >= 10
                      ? t.positive
                      : t.warning,
                  borderRadius: "999px",
                  transition: "width .5s ease",
                }}
              />
            </div>
          </Card>

          <Card
            style={{
              padding: "16px",
              background: statusBg,
              border: `1px solid ${t.border}`,
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: t.textMuted,
                textTransform: "uppercase",
                fontWeight: 800,
                marginBottom: "6px",
              }}
            >
              Status do mês
            </p>

            <p
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: statusColor,
                marginBottom: "6px",
              }}
            >
              {statusLabel}
            </p>

            <p style={{ fontSize: "13px", color: t.textSub, lineHeight: 1.5 }}>
              {statusText}
            </p>
          </Card>
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
              Meta por dia
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
            padding: "0",
            overflow: "hidden",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              padding: "16px 16px 14px",
              borderBottom: `1px solid ${t.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  color: t.textMuted,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Horizonte de saldos
              </p>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: t.text,
                }}
              >
                {currentMonthLabel}
              </h3>
            </div>

            <div
              style={{
                background: t.bgInput,
                border: `1px solid ${t.border}`,
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "4px" }}>
                Dias restantes
              </p>
              <p style={{ fontSize: "15px", fontWeight: 800, color: t.text }}>
                {safeRemDays}
              </p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <div
              style={{
                minWidth: "520px",
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: t.textMuted,
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${t.border}`,
                  background: t.bgInput,
                }}
              >
                Dia
              </div>

              <div
                style={{
                  padding: "12px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: t.textMuted,
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${t.border}`,
                  borderLeft: `1px solid ${t.border}`,
                  background: t.bgInput,
                }}
              >
                Meta diária
              </div>

              <div
                style={{
                  padding: "12px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: t.textMuted,
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${t.border}`,
                  borderLeft: `1px solid ${t.border}`,
                  background: t.bgInput,
                }}
              >
                Saldo projetado
              </div>

              {projectedDays.map((item) => (
                <React.Fragment key={item.day}>
                  <div
                    style={{
                      padding: "14px 12px",
                      fontSize: "16px",
                      fontWeight: 800,
                      color: t.text,
                      borderBottom: `1px solid ${t.border}`,
                    }}
                  >
                    {item.day}
                  </div>

                  <div
                    style={{
                      padding: "14px 12px",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: t.accent,
                      borderBottom: `1px solid ${t.border}`,
                      borderLeft: `1px solid ${t.border}`,
                    }}
                  >
                    {formatBRL(item.plannedSpend)}
                  </div>

                  <div
                    style={{
                      padding: "14px 12px",
                      fontSize: "16px",
                      fontWeight: 800,
                      color: item.tone,
                      background: item.bg,
                      borderBottom: `1px solid ${t.border}`,
                      borderLeft: `1px solid ${t.border}`,
                    }}
                  >
                    {formatBRL(item.projectedBalance)}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}