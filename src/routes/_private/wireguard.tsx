import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { IAuthStore } from "~@store";

// Все WireGuard-права (хотя бы одно должно быть)
const WG_PERMISSIONS = [
  EPermissions.WgServerView,
  EPermissions.WgServerManage,
  EPermissions.WgServerControl,
  EPermissions.WgPeerView,
  EPermissions.WgPeerManage,
  EPermissions.WgPeerOwn,
  EPermissions.WgStatsView,
  EPermissions.WgStatsExport,
];

export const Route = createFileRoute("/_private/wireguard")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    // Admin bypass или хотя бы одно WG-право
    const hasAny =
      auth.isAdmin ||
      WG_PERMISSIONS.some(p => auth.hasPermission(p));

    if (!hasAny) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <Outlet />,
});
