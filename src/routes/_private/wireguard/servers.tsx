import { EPermissions } from "@api/api-gen/data-contracts";
import { IAuthStore } from "@store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/wireguard/servers")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (
      !auth.hasPermission(EPermissions.WgServerView) &&
      !auth.hasPermission(EPermissions.WgServerOwn)
    ) {
      throw redirect({ to: "/wireguard/peers" });
    }
  },
  component: () => <Outlet />,
});
