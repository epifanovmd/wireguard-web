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
    const { isReady, isAuthorized, restore } = ISessionDataStore.getInstance();

    if (!isReady) {
      const accessToken = await restore();

      if (!accessToken) {
        throw redirect({ to: "/auth/login" });
      }
    } else if (!isAuthorized) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: Component,
});
