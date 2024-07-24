import { Header } from "@components";
import { ISessionDataStore } from "@store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React, { memo } from "react";

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
    const { isAuthorized, restore } = ISessionDataStore.getInstance();

    if (!isAuthorized) {
      throw redirect({ to: "/auth" });
    }
  },
  component: Component,
});
