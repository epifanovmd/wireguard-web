import React from "react";

import { IThemeContext } from "./types";
import { DEFAULT_LIGHT_THEME } from "./variants";

export const ThemeContext = React.createContext<IThemeContext>({
  theme: DEFAULT_LIGHT_THEME,
  toggleTheme: () => {
    console.error("ThemeProvider is not rendered!");
  },
  isDark: false,
  isLight: true,
});
