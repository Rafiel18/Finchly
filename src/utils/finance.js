import { CDI_AA } from "../constants/finance";

export const defaultData = () => ({
  salary: "",
  expenses: [],
  debts: [],
  investments: [],
});

export function calcProj(inv) {
  const p = Number(inv.principal) || 0;

  if (!p) {
    return { monthly: 0, yearly: 0, rateAA: 0, rateAM: 0 };
  }

  const rateAA =
    inv.type === "cdi"
      ? CDI_AA * (Number(inv.cdiPct) / 100)
      : Number(inv.customRate) || 0;

  const rateAM = (Math.pow(1 + rateAA / 100, 1 / 12) - 1) * 100;

  return {
    monthly: p * (rateAM / 100),
    yearly: p * (rateAA / 100),
    rateAA,
    rateAM,
  };
}
