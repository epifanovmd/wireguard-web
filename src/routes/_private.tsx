import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React, { memo } from "react";

import { Header } from "~@components";
import { ISessionDataStore } from "~@store";

const Component = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
});

export const Route = createFileRoute("/_private")({
  beforeLoad: async () => {
    const session = ISessionDataStore.getInstance();

    if (!session.isAuthorized) {
      await session.restore();

      if (!session.isAuthorized) {
        throw redirect({ to: "/auth/signIn" });
      }
    }
  },
  component: Component,
});
