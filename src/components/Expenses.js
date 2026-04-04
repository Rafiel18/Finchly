import { useState } from "react";
import { useTheme } from "../context/theme";
import { todayStr } from "../utils/date";
import { formatBRL } from "../utils/formatters";
import { CATS, CHART_COLORS } from "../constants/finance";
import Card from "./ui/Card";
import Inp from "./ui/Inp";
import Btn from "./ui/Btn";

function BarChart({ data }) {
  const t = useTheme();
  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.map((d, i) => (
        <div key={i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontSize: "12px", color: t.textSub, fontWeight: 500 }}>
              {d.name}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'JetBrains Mono'",
                color: d.color,
                fontWeight: 600,
              }}
            >
              {formatBRL(d.value)}
            </span>
          </div>

          <div style={{ background: t.bgInput, borderRadius: "6px", height: "8px" }}>
            <div
              style={{
                height: "8px",
                borderRadius: "6px",
                width: `${(d.value / max) * 100}%`,
                background: d.color,
                transition: "width .6s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }) {
  const t = useTheme();
  if (!data.length) return null;

  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const r = 58;
  const cx = 75;
  const cy = 65;

  const slices = data.map((d) => {
    const pct = d.value / total;
    const start = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const end = cumulative * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);

    return {
      ...d,
      path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${pct > 0.5 ? 1 : 0},1 ${x2},${y2} Z`,
      pct,
    };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
      <svg width="150" height="130" viewBox="0 0 150 130">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke={t.bgCard} strokeWidth="2" />
        ))}
        <circle cx={cx} cy={cy} r="26" fill={t.bgCard} />
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "11px", color: t.textSub, flex: 1 }}>{s.name}</span>
            <span style={{ fontSize: "11px", color: t.textMuted }}>
              {Math.round(s.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Expenses({ d, save }) {
  const t = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: CATS[0],
    date: todayStr(),
  });
  const [filter, setFilter] = useState("todos");
  const [showChart, setShowChart] = useState(false);
  const [err, setErr] = useState("");

  const add = () => {
    if (!form.description.trim() || !form.amount) {
      return setErr("Preencha todos os campos.");
    }

    save({
      expenses: [...d.expenses, { ...form, id: Date.now(), amount: Number(form.amount) }],
    });

    setForm({
      description: "",
      amount: "",
      category: CATS[0],
      date: todayStr(),
    });
    setShowForm(false);
    setErr("");
  };

  const remove = (id) => {
    save({ expenses: d.expenses.filter((e) => e.id !== id) });
  };

  const months = [...new Set(d.expenses.map((e) => e.date.slice(0, 7)))].sort().reverse();
  const filtered =
    filter === "todos" ? d.expenses : d.expenses.filter((e) => e.date.startsWith(filter));
  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  const chartData = CATS.map((cat, i) => ({
    name: cat.replace(/^\S+\s/, ""),
    value: filtered
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + Number(e.amount), 0),
    color: CHART_COLORS[i],
  }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="fade-up">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, color: t.text }}>Gastos</h2>
          <p style={{ color: t.textSub, fontSize: "12px" }}>
            Total:{" "}
            <span
              style={{
                color: t.warning,
                fontFamily: "'JetBrains Mono'",
                fontWeight: 700,
              }}
            >
              {formatBRL(total)}
            </span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "7px" }}>
          <button
            className="btn"
            onClick={() => setShowChart((v) => !v)}
            style={{
              background: showChart ? t.accentSoft : t.bgInput,
              color: showChart ? t.accent : t.textSub,
              padding: "8px 11px",
              borderRadius: "10px",
              fontSize: "15px",
              border: `1px solid ${showChart ? t.accent : t.border}`,
            }}
          >
            {showChart ? "📋" : "📊"}
          </button>

          <button
            className="btn"
            onClick={() => setShowForm((v) => !v)}
            style={{
              background: showForm
                ? t.bgInput
                : `linear-gradient(135deg,${t.accent},#2D6E4A)`,
              color: showForm ? t.textSub : "#fff",
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              border: showForm ? `1px solid ${t.border}` : "none",
            }}
          >
            {showForm ? "Cancelar" : "+ Novo"}
          </button>
        </div>
      </div>

      {showForm && (
        <Card style={{ padding: "18px", marginBottom: "15px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: t.text,
              marginBottom: "13px",
            }}
          >
            Novo Gasto
          </h3>

          <Inp
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />

          <Inp
            type="number"
            placeholder="Valor (R$)"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />

          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            style={{
              width: "100%",
              background: t.bgInput,
              border: `1.5px solid ${t.borderInput}`,
              borderRadius: "12px",
              padding: "11px 14px",
              color: t.text,
              fontSize: "14px",
              marginBottom: "9px",
            }}
          >
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Inp
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />

          {err && (
            <p style={{ color: t.negative, fontSize: "12px", marginBottom: "8px" }}>{err}</p>
          )}

          <Btn onClick={add}>Adicionar gasto</Btn>
        </Card>
      )}

      {months.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            paddingBottom: "4px",
            marginBottom: "14px",
          }}
        >
          {["todos", ...months].map((m) => (
            <button
              key={m}
              className="btn"
              onClick={() => setFilter(m)}
              style={{
                background: filter === m ? t.accent : t.bgCard,
                color: filter === m ? "#fff" : t.textSub,
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "11px",
                whiteSpace: "nowrap",
                border: `1px solid ${filter === m ? t.accent : t.border}`,
                fontWeight: 600,
              }}
            >
              {m === "todos"
                ? "Todos"
                : new Date(m + "-01").toLocaleDateString("pt-BR", {
                    month: "short",
                    year: "2-digit",
                  })}
            </button>
          ))}
        </div>
      )}

      {showChart && (
        <Card style={{ padding: "18px", marginBottom: "14px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: t.text, marginBottom: "14px" }}>
            Por Categoria
          </p>

          {chartData.length === 0 ? (
            <p style={{ color: t.textMuted, fontSize: "13px", textAlign: "center", padding: "14px 0" }}>
              Adicione gastos para ver o gráfico.
            </p>
          ) : (
            <>
              <BarChart data={chartData} />
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${t.border}` }}>
                <PieChart data={chartData} />
              </div>
            </>
          )}
        </Card>
      )}

      {!showChart &&
        (filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 20px", color: t.textMuted }}>
            <p style={{ fontSize: "34px", marginBottom: "8px" }}>🧾</p>
            <p style={{ fontSize: "13px" }}>Nenhum gasto registrado.</p>
          </div>
        ) : (
          filtered
            .slice()
            .reverse()
            .map((e) => (
              <Card
                key={e.id}
                style={{
                  padding: "12px 14px",
                  marginBottom: "7px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: t.text, marginBottom: "2px" }}>
                    {e.description}
                  </p>
                  <p style={{ fontSize: "11px", color: t.textMuted }}>
                    {e.category} · {e.date}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: t.warning,
                      fontFamily: "'JetBrains Mono'",
                    }}
                  >
                    {formatBRL(e.amount)}
                  </p>

                  <button
                    className="btn"
                    onClick={() => remove(e.id)}
                    style={{
                      background: t.negativeSoft,
                      color: t.negative,
                      width: "26px",
                      height: "26px",
                      borderRadius: "7px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      border: `1px solid ${t.negative}30`,
                    }}
                  >
                    ×
                  </button>
                </div>
              </Card>
            ))
        ))}
    </div>
  );
}