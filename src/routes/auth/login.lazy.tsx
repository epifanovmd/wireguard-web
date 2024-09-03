import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { LoginPage } from "../../pages/login";

export const Route = createLazyFileRoute("/auth/login")({
  component: () => <LoginPage />,
});
