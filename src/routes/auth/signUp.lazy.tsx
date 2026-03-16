import { createLazyFileRoute } from "@tanstack/react-router";

import { SignUp } from "../../pages/auth/SignUp";

export const Route = createLazyFileRoute("/auth/signUp")({
  component: SignUp,
});
