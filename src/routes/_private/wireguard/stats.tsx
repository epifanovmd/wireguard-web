import { createFileRoute, redirect } from "@tanstack/react-router";

import { IAuthStore } from "~@store";

export const Route = createFileRoute("/_private/wireguard/stats")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.isAdmin) {
      throw redirect({ to: "/" });
    }
  },
});
