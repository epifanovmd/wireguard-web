import { createLazyFileRoute, useParams } from "@tanstack/react-router";

import { ServerDetail } from "../../../../pages/wireguard/servers/ServerDetail";

const Component = () => {
  const { serverId } = useParams({ from: "/_private/wireguard/servers/$serverId" });

  return <ServerDetail serverId={serverId} />;
};

export const Route = createLazyFileRoute("/_private/wireguard/servers/$serverId")({
  component: Component,
});
