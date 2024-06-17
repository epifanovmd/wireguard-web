import {
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_COLOR_THEME,
  DEFAULT_LIGHT_SPACING_THEME,
  DEFAULT_LIGHT_THEME_ID,
} from "./variants";

export type ColorTheme = typeof DEFAULT_LIGHT_COLOR_THEME;

export type SpacingTheme = typeof DEFAULT_LIGHT_SPACING_THEME & {};

export interface IThemeContext {
  theme: ITheme;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

export interface ITheme {
  id: typeof DEFAULT_LIGHT_THEME_ID | typeof DEFAULT_DARK_THEME_ID;
  color: ColorTheme;
  spacing: SpacingTheme;
}
