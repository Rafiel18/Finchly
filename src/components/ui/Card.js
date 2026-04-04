import { useTheme } from "../../context/theme";

export default function Card({ children, style = {}, onClick }) {
  const t = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: "16px",
        boxShadow: t.shadowCard,
        ...style,
      }}
    >
      {children}
    </div>
  );
}