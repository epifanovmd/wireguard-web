import { createRootRoute, Outlet } from "@tanstack/react-router";

import { IAuthStore } from "~@store";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const auth = IAuthStore.getInstance();

    if (auth.isIdle) {
      await auth.restore();
    }
  },
  component: () => {
    return <Outlet />;
  },
});
