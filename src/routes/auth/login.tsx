import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { LoginPage } from "../../pages/login";

export const Route = createFileRoute("/auth/login")({
  component: () => <LoginPage />,
});
