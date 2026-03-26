import { EPermissions } from "@api/api-gen/data-contracts";
import { IAuthStore } from "@store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/users")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.hasPermission(EPermissions.UserView)) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <Outlet />,
});
