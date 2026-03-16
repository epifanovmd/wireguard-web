import { createLazyFileRoute } from "@tanstack/react-router";

import { SignIn } from "../../pages/auth";

export const Route = createLazyFileRoute("/auth/signIn")({
  component: SignIn,
});
