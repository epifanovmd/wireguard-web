import { createLazyFileRoute } from "@tanstack/react-router";

import { Stats } from "../../../pages/wireguard/stats";

export const Route = createLazyFileRoute("/_private/wireguard/stats")({
  component: Stats,
});
