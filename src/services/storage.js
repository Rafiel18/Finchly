const USERS_KEY = "finchly_users";

export function createDefaultUserData() {
  return {
    profile: {
      name: "",
      avatar: "🐦",
    },
    expenses: [],
    debts: [],
    investments: [],
    goals: [],
    settings: {
      theme: "light",
      currency: "BRL",
    },
  };
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error("Erro ao fazer parse do JSON:", error);
    return fallback;
  }
}

export function getUsers() {
  return safeParse(localStorage.getItem(USERS_KEY), []);
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("Erro ao salvar usuários:", error);
    return false;
  }
}

export function getUserDataKey(userId) {
  return `finchly_data_${userId}`;
}

export function getUserData(userId) {
  if (!userId) return createDefaultUserData();

  const key = getUserDataKey(userId);
  const savedData = safeParse(localStorage.getItem(key), null);

  if (!savedData) {
    return createDefaultUserData();
  }

  return {
    ...createDefaultUserData(),
    ...savedData,
    profile: {
      ...createDefaultUserData().profile,
      ...savedData.profile,
    },
    settings: {
      ...createDefaultUserData().settings,
      ...savedData.settings,
    },
  };
}

export function saveUserData(userId, data) {
  if (!userId) return false;

  try {
    const key = getUserDataKey(userId);
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Erro ao salvar dados do usuário:", error);
    return false;
  }
}

export function clearUserData(userId) {
  if (!userId) return false;

  try {
    localStorage.removeItem(getUserDataKey(userId));
    return true;
  } catch (error) {
    console.error("Erro ao limpar dados do usuário:", error);
    return false;
  }
}