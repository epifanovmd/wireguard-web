import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { Stats } from "../../../pages/wireguard/stats/Stats";

export const Route = createLazyFileRoute("/_private/wireguard/stats")({
  component: Stats,
});
