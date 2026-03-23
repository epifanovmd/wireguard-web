import { createFileRoute, redirect } from "@tanstack/react-router";

import { IAuthStore } from "~@store";

export const Route = createFileRoute("/_private/users/$userId")({
  beforeLoad: ({ params }) => {
    const auth = IAuthStore.getInstance();

    if (params.userId === auth.user?.id) {
      throw redirect({ to: "/profile" });
    }
  },
});
