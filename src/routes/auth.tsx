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
    const session = ISessionDataStore.getInstance();

    const isSignUp = ctx.location.pathname.includes("signUp");

    if (!isSignUp) {
      if (!session.isAuthorized) {
        await session.restore();

        if (session.isAuthorized) {
          throw redirect({ to: "/" });
        }
      } else {
        throw redirect({ to: "/" });
      }
    }
  },
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
