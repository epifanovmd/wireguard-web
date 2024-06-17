import { ColorTheme, ITheme, SpacingTheme } from "../types";

export const DEFAULT_DARK_COLOR_THEME: ColorTheme = {
  background: "#354259",
  barStyle: "light-content",
  text: "#fff",
  common: {
    black: "#000",
    white: "#fff",
  },
  primary: {
    main: "#1c3e94",
    light: "rgb(73, 100, 169)",
    dark: "rgb(19, 43, 103)",
    contrastText: "#fff",
  },
  secondary: {
    main: "#ee2e24",
    light: "rgb(241, 87, 79)",
    dark: "rgb(166, 32, 25)",
    contrastText: "#fff",
  },
  error: {
    light: "#e57373",
    main: "#f44336",
    dark: "#d32f2f",
    contrastText: "#fff",
  },
  warning: {
    light: "#ffb74d",
    main: "#ff9800",
    dark: "#f57c00",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  info: {
    light: "#64b5f6",
    main: "#2196f3",
    dark: "#1976d2",
    contrastText: "#fff",
  },
  success: {
    light: "#81c784",
    main: "#4caf50",
    dark: "#388e3c",
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  grey: {
    grey50: "#fafafa",
    grey100: "#f5f5f5",
    grey200: "#eeeeee",
    grey300: "#e0e0e0",
    grey400: "#bdbdbd",
    grey500: "#9e9e9e",
    grey600: "#757575",
    grey700: "#616161",
    grey800: "#424242",
    grey900: "#212121",
    greyA100: "#d5d5d5",
    greyA200: "#aaaaaa",
    greyA400: "#303030",
    greyA700: "#616161",
  },
};
export const DEFAULT_DARK_SPACING_THEME: SpacingTheme = {
  base: 8,
  double: 16,
};

export const DEFAULT_DARK_THEME_ID = "default-dark";
export const DEFAULT_DARK_THEME: ITheme = {
  id: DEFAULT_DARK_THEME_ID,
  color: DEFAULT_DARK_COLOR_THEME,
  spacing: DEFAULT_DARK_SPACING_THEME,
};
