import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { Dashboard } from "../../pages/dashboard/Dashboard";

export const Route = createLazyFileRoute("/_private/")({
  component: Dashboard,
});
