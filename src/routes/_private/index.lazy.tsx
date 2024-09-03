import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { ClientsPage } from "../../pages/clients";

export const Route = createLazyFileRoute("/_private/")({
  component: () => <ClientsPage />,
});
