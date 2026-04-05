export function sumBy(list = [], field = "amount") {
  return list.reduce((total, item) => total + Number(item[field] || 0), 0);
}

export function getTotalExpenses(expenses = []) {
  return sumBy(expenses, "amount");
}

export function getTotalDebts(debts = []) {
  return sumBy(debts, "amount");
}

export function getTotalInvestments(investments = []) {
  return sumBy(investments, "amount");
}

export function getDashboardSummary(data) {
  const expenses = data?.expenses || [];
  const debts = data?.debts || [];
  const investments = data?.investments || [];

  const totalExpenses = getTotalExpenses(expenses);
  const totalDebts = getTotalDebts(debts);
  const totalInvestments = getTotalInvestments(investments);

  return {
    totalExpenses,
    totalDebts,
    totalInvestments,
    balanceSnapshot: totalInvestments - totalDebts - totalExpenses,
  };
}