import { defaultData } from "./finance";

export function createInitialData() {
  const base = defaultData();

  return {
    ...base,
    salary: 2500,
    expenses: [
      { id: 1, description: "Mercado", category: "Casa", date: "04/04/2026", amount: 250 },
      { id: 2, description: "Gasolina", category: "Transporte", date: "04/04/2026", amount: 180 },
      { id: 3, description: "Lanche", category: "Alimentação", date: "04/04/2026", amount: 35 },
    ],
    investments: [
      { id: 1, principal: 500 },
      { id: 2, principal: 300 },
    ],
    debts: [
      {
        id: 1,
        description: "Cartão Nubank",
        creditor: "Nubank",
        totalAmount: 1200,
        installmentValue: 200,
        totalInstallments: 6,
        remainingInstallments: 4,
        dueDay: 10,
      },
    ],
  };
}