import { useState } from "react";
import { useTheme } from "../context/theme";
import { formatBRL, formatPct } from "../utils/formatters";
import { calcProj } from "../utils/finance";
import { CDI_AA, INV_TYPES } from "../constants/finance";
import Card from "./ui/Card";
import Inp from "./ui/Inp";
import Btn from "./ui/Btn";

export default function Investments({ d, save }) {
  const t = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "cdi",
    principal: "",
    cdiPct: "100",
    customRate: "",
  });
  const [err, setErr] = useState("");

  const add = () => {
    if (!form.name.trim() || !form.principal) {
      return setErr("Preencha nome e valor.");
    }

    if (
      form.type === "cdi" &&
      (Number(form.cdiPct) < 80 || Number(form.cdiPct) > 110)
    ) {
      return setErr("CDI entre 80% e 110%.");
    }

    if (form.type !== "cdi" && !form.customRate) {
      return setErr("Informe a taxa anual.");
    }

    save({
      investments: [
        ...d.investments,
        {
          ...form,
          id: Date.now(),
          principal: Number(form.principal),
        },
      ],
    });

    setForm({
      name: "",
      type: "cdi",
      principal: "",
      cdiPct: "100",
      customRate: "",
    });
    setShowForm(false);
    setErr("");
  };

  const remove = (id) => {
    save({
      investments: d.investments.filter((inv) => inv.id !== id),
    });
  };

  const totalInv = d.investments.reduce(
    (sum, inv) => sum + Number(inv.principal),
    0
  );
  const totalMon = d.investments.reduce(
    (sum, inv) => sum + calcProj(inv).monthly,
    0
  );
  const totalYea = d.investments.reduce(
    (sum, inv) => sum + calcProj(inv).yearly,
    0
  );

  return (
    <div className="fade-up">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, color: t.text }}>
            Investimentos
          </h2>
          <p style={{ color: t.textSub, fontSize: "12px" }}>
            CDI atual:{" "}
            <span style={{ color: t.accentBlue, fontWeight: 700 }}>
              {CDI_AA}% a.a.
            </span>
          </p>
        </div>

        <button
          className="btn"
          onClick={() => setShowForm((v) => !v)}
          style={{
            background: showForm
              ? t.bgInput
              : `linear-gradient(135deg,${t.accentBlue},#2C5FA8)`,
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
        {[
          { label: "Investido", value: totalInv, color: t.accentBlue },
          { label: "Rend./mês", value: totalMon, color: t.positive },
          { label: "Rend./ano", value: totalYea, color: "#8E6DC8" },
        ].map((c) => (
          <Card key={c.label} style={{ padding: "11px 9px", textAlign: "center" }}>
            <p
              style={{
                fontSize: "9px",
                color: t.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
                fontWeight: 600,
              }}
            >
              {c.label}
            </p>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono'",
                color: c.color,
              }}
            >
              {formatBRL(c.value)}
            </p>
          </Card>
        ))}
      </div>

      {showForm && (
        <Card style={{ padding: "18px", marginBottom: "14px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: t.text,
              marginBottom: "12px",
            }}
          >
            Novo Investimento
          </h3>

          <Inp
            placeholder="Nome (ex: Tesouro Selic, XPML11...)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <Inp
            type="number"
            placeholder="Valor investido (R$)"
            value={form.principal}
            onChange={(e) =>
              setForm((f) => ({ ...f, principal: e.target.value }))
            }
          />

          <p
            style={{
              fontSize: "11px",
              color: t.textSub,
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Tipo de investimento
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              marginBottom: "11px",
            }}
          >
            {INV_TYPES.map((tp) => (
              <button
                key={tp.id}
                className="btn"
                onClick={() => setForm((f) => ({ ...f, type: tp.id }))}
                style={{
                  background: form.type === tp.id ? `${tp.color}15` : t.bgInput,
                  border:
                    form.type === tp.id
                      ? `1.5px solid ${tp.color}`
                      : `1.5px solid ${t.border}`,
                  borderRadius: "10px",
                  color: t.text,
                  padding: "9px 7px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 600,
                }}
              >
                <span style={{ fontSize: "15px" }}>{tp.icon}</span>
                {tp.label}
              </button>
            ))}
          </div>

          {form.type === "cdi" ? (
            <>
              <p style={{ fontSize: "11px", color: t.textSub, marginBottom: "5px" }}>
                Rendimento:{" "}
                <span style={{ color: t.accentBlue, fontWeight: 700 }}>
                  {form.cdiPct}% do CDI
                </span>{" "}
                ={" "}
                <span style={{ color: t.positive, fontWeight: 700 }}>
                  {((CDI_AA * Number(form.cdiPct)) / 100).toFixed(2)}% a.a.
                </span>
              </p>

              <input
                type="range"
                min="80"
                max="110"
                step="1"
                value={form.cdiPct}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cdiPct: e.target.value }))
                }
                style={{
                  width: "100%",
                  marginBottom: "3px",
                  accentColor: t.accentBlue,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: t.textMuted,
                  marginBottom: "10px",
                }}
              >
                <span>80%</span>
                <span>95%</span>
                <span>110%</span>
              </div>
            </>
          ) : (
            <Inp
              type="number"
              placeholder="Taxa de rendimento anual (%)"
              value={form.customRate}
              onChange={(e) =>
                setForm((f) => ({ ...f, customRate: e.target.value }))
              }
            />
          )}

          {err && (
            <p style={{ color: t.negative, fontSize: "12px", marginBottom: "8px" }}>
              {err}
            </p>
          )}

          <Btn variant="blue" onClick={add}>
            Adicionar investimento
          </Btn>
        </Card>
      )}

      {d.investments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "36px 20px", color: t.textMuted }}>
          <p style={{ fontSize: "34px", marginBottom: "8px" }}>🌱</p>
          <p style={{ fontSize: "13px" }}>Nenhum investimento registrado.</p>
        </div>
      ) : (
        d.investments.map((inv) => {
          const proj = calcProj(inv);
          const tp = INV_TYPES.find((x) => x.id === inv.type) || INV_TYPES[0];

          return (
            <Card
              key={inv.id}
              style={{
                padding: "15px",
                marginBottom: "8px",
                borderLeft: `3px solid ${tp.color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{tp.icon}</span>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: t.text }}>
                      {inv.name}
                    </p>
                  </div>
                  <p style={{ fontSize: "11px", color: t.textMuted }}>
                    {tp.label}
                    {inv.type === "cdi"
                      ? ` · ${inv.cdiPct}% CDI`
                      : ` · ${inv.customRate}% a.a.`}
                  </p>
                </div>

                <button
                  className="btn"
                  onClick={() => remove(inv.id)}
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "7px",
                }}
              >
                {[
                  { label: "Investido", value: inv.principal, color: t.text },
                  { label: "Rend./mês", value: proj.monthly, color: t.positive },
                  { label: "Rend./ano", value: proj.yearly, color: "#8E6DC8" },
                ].map((c) => (
                  <div
                    key={c.label}
                    style={{
                      background: t.bgInput,
                      borderRadius: "8px",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "9px",
                        color: t.textMuted,
                        marginBottom: "3px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      {c.label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: c.color,
                        fontFamily: "'JetBrains Mono'",
                      }}
                    >
                      {formatBRL(c.value)}
                    </p>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: "10px",
                  color: t.textMuted,
                  marginTop: "7px",
                  textAlign: "right",
                }}
              >
                {formatPct(proj.rateAA)} a.a. · {formatPct(proj.rateAM)} a.m.
              </p>
            </Card>
          );
        })
      )}
    </div>
  );
}