import { daysInMonth, dayOfMonth } from "./date";

export function getDashboardSummary(data) {
  const salary = Number(data?.salary) || 0;

  const totalExp = (data?.expenses || []).reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const balance = salary - totalExp;
  const remDays = daysInMonth() - dayOfMonth() + 1;
  const daily = remDays > 0 ? balance / remDays : 0;

  return {
    salary,
    totalExp,
    balance,
    remDays,
    daily,
  };
}
