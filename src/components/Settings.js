import React from "react";

export default function Settings({ user }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "18px",
          border: "1px solid #ececec",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          textAlign: "center",
          minWidth: "260px",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#1f2937" }}>Configurações</h2>
        <p style={{ color: "#6b7280", marginBottom: "8px" }}>
          Tela mínima em teste
        </p>
        <p style={{ color: "#1f2937", fontWeight: "bold" }}>
          Usuário: {user?.name || "Sem nome"}
        </p>
      </div>
    </div>
  );
}