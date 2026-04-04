import { useState } from "react";
import { useTheme } from "../context/theme";
import { CDI_AA } from "../constants/finance";
import Card from "./ui/Card";
import Inp from "./ui/Inp";

export default function Settings({ d, save, user }) {
  const t = useTheme();
  const [salary, setSalary] = useState(d.salary || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    save({ salary: Number(salary) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontSize: "21px", fontWeight: 800, color: t.text, marginBottom: "18px" }}>
        Configurações
      </h2>

      <Card style={{ padding: "20px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: t.accentSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            {user.avatar}
          </div>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: t.text }}>{user.name}</p>
            <p style={{ fontSize: "12px", color: t.textMuted }}>Sua conta no Finchly</p>
          </div>
        </div>

        <p
          style={{
            fontSize: "11px",
            color: t.textSub,
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px",
          }}
        >
          💼 Receita / Salário mensal
        </p>

        <Inp
          type="number"
          placeholder="R$ 0,00"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          style={{ fontFamily: "'JetBrains Mono'", fontSize: "16px" }}
        />

        <button
          className="btn"
          onClick={handleSave}
          style={{
            width: "100%",
            background: saved
              ? `linear-gradient(135deg,${t.positive},#1E6640)`
              : `linear-gradient(135deg,${t.accent},#2D6E4A)`,
            color: "#fff",
            padding: "12px",
            borderRadius: "12px",
            fontSize: "14px",
            transition: "all .3s",
          }}
        >
          {saved ? "✓ Salvo com sucesso!" : "Salvar"}
        </button>
      </Card>

      <Card style={{ padding: "18px" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: t.textMuted,
            marginBottom: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Resumo da conta
        </p>

        {[
          ["Gastos", d.expenses.length + " lançamentos"],
          ["Dívidas", d.debts.length + " registradas"],
          ["Investimentos", d.investments.length + " ativos"],
          ["CDI (março/2026)", CDI_AA + "% a.a."],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "9px 0",
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <span style={{ fontSize: "13px", color: t.textSub }}>{l}</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: t.text }}>{v}</span>
          </div>
        ))}
      </Card>

      <p style={{ fontSize: "12px", color: t.textMuted, textAlign: "center", marginTop: "24px" }}>
        Finchly · v2.0 🌿
      </p>
    </div>
  );
}