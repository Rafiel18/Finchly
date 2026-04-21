import React, { useMemo, useState } from "react";

export default function Simulation({ d, salary, remDays, theme }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const [simExpenses, setSimExpenses] = useState([]);

  const realExpenses = Array.isArray(d?.expenses) ? d.expenses : [];

  const formatBRL = (value) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const totalRealExpenses = useMemo(() => {
    return realExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [realExpenses]);

  const totalSimulatedExpenses = useMemo(() => {
    return simExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [simExpenses]);

  const totalWithSimulation = totalRealExpenses + totalSimulatedExpenses;
  const simulatedBalance = Number(salary || 0) - totalWithSimulation;
  const simulatedDaily =
    remDays > 0 ? simulatedBalance / remDays : simulatedBalance;

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

  const boxStyle = {
    background: theme?.card || "#ffffff",
    border: `1px solid ${theme?.border || "#e5e7eb"}`,
    borderRadius: 24,
    padding: 16,
  };

  const inputStyle = {
    width: "100%",
    borderRadius: 16,
    border: `1px solid ${theme?.border || "#e5e7eb"}`,
    background: theme?.card || "#ffffff",
    color: theme?.text || "#111827",
    padding: "12px 14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const primaryButton = {
    border: "none",
    borderRadius: 16,
    padding: "12px 16px",
    background: theme?.accent || "#111827",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  };

  const secondaryButton = {
    borderRadius: 16,
    padding: "12px 16px",
    background: "transparent",
    color: theme?.text || "#111827",
    border: `1px solid ${theme?.border || "#e5e7eb"}`,
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={boxStyle}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Simulação de gastos</h2>
        <p style={{ marginTop: 8, color: theme?.muted || "#6b7280" }}>
          Essa área é temporária. Nada aqui altera seus gastos reais.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        <div style={boxStyle}>
          <p style={{ margin: 0, color: theme?.muted || "#6b7280" }}>
            Saldo simulado
          </p>
          <h3 style={{ marginTop: 10 }}>{formatBRL(simulatedBalance)}</h3>
        </div>

        <div style={boxStyle}>
          <p style={{ margin: 0, color: theme?.muted || "#6b7280" }}>
            Pode gastar por dia
          </p>
          <h3 style={{ marginTop: 10 }}>{formatBRL(simulatedDaily)}</h3>
        </div>

        <div style={boxStyle}>
          <p style={{ margin: 0, color: theme?.muted || "#6b7280" }}>
            Renda consumida
          </p>
          <h3 style={{ marginTop: 10 }}>{consumedPercent.toFixed(1)}%</h3>
        </div>

        <div style={boxStyle}>
          <p style={{ margin: 0, color: theme?.muted || "#6b7280" }}>
            Gastos simulados
          </p>
          <h3 style={{ marginTop: 10 }}>{formatBRL(totalSimulatedExpenses)}</h3>
        </div>
      </div>

      <div style={boxStyle}>
        <h3 style={{ marginTop: 0 }}>Adicionar gasto simulado</h3>

        <form
          onSubmit={handleAddSimExpense}
          style={{ display: "grid", gap: 12, marginTop: 12 }}
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

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" style={primaryButton}>
              Adicionar simulação
            </button>

            <button
              type="button"
              onClick={handleClearSimulation}
              style={secondaryButton}
            >
              Limpar tudo
            </button>
          </div>
        </form>
      </div>

      <div style={boxStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ margin: 0 }}>Gastos simulados</h3>
          <span style={{ color: theme?.muted || "#6b7280" }}>
            {simExpenses.length} item(ns)
          </span>
        </div>

        {simExpenses.length === 0 ? (
          <p style={{ marginTop: 12, color: theme?.muted || "#6b7280" }}>
            Nenhum gasto simulado ainda.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {simExpenses.map((item) => (
              <div
                key={item.id}
                style={{
                  border: `1px solid ${theme?.border || "#e5e7eb"}`,
                  borderRadius: 18,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>{item.description}</strong>
                  <p
                    style={{
                      margin: "6px 0 0",
                      color: theme?.muted || "#6b7280",
                    }}
                  >
                    {item.category || "Sem categoria"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <strong>{formatBRL(item.amount)}</strong>
                  <button
                    type="button"
                    onClick={() => handleRemoveSimExpense(item.id)}
                    style={secondaryButton}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}