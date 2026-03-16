import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { ServersList } from "../../../../pages/wireguard/servers/ServersList";

export const Route = createLazyFileRoute("/_private/wireguard/servers/")({
  component: ServersList,
});
