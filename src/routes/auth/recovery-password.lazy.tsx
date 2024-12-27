import { createLazyFileRoute } from "@tanstack/react-router";

import { RecoveryPassword } from "../../pages/auth";

export const Route = createLazyFileRoute("/auth/recovery-password")({
  component: RecoveryPassword,
});
