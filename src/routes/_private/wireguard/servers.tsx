import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { IAuthStore } from "~@store";

export const Route = createFileRoute("/_private/wireguard/servers")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.hasPermission(EPermissions.WgServerView)) {
      throw redirect({ to: "/wireguard/peers" });
    }
  },
  component: () => <Outlet />,
});
