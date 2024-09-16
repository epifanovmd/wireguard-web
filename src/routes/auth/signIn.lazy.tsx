import { createLazyFileRoute } from "@tanstack/react-router";

import { SignInPage } from "../../pages/auth/";

export const Route = createLazyFileRoute("/auth/signIn")({
  component: SignInPage,
});
