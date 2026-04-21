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

  const consumedPercent = Number(salary || 0) > 0
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

  const summaryMessage =
    simExpenses.length === 0
      ? "Adicione gastos simulados para ver como eles afetariam seu mês."
      : simulatedBalance >= 0
      ? "Simulação saudável: ainda sobraria saldo no mês."
      : "Atenção: nessa simulação, o mês fecharia no vermelho.";

  return (
    <div className="space-y-4">
      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Simulação de gastos</h2>
          <p
            className="text-sm"
            style={{ color: t.muted }}
          >
            Essa área é temporária. Nada aqui altera seus gastos reais.
          </p>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm" style={{ color: t.muted }}>
            Saldo simulado do mês
          </p>
          <h3 className="text-2xl font-bold mt-1">
            {formatBRL(simulatedBalance)}
          </h3>
        </Card>

        <Card>
          <p className="text-sm" style={{ color: t.muted }}>
            Pode gastar por dia
          </p>
          <h3 className="text-2xl font-bold mt-1">
            {formatBRL(simulatedDaily)}
          </h3>
        </Card>

        <Card>
          <p className="text-sm" style={{ color: t.muted }}>
            Renda consumida
          </p>
          <h3 className="text-2xl font-bold mt-1">
            {consumedPercent.toFixed(1)}%
          </h3>
        </Card>

        <Card>
          <p className="text-sm" style={{ color: t.muted }}>
            Gastos simulados
          </p>
          <h3 className="text-2xl font-bold mt-1">
            {formatBRL(totalSimulatedExpenses)}
          </h3>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-base">Adicionar gasto simulado</h3>
            <p className="text-sm mt-1" style={{ color: t.muted }}>
              Teste compras, contas ou planos antes de registrar de verdade.
            </p>
          </div>

          <form onSubmit={handleAddSimExpense} className="grid gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Descrição"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="rounded-2xl px-4 py-3 outline-none border"
              style={{
                background: t.card,
                color: t.text,
                borderColor: t.border,
              }}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Valor"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="rounded-2xl px-4 py-3 outline-none border"
              style={{
                background: t.card,
                color: t.text,
                borderColor: t.border,
              }}
            />

            <input
              type="text"
              placeholder="Categoria (opcional)"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="rounded-2xl px-4 py-3 outline-none border"
              style={{
                background: t.card,
                color: t.text,
                borderColor: t.border,
              }}
            />

            <div className="md:col-span-3 flex flex-wrap gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-2xl font-medium"
                style={{
                  background: t.accent,
                  color: "#fff",
                }}
              >
                Adicionar simulação
              </button>

              <button
                type="button"
                onClick={handleClearSimulation}
                className="px-4 py-2 rounded-2xl font-medium border"
                style={{
                  borderColor: t.border,
                  color: t.text,
                }}
              >
                Limpar tudo
              </button>
            </div>
          </form>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <h3 className="font-semibold text-base">Leitura da simulação</h3>
          <p className="text-sm" style={{ color: t.muted }}>
            {summaryMessage}
          </p>
          <p className="text-sm" style={{ color: t.muted }}>
            Gastos reais: {formatBRL(totalRealExpenses)} | Total com simulação:{" "}
            {formatBRL(totalWithSimulation)}
          </p>
        </div>
      </Card>

      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-base">Gastos simulados</h3>
            <span className="text-sm" style={{ color: t.muted }}>
              {simExpenses.length} item(ns)
            </span>
          </div>

          {simExpenses.length === 0 ? (
            <p className="text-sm" style={{ color: t.muted }}>
              Nenhum gasto simulado ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {simExpenses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3"
                  style={{
                    borderColor: t.border,
                    background: t.bgSecondary || t.card,
                  }}
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.description}</p>
                    <p className="text-sm" style={{ color: t.muted }}>
                      {item.category || "Sem categoria"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <strong>{formatBRL(item.amount)}</strong>
                    <button
                      onClick={() => handleRemoveSimExpense(item.id)}
                      className="px-3 py-1.5 rounded-xl border text-sm"
                      style={{
                        borderColor: t.border,
                        color: t.text,
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}