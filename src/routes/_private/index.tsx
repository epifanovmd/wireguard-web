import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { ClientsPage } from "../../pages/clients";

export const Route = createFileRoute("/_private/")({
  component: () => <ClientsPage />,
});
