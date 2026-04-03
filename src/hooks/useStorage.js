import { useState } from "react";

export function useStorage(key) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const save = (v) => {
    setVal(v);
    localStorage.setItem(key, JSON.stringify(v));
  };

  return [val, save];
}