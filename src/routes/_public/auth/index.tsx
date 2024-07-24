import { ISessionDataStore } from "@store";
import { createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";

import { LoginPage } from "../../../pages/login";

export const Route = createFileRoute("/_public/auth/")({
  beforeLoad: () => {
    const { isAuthorized } = ISessionDataStore.getInstance();

    if (isAuthorized) {
      throw redirect({ to: "/" });
    }
  },
  component: () => <LoginPage />,
});
