import { ModalProvider, TooltipProvider } from "@components/ui";
import { ToastProvider } from "@core/notifications";
import { ThemeProvider } from "@core/theme";
import { disposer } from "@di";
import { useAppDataStore } from "@store";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";

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
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <ModalProvider>
            <RouterProvider router={router} />
          </ModalProvider>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};
