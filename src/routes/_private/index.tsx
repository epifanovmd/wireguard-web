import { EPermissions } from "@api/api-gen/data-contracts";
import { IAuthStore } from "@store";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.hasPermission(EPermissions.WgStatsView)) {
      if (
        auth.hasPermission(EPermissions.WgPeerView) ||
        auth.hasPermission(EPermissions.WgPeerOwn)
      ) {
        throw redirect({ to: "/wireguard/peers" });
      }

      if (
        auth.hasPermission(EPermissions.WgServerView) ||
        auth.hasPermission(EPermissions.WgServerOwn)
      ) {
        throw redirect({ to: "/wireguard/servers" });
      }

      throw redirect({ to: "/profile" });
    }
  },
});
