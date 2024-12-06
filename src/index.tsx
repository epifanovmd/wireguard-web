import "./index.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Spin } from "antd";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "~@theme";

import { initLocalization } from "./localization";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const lang = localStorage.getItem("i18nextLng");

initLocalization({ initLang: lang ?? undefined }).finally();

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingMinMs: 300,
  defaultPendingMs: 100,
  defaultPendingComponent: () => <Spin spinning={true} fullscreen />,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
