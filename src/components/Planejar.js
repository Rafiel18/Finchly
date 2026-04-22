import React from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";

export default function Planejar() {
  const t = useTheme();

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
            Planejar
          </h2>

          <p style={{ color: t.textSub, fontSize: "14px" }}>
            Simule decisões antes de registrar de verdade
          </p>
        </div>

        <Card
          style={{
            padding: "18px",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: t.text,
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Tela de planejamento criada com sucesso.
          </p>

          <p
            style={{
              fontSize: "13px",
              color: t.textSub,
              lineHeight: 1.6,
            }}
          >
            Agora a gente pode evoluir essa aba para simular gastos e ver o impacto no saldo do mês, no valor diário e na renda consumida.
          </p>
        </Card>
      </div>
    </div>
  );
}