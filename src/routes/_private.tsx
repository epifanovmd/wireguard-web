import { AppLayout } from "@components/layouts";
import { ErrorBoundary } from "@components/ui";
import { IAuthStore } from "@store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_private")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.isAuthenticated) {
      throw redirect({ to: "/auth/signIn" });
    }
  },
  component: () => (
    <AppLayout>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </AppLayout>
  ),
});
