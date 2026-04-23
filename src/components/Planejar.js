import React, { useMemo, useState } from "react";
import Card from "./ui/Card";
import { useTheme } from "../context/theme";
import { formatBRL } from "../utils/formatters";

export default function Planejar() {
  const t = useTheme();

  const [simSalary, setSimSalary] = useState("");
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
  });
  const [simExpenses, setSimExpenses] = useState([]);
  const [err, setErr] = useState("");

  const now = new Date();
  const currentDay = now.getDate();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remDays = Math.max(totalDays - currentDay + 1, 1);

  const salaryValue = Number(String(simSalary).replace(",", ".")) || 0;

  const totalSimulatedExpenses = useMemo(() => {
    return simExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [simExpenses]);

  const simulatedBalance = salaryValue - totalSimulatedExpenses;
  const simulatedDaily = remDays > 0 ? simulatedBalance / remDays : simulatedBalance;
  const consumedPercent =
    salaryValue > 0 ? Math.min((totalSimulatedExpenses / salaryValue) * 100, 999) : 0;

  let summaryMessage = "Defina um salário e adicione gastos para montar sua simulação.";

  if (salaryValue > 0 && simExpenses.length === 0) {
    summaryMessage = "Agora adicione gastos simulados para ver o impacto no mês.";
  }

  if (salaryValue > 0 && simExpenses.length > 0) {
    summaryMessage =
      simulatedBalance >= 0
        ? "Seu planejamento ainda fecha no azul."
        : "Atenção: com essa simulação, o mês fecha no vermelho.";
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: `1px solid ${t.border}`,
    background: t.bgInput,
    color: t.text,
    fontSize: "16px",
    lineHeight: "1.2",
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
    WebkitAppearance: "none",
  };

  const addSimExpense = () => {
    const description = form.description.trim();
    const amount = Number(String(form.amount).replace(",", "."));
    const category = form.category.trim();

    if (!description || !amount || amount <= 0) {
      setErr("Preencha descrição e um valor válido.");
      return;
    }

    const newExpense = {
      id: String(Date.now()),
      description,
      amount,
      category,
    };

    setSimExpenses((prev) => [newExpense, ...prev]);
    setForm({
      description: "",
      amount: "",
      category: "",
    });
    setErr("");
  };

  const removeSimExpense = (id) => {
    setSimExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const clearSimulation = () => {
    setSimSalary("");
    setSimExpenses([]);
    setForm({
      description: "",
      amount: "",
      category: "",
    });
    setErr("");
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
            Planejar
          </h2>

          <p style={{ color: t.textSub, fontSize: "14px" }}>
            Monte uma simulação completa sem mexer nos dados reais
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
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: t.text,
              marginBottom: "14px",
            }}
          >
            Salário da simulação
          </h3>

          <input
            type="text"
            inputMode="decimal"
            value={simSalary}
            onChange={(e) => setSimSalary(e.target.value)}
            placeholder="Digite o salário da simulação"
            style={inputStyle}
          />
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
              marginBottom: "8px",
            }}
          >
            Leitura da simulação
          </p>

          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: simulatedBalance >= 0 ? t.positive : t.negative,
              marginBottom: "6px",
            }}
          >
            {summaryMessage}
          </p>

          <p style={{ fontSize: "13px", color: t.textSub, lineHeight: 1.5 }}>
            Salário: <strong>{formatBRL(salaryValue)}</strong> · Gastos simulados:{" "}
            <strong>{formatBRL(totalSimulatedExpenses)}</strong>
          </p>
        </Card>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <Card
            style={{
              padding: "14px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
              Saldo simulado
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: simulatedBalance >= 0 ? t.positive : t.negative,
              }}
            >
              {formatBRL(simulatedBalance)}
            </p>
          </Card>

          <Card
            style={{
              padding: "14px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
              Pode gastar por dia
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: simulatedDaily >= 0 ? t.accent : t.negative,
              }}
            >
              {formatBRL(simulatedDaily)}
            </p>
          </Card>

          <Card
            style={{
              padding: "14px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
              Renda consumida
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: consumedPercent >= 100 ? t.negative : t.warning,
              }}
            >
              {salaryValue > 0 ? `${consumedPercent.toFixed(1)}%` : "--"}
            </p>
          </Card>

          <Card
            style={{
              padding: "14px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
            }}
          >
            <p style={{ fontSize: "11px", color: t.textMuted, marginBottom: "6px" }}>
              Gastos simulados
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: t.text,
              }}
            >
              {formatBRL(totalSimulatedExpenses)}
            </p>
          </Card>
        </div>

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
            Novo gasto simulado
          </h3>

          <div style={{ display: "grid", gap: "12px" }}>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição"
              style={inputStyle}
            />

            <input
              type="text"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Valor (R$)"
              style={inputStyle}
            />

            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Categoria (opcional)"
              style={inputStyle}
            />

            {err ? (
              <p style={{ color: t.negative, fontSize: "12px", marginTop: "-4px" }}>
                {err}
              </p>
            ) : null}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <button
                onClick={addSimExpense}
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
                Adicionar
              </button>

              <button
                onClick={clearSimulation}
                style={{
                  width: "100%",
                  background: t.bgInput,
                  color: t.textSub,
                  border: `1px solid ${t.border}`,
                  borderRadius: "14px",
                  padding: "14px",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: "15px",
                }}
              >
                Limpar tudo
              </button>
            </div>
          </div>
        </Card>

        {simExpenses.length === 0 ? (
          <Card
            style={{
              padding: "22px",
              background: t.bgCard,
              border: `1px solid ${t.border}`,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "15px", color: t.text }}>
              Nenhum gasto simulado ainda.
            </p>
            <p style={{ fontSize: "13px", color: t.textSub, marginTop: "6px" }}>
              Adicione valores acima para testar cenários.
            </p>
          </Card>
        ) : (
          simExpenses.map((item) => (
            <Card
              key={item.id}
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
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: t.text,
                      marginBottom: "4px",
                    }}
                  >
                    {item.description}
                  </h3>
                  <p style={{ fontSize: "13px", color: t.textSub }}>
                    {item.category || "Sem categoria"}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: t.warning,
                      marginBottom: "8px",
                    }}
                  >
                    {formatBRL(item.amount)}
                  </p>

                  <button
                    onClick={() => removeSimExpense(item.id)}
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
                    Remover
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}