import { createLazyFileRoute } from "@tanstack/react-router";

import { SignUpPage } from "../../pages/auth";

export const Route = createLazyFileRoute("/auth/signUp")({
  component: SignUpPage,
});
