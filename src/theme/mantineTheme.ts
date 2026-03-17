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

    "--mantine-color-dark-0": "var(--text-primary)",
    "--mantine-color-dark-1": "var(--text-secondary)",
    "--mantine-color-dark-2": "var(--text-muted)",
    "--mantine-color-dark-3": "var(--border-color-2)",
    "--mantine-color-dark-4": "var(--border-color)",
    "--mantine-color-dark-5": "var(--bg-surface-3)",
    "--mantine-color-dark-6": "var(--bg-surface-2)",
    "--mantine-color-dark-7": "var(--bg-surface)",
    "--mantine-color-dark-8": "var(--bg-base)",
    "--mantine-color-dark-9": "var(--bg-sidebar)",
  },
});

export const mantineTheme = createTheme({
  defaultRadius: "md",
});
