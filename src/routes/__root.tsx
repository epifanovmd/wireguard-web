import { IAuthStore } from "@store";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { NotFoundPage } from "../pages/not-found/NotFoundPage";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const auth = IAuthStore.getInstance();

    if (auth.isIdle) {
      await auth.restore();
    }
  },
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});
