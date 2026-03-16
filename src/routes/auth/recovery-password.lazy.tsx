import { createLazyFileRoute } from "@tanstack/react-router";

import { ForgotPassword } from "../../pages/auth";

export const Route = createLazyFileRoute("/auth/recovery-password")({
  component: ForgotPassword,
});
