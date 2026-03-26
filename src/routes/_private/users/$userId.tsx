import { IAuthStore } from "@store";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/users/$userId")({
  beforeLoad: ({ params }) => {
    const auth = IAuthStore.getInstance();

    if (params.userId === auth.user?.id) {
      throw redirect({ to: "/profile" });
    }
  },
});
