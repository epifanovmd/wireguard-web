import {
  createFileRoute,
  redirect,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import React from "react";

import { ResetPassword } from "../pages/resetPassword";

const Component = () => {
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/reset-password" });

  return (
    <ResetPassword
      token={token}
      onSuccess={() => navigate({ to: "/auth/signIn" })}
    />
  );
};

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
  component: Component,
});
