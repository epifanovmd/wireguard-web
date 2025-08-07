import { createFileRoute, redirect } from "@tanstack/react-router";

import { ResetPassword } from "../pages/resetPassword";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: { token?: string }) => {
    return {
      token: search.token ?? "",
    };
  },
  beforeLoad: opts => {
    if (!opts.search?.token) {
      redirect({ to: "/", throw: true });
    }
  },
  component: ResetPassword,
});
