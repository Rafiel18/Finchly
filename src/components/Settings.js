import React, { useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Settings({
  d,
  save,
  user,
  onUpdateUser,
  avatars = [],
  onResetData,
}) {
  const t = useTheme();
  const [salaryInput, setSalaryInput] = useState(String(d?.salary || ""));
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "🦊");

  const avatarTile = t.avatarTile || t.bgCard;
  const softTile = t.softTile || t.bgInput;
  const softTile2 = t.softTile2 || t.bgCard;

  const handleSaveSalary = () => {
    const salary = Number(String(salaryInput).replace(",", "."));
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
            Ajustes do perfil, finanças e preferências
          </p>
        </div>

        <Card
          style={{
            padding: "18px",
            marginBottom: "14px",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowCard,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: t.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            Perfil
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "16px",
              background: softTile,
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "16px",
                background: t.accentSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                flexShrink: 0,
              }}
            >
              {user?.avatar || "👤"}
            </div>

            <div>
              <p style={{ fontSize: "16px", fontWeight: 800, color: t.text, marginBottom: "4px" }}>
                {user?.name || "Sem nome"}
              </p>
              <p style={{ fontSize: "13px", color: t.textSub }}>
                Perfil ativo no momento
              </p>
            </div>
          </div>

          <p style={{ fontSize: "13px", color: t.textSub, marginBottom: "10px" }}>
            Escolha um novo avatar
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
                  height: "46px",
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
            boxShadow: t.shadowCard,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: t.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            Finanças
          </p>

          <div
            style={{
              padding: "12px",
              borderRadius: "16px",
              background: softTile,
              border: `1px solid ${t.border}`,
              marginBottom: "12px",
            }}
          >
            <p style={{ fontSize: "12px", color: t.textMuted, marginBottom: "6px" }}>
              Receita mensal atual
            </p>
            <p style={{ fontSize: "18px", fontWeight: 800, color: t.text }}>
              {formatBRL(d?.salary || 0)}
            </p>
          </div>

          <input
            type="text"
            inputMode="decimal"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            placeholder="Digite sua receita mensal"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: `1px solid ${t.border}`,
              background: softTile2,
              color: t.text,
              marginBottom: "12px",
              fontSize: "16px",
              lineHeight: "1.2",
              boxSizing: "border-box",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
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
            marginBottom: "14px",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowCard,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: t.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
            }}
          >
            Ações do perfil
          </p>

          <div
            style={{
              padding: "14px",
              borderRadius: "16px",
              background: t.negativeSoft,
              border: `1px solid ${t.negative}30`,
            }}
          >
            <p style={{ fontSize: "14px", color: t.text, fontWeight: 700, marginBottom: "6px" }}>
              Resetar dados
            </p>
            <p style={{ fontSize: "13px", color: t.textSub, lineHeight: 1.5, marginBottom: "12px" }}>
              Isso vai limpar salário, gastos, dívidas e investimentos deste perfil, mas sem apagar o usuário.
            </p>

            <button
              onClick={() => {
                const confirmed = window.confirm(
                  "Tem certeza que deseja resetar os dados deste perfil? Essa ação vai limpar salário, gastos, dívidas e investimentos."
                );

                if (confirmed && onResetData) {
                  onResetData();
                }
              }}
              style={{
                width: "100%",
                background: "transparent",
                color: t.negative,
                border: `1px solid ${t.negative}40`,
                borderRadius: "12px",
                padding: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Resetar dados deste perfil
            </button>
          </div>
        </Card>

        <Card
          style={{
            padding: "18px",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowCard,
          }}
        >
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
            Estado do app
          </p>

          <p style={{ fontSize: "14px", color: t.textSub, lineHeight: 1.6 }}>
            Perfil com avatar, receita, reset de dados, persistência local, alternância de tema e módulos principais ativos.
          </p>
        </Card>
      </div>
    </div>
  );
}