import React, { useMemo, useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Simulation({ d, salary, remDays }) {
  const t = useTheme();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const [simExpenses, setSimExpenses] = useState([]);

  const realExpenses = Array.isArray(d?.expenses) ? d.expenses : [];

  const totalRealExpenses = useMemo(() => {
    return realExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [realExpenses]);

  const totalSimulatedExpenses = useMemo(() => {
    return simExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [simExpenses]);

  const totalWithSimulation = totalRealExpenses + totalSimulatedExpenses;
  const simulatedBalance = Number(salary || 0) - totalWithSimulation;
  const simulatedDaily = remDays > 0 ? simulatedBalance / remDays : simulatedBalance;

  const consumedPercent =
    Number(salary || 0) > 0
      ? Math.min((totalWithSimulation / Number(salary)) * 100, 999)
      : 0;

  function handleAddSimExpense(e) {
    e.preventDefault();

    const value = Number(String(form.amount).replace(",", "."));

    if (!form.description.trim() || !value || value <= 0) return;

    const newExpense = {
      id: Date.now(),
      description: form.description.trim(),
      amount: value,
      category: form.category.trim(),
    };

    setSimExpenses((prev) => [newExpense, ...prev]);

    setForm({
      description: "",
      amount: "",
      category: "",
    });
  }

  function handleRemoveSimExpense(id) {
    setSimExpenses((prev) => prev.filter((item) => item.id !== id));
  }

  function handleClearSimulation() {
    setSimExpenses([]);
  }

  const inputStyle = {
    width: "100%",
    borderRadius: "14px",
    border: `1px solid ${t.border}`,
    background: t.bgInput,
    color: t.text,
    padding: "12px 14px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "grid", gap: "14px" }}>
      <Card style={{ padding: "18px" }}>
        <h2 style={{ margin: 0, fontSize: "22px", color: t.text }}>
          Simulação de gastos
        </h2>
        <p style={{ marginTop: "8px", color: t.textSub }}>
          Essa área é temporária. Nada aqui altera seus gastos reais.
        </p>
      </Card>

      <div
        style={{
          display: "grid",
          gap: "12px",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <Card style={{ padding: "16px" }}>
          <p style={{ margin: 0, color: t.textMuted, fontSize: "12px", fontWeight: 700 }}>
            Saldo simulado
          </p>
          <h3
            style={{
              marginTop: "10px",
              color: simulatedBalance >= 0 ? t.positive : t.negative,
            }}
          >
            {formatBRL(simulatedBalance)}
          </h3>
        </Card>

        <Card style={{ padding: "16px" }}>
          <p style={{ margin: 0, color: t.textMuted, fontSize: "12px", fontWeight: 700 }}>
            Pode gastar por dia
          </p>
          <h3
            style={{
              marginTop: "10px",
              color: simulatedDaily >= 0 ? t.accent : t.negative,
            }}
          >
            {formatBRL(simulatedDaily)}
          </h3>
        </Card>

        <Card style={{ padding: "16px" }}>
          <p style={{ margin: 0, color: t.textMuted, fontSize: "12px", fontWeight: 700 }}>
            Renda consumida
          </p>
          <h3 style={{ marginTop: "10px", color: t.warning }}>
            {consumedPercent.toFixed(1)}%
          </h3>
        </Card>

        <Card style={{ padding: "16px" }}>
          <p style={{ margin: 0, color: t.textMuted, fontSize: "12px", fontWeight: 700 }}>
            Gastos simulados
          </p>
          <h3 style={{ marginTop: "10px", color: t.text }}>
            {formatBRL(totalSimulatedExpenses)}
          </h3>
        </Card>
      </div>

      <Card style={{ padding: "16px" }}>
        <h3 style={{ marginTop: 0, color: t.text }}>Adicionar gasto simulado</h3>

        <form
          onSubmit={handleAddSimExpense}
          style={{ display: "grid", gap: "12px", marginTop: "12px" }}
        >
          <input
            type="text"
            placeholder="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            style={inputStyle}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amount: e.target.value }))
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Categoria (opcional)"
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                border: "none",
                borderRadius: "14px",
                padding: "12px 16px",
                background: t.accent,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Adicionar simulação
            </button>

            <button
              type="button"
              onClick={handleClearSimulation}
              style={{
                borderRadius: "14px",
                padding: "12px 16px",
                background: "transparent",
                color: t.text,
                border: `1px solid ${t.border}`,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Limpar tudo
            </button>
          </div>
        </form>
      </Card>

      <Card style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ margin: 0, color: t.text }}>Gastos simulados</h3>
          <span style={{ color: t.textMuted }}>{simExpenses.length} item(ns)</span>
        </div>

        {simExpenses.length === 0 ? (
          <p style={{ marginTop: "12px", color: t.textSub }}>
            Nenhum gasto simulado ainda.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
            {simExpenses.map((item) => (
              <Card
                key={item.id}
                style={{
                  padding: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong style={{ color: t.text }}>{item.description}</strong>
                  <p style={{ margin: "6px 0 0", color: t.textMuted }}>
                    {item.category || "Sem categoria"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ color: t.text }}>{formatBRL(item.amount)}</strong>
                  <button
                    type="button"
                    onClick={() => handleRemoveSimExpense(item.id)}
                    style={{
                      borderRadius: "12px",
                      padding: "10px 14px",
                      background: "transparent",
                      color: t.text,
                      border: `1px solid ${t.border}`,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Remover
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}