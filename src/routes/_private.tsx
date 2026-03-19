import { createFileRoute, Outlet } from "@tanstack/react-router";
import React from "react";

import { AppLayout } from "~@components/layouts";

export const Route = createFileRoute("/_private")({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
