import { createLazyFileRoute } from "@tanstack/react-router";

import { ResetPassword } from "../pages/resetPassword";

export const Route = createLazyFileRoute("/reset-password")({
  component: ResetPassword,
});
