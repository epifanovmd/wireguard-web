import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { SignUpPage } from "../../pages/auth";

export const Route = createLazyFileRoute("/auth/signUp")({
  component: () => <SignUpPage />,
});
