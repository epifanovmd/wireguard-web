import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React, { memo } from "react";

import { AppLayout } from "~@components/layouts";
import { IAuthStore } from "~@store";

const Component = memo(() => (
  <AppLayout>
    <Outlet />
  </AppLayout>
));

export const Route = createFileRoute("/_private")({
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
});
