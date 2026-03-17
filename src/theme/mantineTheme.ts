import {
  createTheme,
  CSSVariablesResolver,
  MantineColorsTuple,
  rem,
} from "@mantine/core";

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    "--mantine-color-anchor": "#6366f1",
    "--mantine-cursor-type": "pointer",
  },
  light: {
    "--sc-color": "var(--mantine-color-gray-0)",

    "--mantine-color-gray-0": "#dce6f2",
    "--mantine-color-gray-1": "#cfd9eb",
    "--mantine-color-gray-2": "#c2d0e4",
    "--mantine-color-gray-3": "#adbdd6",
    "--mantine-color-gray-4": "#8fa8c8",
    "--mantine-color-gray-5": "#7090b4",
    "--mantine-color-gray-6": "#5478a0",
    "--mantine-color-gray-7": "#3a5a7d",
    "--mantine-color-gray-8": "#243f5e",
    "--mantine-color-gray-9": "#0f172a",
  },
  dark: {
    "--sc-color": "var(--mantine-color-dark-7)",

    "--mantine-color-dark-0": "var(--foreground)",
    "--mantine-color-dark-1": "var(--muted-foreground)",
    "--mantine-color-dark-2": "var(--muted-foreground)",
    "--mantine-color-dark-3": "var(--surface-3)",
    "--mantine-color-dark-4": "var(--border)",
    "--mantine-color-dark-5": "var(--surface-3)",
    "--mantine-color-dark-6": "var(--surface-2)",
    "--mantine-color-dark-7": "var(--card)",
    "--mantine-color-dark-8": "var(--background)",
    "--mantine-color-dark-9": "var(--sidebar)",
  },
});

export const mantineTheme = createTheme({
  defaultRadius: "md",
});
