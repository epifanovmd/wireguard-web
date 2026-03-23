import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PeerModel } from "~@models";

import { usePeerLive } from "../../../hooks/usePeerLive";
import { PeerStatus } from "./PeerStatus";

export const PeerStatusLive: FC<{ row: PeerModel }> = observer(({ row }) => {
  const { status: liveStatus } = usePeerLive(row.data.id);
  const effectiveStatus = liveStatus?.status ?? row.status;

  return <PeerStatus status={effectiveStatus} enabled={row.enabled} />;
});
