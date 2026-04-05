import React, { useState } from "react";

export default function LoginScreen({
  onLogin,
  users,
  setUsers,
  themeMode,
  toggleTheme,
  theme,
  avatars,
}) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");

  const existingUsers = users || {};

  const deleteUser = (id) => {
    const updatedUsers = { ...existingUsers };
    delete updatedUsers[id];
    setUsers(updatedUsers);

    try {
      localStorage.removeItem(`finchly_data_${id}`);
    } catch (error) {
      console.error("Erro ao remover dados do usuário:", error);
    }
  };

  const createUser = () => {
    if (!name.trim()) return;

    const id = "u_" + Date.now();
    const newUser = {
      id,
      name: name.trim(),
      avatar: selectedAvatar,
    };

    setUsers({
      ...existingUsers,
      [id]: newUser,
    });

    onLogin(newUser);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: theme.bgCard,
          borderRadius: "24px",
          padding: "24px",
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button
            onClick={toggleTheme}
            style={{
              background: theme.buttonBg,
              border: `1px solid ${theme.border}`,
              borderRadius: "12px",
              padding: "8px 10px",
              cursor: "pointer",
              color: theme.textSub,
              fontWeight: 700,
            }}
          >
            {themeMode === "light" ? "🌙 Escuro" : "☀️ Claro"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "20px",
              background: theme.accentSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              margin: "0 auto 12px",
            }}
          >
            🌿
          </div>

          <h1
            style={{
              fontSize: "28px",
              marginBottom: "6px",
              color: theme.text,
              fontWeight: 800,
            }}
          >
            Finchly
          </h1>

          <p style={{ color: theme.textSub, fontSize: "14px" }}>
            Escolha um perfil ou crie um novo
          </p>
        </div>

        <div style={{ marginBottom: "18px" }}>
          <p
            style={{
              fontSize: "11px",
              color: theme.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Perfis salvos
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {Object.values(existingUsers).length > 0 ? (
              Object.values(existingUsers).map((user) => (
                <div
                  key={user.id}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.bgCard,
                    borderRadius: "14px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    boxShadow: theme.shadowCard,
                  }}
                >
                  <button
                    onClick={() => onLogin(user)}
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "12px",
                        background: theme.accentSoft,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        flexShrink: 0,
                      }}
                    >
                      {user.avatar}
                    </div>

                    <div>
                      <p style={{ margin: 0, color: theme.text, fontWeight: 700 }}>{user.name}</p>
                      <p style={{ margin: 0, color: theme.textSub, fontSize: "12px" }}>
                        Entrar nesse perfil
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      border: `1px solid ${theme.negative}40`,
                      background: theme.negativeSoft,
                      color: theme.negative,
                      borderRadius: "10px",
                      padding: "8px 10px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    Excluir
                  </button>
                </div>
              ))
            ) : (
              <div
                style={{
                  border: `1px dashed ${theme.border}`,
                  borderRadius: "14px",
                  padding: "14px",
                  textAlign: "center",
                  color: theme.textSub,
                  fontSize: "13px",
                }}
              >
                Nenhum perfil criado ainda.
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: theme.bgInput,
            border: `1px solid ${theme.border}`,
            borderRadius: "18px",
            padding: "16px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: theme.textMuted,
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Novo perfil
          </p>

          <p style={{ fontSize: "13px", color: theme.textSub, marginBottom: "10px" }}>
            Escolha um avatar
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                style={{
                  border:
                    selectedAvatar === avatar
                      ? `2px solid ${theme.accent}`
                      : `1px solid ${theme.border}`,
                  background: selectedAvatar === avatar ? theme.accentSoft : theme.bgCard,
                  color: theme.text,
                  borderRadius: "12px",
                  height: "44px",
                  cursor: "pointer",
                  fontSize: "22px",
                }}
              >
                {avatar}
              </button>
            ))}
          </div>

          <input
            placeholder="Nome do novo usuário"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
              marginBottom: "12px",
              fontSize: "14px",
              background: theme.bgCard,
              color: theme.text,
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={createUser}
            style={{
              width: "100%",
              background: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Criar usuário
          </button>
        </div>
      </div>
    </div>
  );
}