import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import MainApp from "./components/MainApp";

import { ThemeContext } from "./context/theme";
import { useStorage } from "./hooks/useStorage";
import { LIGHT_THEME, DARK_THEME } from "./theme/themes";
import { AVATARS } from "./config/appConfig";

export default function App() {
  const [users, setUsers] = useStorage("finchly_users");
  const [themeMode, setThemeMode] = useStorage("finchly_theme_mode");
  const [currentUser, setCurrentUser] = useState(null);

  const resolvedThemeMode = themeMode === "dark" ? "dark" : "light";
  const theme = resolvedThemeMode === "dark" ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    setThemeMode(resolvedThemeMode === "dark" ? "light" : "dark");
  };

  const handleUpdateUser = (patch) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...patch,
    };

    setCurrentUser(updatedUser);

    const currentUsers = users || {};
    setUsers({
      ...currentUsers,
      [updatedUser.id]: updatedUser,
    });
  };

  return (
    <ThemeContext.Provider value={theme}>
      {currentUser ? (
        <MainApp
          user={currentUser}
          onLogout={() => setCurrentUser(null)}
          onUpdateUser={handleUpdateUser}
          themeMode={resolvedThemeMode}
          toggleTheme={toggleTheme}
          theme={theme}
        />
      ) : (
        <LoginScreen
          onLogin={setCurrentUser}
          users={users}
          setUsers={setUsers}
          themeMode={resolvedThemeMode}
          toggleTheme={toggleTheme}
          theme={theme}
          avatars={AVATARS}
        />
      )}
    </ThemeContext.Provider>
  );
}