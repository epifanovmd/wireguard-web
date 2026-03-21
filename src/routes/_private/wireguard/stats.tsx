import { createFileRoute, redirect } from "@tanstack/react-router";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { IAuthStore } from "~@store";

export const Route = createFileRoute("/_private/wireguard/stats")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.hasPermission(EPermissions.WgStatsView)) {
      throw redirect({ to: "/" });
    }
  },
});
