import React, { useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Debts({ d, save }) {
  const t = useTheme();

  const [form, setForm] = useState({
    description: "",
    creditor: "",
    installmentValue: "",
    totalInstallments: "",
    remainingInstallments: "",
    dueDay: "",
  });

  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");

  const debts = Array.isArray(d?.debts) ? d.debts : [];

  const totalPending = debts.reduce((sum, dbt) => {
    return sum + Number(dbt.installmentValue || 0) * Number(dbt.remainingInstallments || 0);
  }, 0);

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      description: "",
      creditor: "",
      installmentValue: "",
      totalInstallments: "",
      remainingInstallments: "",
      dueDay: "",
    });
  };

  const addDebt = () => {
    const description = form.description.trim();
    const creditor = form.creditor.trim();
    const installmentValue = Number(form.installmentValue);
    const totalInstallments = Number(form.totalInstallments);
    const remainingInstallments = Number(form.remainingInstallments);
    const dueDay = Number(form.dueDay);

    if (!description) return;
    if (!installmentValue || installmentValue <= 0) return;
    if (!totalInstallments || totalInstallments <= 0) return;
    if (
      Number.isNaN(remainingInstallments) ||
      remainingInstallments < 0 ||
      remainingInstallments > totalInstallments
    ) {
      return;
    }
    if (Number.isNaN(dueDay) || dueDay < 1 || dueDay > 31) return;

    const newDebt = {
      id: String(Date.now()),
      description,
      creditor,
      installmentValue,
      totalInstallments,
      remainingInstallments,
      dueDay,
      createdAt: new Date().toISOString(),
    };

    save({
      debts: [newDebt, ...debts],
    });

    resetForm();
  };

  const removeDebt = (id) => {
    save({
      debts: debts.filter((dbt) => dbt.id !== id),
    });
  };

  const saveRemaining = (id) => {
    const value = Number(editVal);
    if (Number.isNaN(value) || value < 0) return;

    save({
      debts: debts.map((dbt) =>
        dbt.id === id
          ? {
              ...dbt,
              remainingInstallments: Math.min(value, Number(dbt.totalInstallments || 0)),
            }
          : dbt
      ),
    });

    setEditId(null);
    setEditVal("");
  };

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

        <Card
          style={{
            padding: "16px",
            marginBottom: "14px",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: t.text,
              marginBottom: "14px",
            }}
          >
            Nova dívida
          </h3>

          <div style={{ display: "grid", gap: "12px" }}>
            <input
              type="text"
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Descrição"
              style={inputStyle(t)}
            />

            <input
              type="text"
              value={form.creditor}
              onChange={(e) => updateForm("creditor", e.target.value)}
              placeholder="Credor ou loja"
              style={inputStyle(t)}
            />

            <input
              type="number"
              value={form.installmentValue}
              onChange={(e) => updateForm("installmentValue", e.target.value)}
              placeholder="Valor da parcela (R$)"
              style={inputStyle(t)}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <input
                type="number"
                value={form.totalInstallments}
                onChange={(e) => updateForm("totalInstallments", e.target.value)}
                placeholder="Total de parcelas"
                style={inputStyle(t)}
              />

              <input
                type="number"
                value={form.remainingInstallments}
                onChange={(e) => updateForm("remainingInstallments", e.target.value)}
                placeholder="Restantes"
                style={inputStyle(t)}
              />
            </div>

            <input
              type="number"
              value={form.dueDay}
              onChange={(e) => updateForm("dueDay", e.target.value)}
              placeholder="Dia do vencimento"
              min="1"
              max="31"
              style={inputStyle(t)}
            />

            <button
              onClick={addDebt}
              style={{
                width: "100%",
                background: t.accent,
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "14px",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "15px",
              }}
            >
              Adicionar dívida
            </button>
          </div>
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
                      padding: "10px 12px",
                      whiteSpace: "nowrap",
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
                  <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
  }}
>
  <input
    type="number"
    value={editVal}
    onChange={(e) => setEditVal(e.target.value)}
    placeholder="Parcelas restantes"
    style={{
      width: "100%",
      minWidth: 0,
      padding: "12px",
      borderRadius: "12px",
      border: `1px solid ${t.border}`,
      background: t.bgInput,
      color: t.text,
      fontSize: "14px",
      boxSizing: "border-box",
    }}
  />

  <button
    onClick={() => saveRemaining(dbt.id)}
    style={{
      flex: "1 1 140px",
      minWidth: "120px",
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
      flex: "1 1 140px",
      minWidth: "120px",
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

function inputStyle(t) {
  return {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: `1px solid ${t.border}`,
    background: t.bgInput,
    color: t.text,
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };
}