import React, { useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Debts({ d, save }) {
  const t = useTheme();
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");

  const debts = Array.isArray(d?.debts) ? d.debts : [];

  const totalPending = debts.reduce((sum, dbt) => {
    return sum + Number(dbt.installmentValue || 0) * Number(dbt.remainingInstallments || 0);
  }, 0);

  const removeDebt = (id) => {
    save({
      debts: debts.filter((dbt) => dbt.id !== id),
    });
  };

  const saveRemaining = (id) => {
    const value = Number(editVal);
    if (isNaN(value) || value < 0) return;

    save({
      debts: debts.map((dbt) =>
        dbt.id === id
          ? { ...dbt, remainingInstallments: value }
          : dbt
      ),
    });

    setEditId(null);
    setEditVal("");
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
            Dívidas
          </h2>
          <p style={{ color: t.textSub, fontSize: "14px" }}>
            Controle das parcelas e saldo restante
          </p>
        </div>

        <Card
          style={{
            padding: "16px",
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
              marginBottom: "8px",
            }}
          >
            Total restante
          </p>

          <p
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: t.negative,
            }}
          >
            {formatBRL(totalPending)}
          </p>
        </Card>

        {debts.length === 0 ? (
          <Card
            style={{
              padding: "22px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "15px", color: t.text }}>
              Nenhuma dívida cadastrada.
            </p>
            <p style={{ fontSize: "13px", color: t.textSub, marginTop: "6px" }}>
              Quando você adicionar dívidas, elas aparecerão aqui.
            </p>
          </Card>
        ) : (
          debts.map((dbt) => {
            const remainingValue =
              Number(dbt.installmentValue || 0) * Number(dbt.remainingInstallments || 0);

            return (
              <Card
                key={dbt.id}
                style={{
                  padding: "16px",
                  marginBottom: "12px",
                  background: t.bgCard,
                  border: `1px solid ${t.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: 800,
                        color: t.text,
                        marginBottom: "4px",
                      }}
                    >
                      {dbt.description || "Dívida sem nome"}
                    </h3>
                    <p style={{ fontSize: "13px", color: t.textSub }}>
                      {dbt.creditor || "Sem credor"} • vencimento dia {dbt.dueDay || "-"}
                    </p>
                  </div>

                  <button
                    onClick={() => removeDebt(dbt.id)}
                    style={{
                      background: t.negativeSoft,
                      color: t.negative,
                      border: `1px solid ${t.negative}30`,
                      borderRadius: "10px",
                      padding: "8px 10px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Excluir
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      background: t.bgInput,
                      borderRadius: "12px",
                      padding: "12px",
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
                      Valor da parcela
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: t.text }}>
                      {formatBRL(dbt.installmentValue || 0)}
                    </p>
                  </div>

                  <div
                    style={{
                      background: t.bgInput,
                      borderRadius: "12px",
                      padding: "12px",
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
                      Restante
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: t.negative }}>
                      {formatBRL(remainingValue)}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: t.textSub, marginBottom: "8px" }}>
                  Parcelas: {dbt.remainingInstallments || 0} de {dbt.totalInstallments || 0} restantes
                </p>

                {editId === dbt.id ? (
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    <input
                      type="number"
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      placeholder="Parcelas restantes"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "12px",
                        border: `1px solid ${t.border}`,
                        background: t.bgInput,
                        color: t.text,
                        fontSize: "14px",
                      }}
                    />

                    <button
                      onClick={() => saveRemaining(dbt.id)}
                      style={{
                        background: t.accent,
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Salvar
                    </button>

                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditVal("");
                      }}
                      style={{
                        background: "#fff",
                        color: t.textSub,
                        border: `1px solid ${t.border}`,
                        borderRadius: "12px",
                        padding: "12px 14px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(dbt.id);
                      setEditVal(String(dbt.remainingInstallments || 0));
                    }}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      background: t.accentSoft,
                      color: t.accent,
                      border: `1px solid ${t.accent}30`,
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Editar parcelas restantes
                  </button>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}