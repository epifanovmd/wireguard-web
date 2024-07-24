import { Container } from "@components";
import { ISessionDataStore } from "@store";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import React from "react";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { isReady, restore } = ISessionDataStore.getInstance();

    if (!isReady) {
      return await restore().then(async accessToken => {
        if (!accessToken) {
          throw redirect({ to: "/auth" });
        }
      });
    }
  },
  component: () => (
    <Container>
      <Outlet />
    </Container>
  ),
});
