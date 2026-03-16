import { createLazyFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import React from "react";

import { ServerDetail } from "../../../../pages/wireguard/servers/ServerDetail";

const Component = () => {
  const navigate = useNavigate();
  const { serverId } = useParams({ from: "/_private/wireguard/servers/$serverId" });
  return <ServerDetail serverId={serverId} onBack={() => navigate({ to: "/wireguard/servers" })} />;
};

export const Route = createLazyFileRoute("/_private/wireguard/servers/$serverId")({
  component: Component,
});
