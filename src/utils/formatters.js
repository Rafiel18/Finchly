export const formatBRL = (v) =>
  Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export const formatPct = (v) =>
  Number(v).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + "%";
  