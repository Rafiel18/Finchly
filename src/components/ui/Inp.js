import { useTheme } from "../../context/theme";

export default function Inp({
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  style = {},
}) {
  const t = useTheme();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={{
        width: "100%",
        background: t.bgInput,
        border: `1.5px solid ${t.borderInput}`,
        borderRadius: "12px",
        padding: "11px 14px",
        color: t.text,
        fontSize: "14px",
        marginBottom: "9px",
        ...style,
      }}
    />
  );
}