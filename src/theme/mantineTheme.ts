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
  light: {},
  dark: {
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
    "--mantine-color-gray-0": "#f8f9fa",
    "--mantine-color-gray-1": "#f1f3f5",
    "--mantine-color-gray-2": "#e9ecef",
    "--mantine-color-gray-3": "#dee2e6",
    "--mantine-color-gray-4": "#ced4da",
    "--mantine-color-gray-5": "#adb5bd",
    "--mantine-color-gray-6": "#868e96",
    "--mantine-color-gray-7": "#495057",
    "--mantine-color-gray-8": "#343a40",
    "--mantine-color-gray-9": "#212529",
  },
});

export const mantineTheme = createTheme({
  defaultRadius: "md",
});
