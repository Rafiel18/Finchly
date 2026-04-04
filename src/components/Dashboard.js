import { useTheme } from "../context/theme";
import Card from "./ui/Card";
import { formatBRL } from "../utils/formatters";

export default function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();
  const totalInv = d.investments.reduce((s, i) => s + Number(i.principal), 0);
  const isHealthy = daily >= 0 && balance >= 0;

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: t.text }}>Visão Geral</h2>
        <p style={{ color: t.textSub, fontSize: "13px", marginTop: "2px" }}>
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
          borderRadius: "22px",
          padding: "26px 22px",
          marginBottom: "14px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            background: isHealthy ? "rgba(61,140,95,0.1)" : "rgba(192,57,43,0.08)",
            borderRadius: "50%",
            filter: "blur(30px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontSize: "20px" }}>{isHealthy ? "🌿" : "⚠️"}</span>
          <p
            style={{
              color: t.textSub,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {isHealthy ? "Planejamento em dia" : "Atenção necessária"}
          </p>
        </div>
        <p style={{ color: t.heroText, fontSize: "11px", fontWeight: 500, marginBottom: "6px" }}>
          Pode gastar por dia
        </p>
        <p
          style={{
            fontSize: "42px",
            fontWeight: 800,
            fontFamily: "'JetBrains Mono',monospace",
            color: daily >= 0 ? t.heroText : t.negative,
            letterSpacing: "-1px",
            lineHeight: 1,
          }}
        >
          {formatBRL(daily < 0 ? 0 : daily)}
        </p>
        <p style={{ color: t.textSub, fontSize: "12px", marginTop: "8px" }}>
          {remDays} dias restantes neste mês
        </p>
        {daily < 0 && (
          <div
            style={{
              marginTop: "10px",
              background: t.negativeSoft,
              border: `1px solid ${t.negative}30`,
              borderRadius: "10px",
              padding: "8px 12px",
            }}
          >
            <p style={{ color: t.negative, fontSize: "12px", fontWeight: 600 }}>
              Seus gastos estão acima da receita este mês.
            </p>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
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
          <Card key={c.label} style={{ padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: c.soft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                {c.icon}
              </div>
              <p style={{ fontSize: "11px", color: t.textSub, fontWeight: 600 }}>{c.label}</p>
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono',monospace",
                color: c.color,
              }}
            >
              {formatBRL(c.value)}
            </p>
          </Card>
        ))}
      </div>

      {d.expenses.length > 0 && (
        <>
          <p style={{ fontSize: "13px", fontWeight: 700, color: t.textSub, marginBottom: "10px" }}>
            Últimos lançamentos
          </p>
          {d.expenses.slice(-3).reverse().map((e) => (
            <Card
              key={e.id}
              style={{
                padding: "12px 14px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>{e.description}</p>
                <p style={{ fontSize: "11px", color: t.textMuted }}>
                  {e.category} · {e.date}
                </p>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: t.warning,
                  fontFamily: "'JetBrains Mono'",
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
            marginTop: "10px",
            background: t.accentSoft,
            border: `1px solid ${t.accent}30`,
          }}
        >
          <p style={{ fontSize: "13px", color: t.accent, fontWeight: 600 }}>
            💡 Dica: vá em Config e cadastre sua receita mensal para ativar o gasto diário.
          </p>
        </Card>
      )}
    </div>
  );
}