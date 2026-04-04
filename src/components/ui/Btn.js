import { useTheme } from "../../context/theme";

export default function Btn({ children, onClick, variant = "primary", style = {} }) {
  const t = useTheme();

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${t.accent}, #2D6E4A)`,
      color: "#fff",
    },
    secondary: {
      background: t.bgInput,
      color: t.textSub,
      border: `1px solid ${t.border}`,
    },
    danger: {
      background: `linear-gradient(135deg, #E05A4A, #C0392B)`,
      color: "#fff",
    },
    blue: {
      background: `linear-gradient(135deg, ${t.accentBlue}, #2C5FA8)`,
      color: "#fff",
    },
    ghost: {
      background: "transparent",
      color: t.textSub,
      border: `1px solid ${t.border}`,
    },
  };

  return (
    <button
      className="btn"
      onClick={onClick}
      style={{
        ...variants[variant],
        padding: "12px 18px",
        borderRadius: "12px",
        fontSize: "14px",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </button>
  );
}