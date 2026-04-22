import { useTheme } from "../../context/theme";

export default function Inp({
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  inputMode,
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
      inputMode={inputMode}
      style={{
        width: "100%",
        background: t.bgInput,
        border: `1.5px solid ${t.borderInput}`,
        borderRadius: "12px",
        padding: "13px 14px",
        color: t.text,
        fontSize: "16px",
        lineHeight: "1.2",
        marginBottom: "9px",
        boxSizing: "border-box",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        ...style,
      }}
    />
  );
}