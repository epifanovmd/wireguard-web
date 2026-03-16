import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";

import { cssVariablesResolver, mantineTheme } from "./mantineTheme";
import { ThemeContext, ThemeMode } from "./ThemeContext";

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem("theme") as ThemeMode | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        isLight: theme === "light",
        setTheme,
        toggleTheme,
      }}
    >
      <MantineProvider
        theme={mantineTheme}
        cssVariablesResolver={cssVariablesResolver}
        forceColorScheme={theme}
      >
        <Notifications position="bottom-right" zIndex={9999} />
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};
