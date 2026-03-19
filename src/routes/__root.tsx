import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import React, { memo } from "react";

import { IAuthStore } from "~@store";

const Component = memo(() => {
  return <Outlet />;
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const auth = IAuthStore.getInstance();

    if (!auth.isAuthenticated) {
      await auth.restore();

      if (!auth.isAuthenticated) {
        throw redirect({ to: "/auth/signIn" });
      }
    }
  },
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
