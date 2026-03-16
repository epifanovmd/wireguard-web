import { createLazyFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import React from "react";

import { PeerDetail } from "../../../../pages/wireguard/peers/PeerDetail";

const Component = () => {
  const navigate = useNavigate();
  const { peerId } = useParams({ from: "/_private/wireguard/peers/$peerId" });
  return <PeerDetail peerId={peerId} onBack={() => navigate({ to: "/wireguard/peers" })} />;
};

export const Route = createLazyFileRoute("/_private/wireguard/peers/$peerId")({
  component: Component,
});
