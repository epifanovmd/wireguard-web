import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { memo } from "react";

import { ConfirmModalProvider } from "~@components";

const Component = memo(() => {
  return (
    <ConfirmModalProvider>
      <Outlet />
    </ConfirmModalProvider>
  );
});

export const Route = createRootRoute({
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
