import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React, { memo } from "react";

import { ISessionDataStore } from "~@store";

const Component = memo(() => <Outlet />);

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const session = ISessionDataStore.getInstance();
    if (session.isAuthorized) {
      throw redirect({ to: "/" });
    }
  },
  component: Component,
});
