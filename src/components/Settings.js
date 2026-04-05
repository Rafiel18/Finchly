import React, { useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Settings({ d, save, user, onUpdateUser, avatars = [] }) {
  const t = useTheme();
  const [salaryInput, setSalaryInput] = useState(String(d?.salary || ""));
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "🦊");

  const avatarTile = t.avatarTile || t.bgCard;
  const softTile = t.softTile || t.bgInput;

  const handleSaveSalary = () => {
    const salary = Number(salaryInput);
    if (isNaN(salary) || salary < 0) return;

    save({
      salary,
    });
  };

  const handleSaveAvatar = () => {
    if (!onUpdateUser) return;

    onUpdateUser({
      avatar: selectedAvatar,
    });
  };

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
              marginBottom: "4px",
            }}
          >
            Configurações
          </h2>
          <p style={{ color: t.textSub, fontSize: "14px" }}>
            Ajustes básicos do seu perfil e finanças
          </p>
        </div>

        <Card
          style={{
            padding: "18px",
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
            Usuário
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: t.accentSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              {user?.avatar || "👤"}
            </div>

            <div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: t.text }}>
                {user?.name || "Sem nome"}
              </p>
              <p style={{ fontSize: "13px", color: t.textSub }}>
                Perfil ativo no momento
              </p>
            </div>
          </div>

          <p style={{ fontSize: "13px", color: t.textSub, marginBottom: "10px" }}>
            Trocar avatar
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                style={{
                  border:
                    selectedAvatar === avatar
                      ? `2px solid ${t.accent}`
                      : `1px solid ${t.border}`,
                  background: selectedAvatar === avatar ? t.accentSoft : avatarTile,
                  color: t.text,
                  borderRadius: "12px",
                  height: "44px",
                  cursor: "pointer",
                  fontSize: "22px",
                }}
              >
                {avatar}
              </button>
            ))}
          </div>

          <button
            onClick={handleSaveAvatar}
            style={{
              width: "100%",
              background: t.accentSoft,
              color: t.accent,
              border: `1px solid ${t.accent}30`,
              borderRadius: "12px",
              padding: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Salvar avatar
          </button>
        </Card>

        <Card
          style={{
            padding: "18px",
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
            Receita mensal
          </p>

          <p style={{ fontSize: "14px", color: t.textSub, marginBottom: "10px" }}>
            Valor atual: <strong style={{ color: t.text }}>{formatBRL(d?.salary || 0)}</strong>
          </p>

          <input
            type="number"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            placeholder="Digite sua receita mensal"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: `1px solid ${t.border}`,
              background: softTile,
              color: t.text,
              marginBottom: "12px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleSaveSalary}
            style={{
              width: "100%",
              background: t.accent,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Salvar receita
          </button>
        </Card>

        <Card
          style={{
            padding: "18px",
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
            Estado do app
          </p>

          <p style={{ fontSize: "14px", color: t.textSub, lineHeight: 1.5 }}>
            Base principal funcionando com usuários, dados persistidos, gastos, dívidas e investimentos.
          </p>
        </Card>
      </div>
    </div>
  );
}