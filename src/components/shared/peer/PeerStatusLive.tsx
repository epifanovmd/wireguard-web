import { FC } from "react";

import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";
import { PeerStatus } from "./PeerStatus";

export const PeerStatusLive: FC<{ row: PeerModel }> = ({ row }) => {
  const { status: liveStatus } = useWgPeer(row.data.id);
  const effectiveStatus = liveStatus?.status ?? row.status;

  return <PeerStatus status={effectiveStatus} enabled={row.enabled} />;
};
