import { lightTheme } from "./lightTheme";

export type AppThemes = "light" | "dark";

export type AppTheme = typeof lightTheme;

export type ThemeStore = {
  themes: Record<AppThemes, AppTheme>;
  toggleTheme: () => void;
  theme: AppThemes;
};
