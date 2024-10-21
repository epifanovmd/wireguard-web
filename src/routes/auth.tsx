import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";

import { ISessionDataStore } from "~@store";

const Component = observer(() => {
  return (
    <>
      <Outlet />
    </>
  );
});

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const { isReady, isAuthorized, restore } = ISessionDataStore.getInstance();

    if (!isReady) {
      const accessToken = await restore();

      if (accessToken) {
        throw redirect({ to: "/" });
      }
    } else if (isAuthorized) {
      throw redirect({ to: "/" });
    }
  },
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
