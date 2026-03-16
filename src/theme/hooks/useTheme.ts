import { useContext } from "react";

import { ThemeContext, ThemeContextValue } from "../ThemeContext";

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
