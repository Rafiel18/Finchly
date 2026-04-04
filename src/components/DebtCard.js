import { useTheme } from "../context/theme";
import Card from "./ui/Card";
import { formatBRL } from "../utils/formatters";

export default function DebtCard({
  dbt,
  editId,
  editVal,
  setEditId,
  setEditVal,
  onUpdate,
  onRemove,
}) {
  const t = useTheme();
  const rem = Number(dbt.remainingInstallments);
  const total = Number(dbt.totalInstallments);
  const paid = total - rem;
  const pct = total > 0 ? (paid / total) * 100 : 0;
  const isDone = rem <= 0;
  const remValue = Number(dbt.installmentValue) * rem;

  return (
    <Card style={{ padding: "15px", marginBottom: "8px", opacity: isDone ? 0.6 : 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: t.text,
              marginBottom: "2px",
              textDecoration: isDone ? "line-through" : "none",
            }}
          >
            {dbt.description}
          </p>
          {dbt.creditor && (
            <p style={{ fontSize: "11px", color: t.textMuted }}>
              {dbt.creditor}
              {dbt.dueDay ? ` · Vence dia ${dbt.dueDay}` : ""}
            </p>
          )}
        </div>

        <button
          className="btn"
          onClick={() => onRemove(dbt.id)}
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

      <div style={{ background: t.bgInput, borderRadius: "5px", height: "6px", marginBottom: "9px" }}>
        <div
          style={{
            height: "6px",
            borderRadius: "5px",
            width: `${pct}%`,
            background: isDone ? t.positive : `linear-gradient(90deg,${t.negative},${t.warning})`,
            transition: "width .5s",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "14px", fontSize: "11px", color: t.textSub, flexWrap: "wrap" }}>
        <span>
          Parcela: <b style={{ color: t.text }}>{formatBRL(dbt.installmentValue)}</b>
        </span>
        <span>
          Pagas: <b style={{ color: t.positive }}>{paid}/{total}</b>
        </span>
        <span>
          Restam: <b style={{ color: isDone ? t.positive : t.negative }}>{formatBRL(remValue)}</b>
        </span>
      </div>

      {!isDone && (
        <div style={{ marginTop: "10px" }}>
          {editId === dbt.id ? (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="number"
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                placeholder={`Restam (atual: ${rem})`}
                style={{
                  flex: 1,
                  background: t.bgInput,
                  border: `1.5px solid ${t.borderInput}`,
                  borderRadius: "9px",
                  padding: "8px 11px",
                  color: t.text,
                  fontSize: "12px",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  outline: "none",
                }}
              />
              <button
                className="btn"
                onClick={() => onUpdate(dbt.id)}
                style={{
                  background: `linear-gradient(135deg,${t.positive},#1E6640)`,
                  color: "#fff",
                  padding: "8px 13px",
                  borderRadius: "9px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                Salvar
              </button>
              <button
                className="btn"
                onClick={() => setEditId(null)}
                style={{
                  background: t.bgInput,
                  color: t.textSub,
                  padding: "8px 11px",
                  borderRadius: "9px",
                  fontSize: "12px",
                  border: `1px solid ${t.border}`,
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className="btn"
              onClick={() => {
                setEditId(dbt.id);
                setEditVal(String(rem));
              }}
              style={{
                background: t.bgInput,
                color: t.textSub,
                padding: "8px 13px",
                borderRadius: "9px",
                fontSize: "12px",
                border: `1px solid ${t.border}`,
                width: "100%",
                fontWeight: 600,
              }}
            >
              ✏️ Atualizar parcelas restantes
            </button>
          )}
        </div>
      )}
    </Card>
  );
}