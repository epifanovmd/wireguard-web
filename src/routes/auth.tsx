import { IAuthStore } from "@store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React, { memo } from "react";

const Component = memo(() => <Outlet />);

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const auth = IAuthStore.getInstance();

    if (auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: Component,
});
