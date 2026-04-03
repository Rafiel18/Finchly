export const todayStr = () => new Date().toISOString().split("T")[0];

export const daysInMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

export const dayOfMonth = () => new Date().getDate();
