import "./styles/index.scss";
import "./styles/tailwind.css";

import { disposer } from "@force-dev/utils";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";

import { useAppDataStore } from "~@store";
import { ThemeProvider } from "~@theme";

import { router } from "./router";

export const App = () => {
  const { initialize } = useAppDataStore();

  useEffect(() => {
    const dispose = initialize();
    return () => {
      disposer(dispose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  );
};
