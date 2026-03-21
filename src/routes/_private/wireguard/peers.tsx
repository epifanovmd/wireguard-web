import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { IAuthStore } from "~@store";

export const Route = createFileRoute("/_private/wireguard/peers")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    // Доступ если есть право просматривать ВСЕ пиры или только свои
    const canView =
      auth.hasPermission(EPermissions.WgPeerView) ||
      auth.hasPermission(EPermissions.WgPeerOwn);

    if (!canView) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <Outlet />,
});
