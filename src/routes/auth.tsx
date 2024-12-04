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
  beforeLoad: async ctx => {
    const { isReady, isAuthorized, restore } = ISessionDataStore.getInstance();

    const isSignUp = ctx.location.pathname.includes("signUp");

    if (!isSignUp) {
      if (!isReady) {
        const accessToken = await restore();

        if (accessToken) {
          throw redirect({ to: "/" });
        }
      } else if (isAuthorized) {
        throw redirect({ to: "/" });
      }
    }
  },
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
