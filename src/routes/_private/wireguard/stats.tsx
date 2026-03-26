import { IAuthStore } from "@store";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/wireguard/stats")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.isAdmin) {
      throw redirect({ to: "/" });
    }
  },
});
