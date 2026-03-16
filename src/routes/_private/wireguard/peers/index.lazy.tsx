import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { PeersList } from "../../../../pages/wireguard/peers/PeersList";

export const Route = createLazyFileRoute("/_private/wireguard/peers/")({
  component: PeersList,
});
