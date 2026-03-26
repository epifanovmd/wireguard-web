import { ServerModel } from "@models";
import { FC } from "react";

import { useWgServer } from "../../../socket";
import { ServerStatus } from "./ServerStatus";

export const ServerStatusLive: FC<{ row: ServerModel }> = ({ row }) => {
  const { status: liveStatus } = useWgServer(row.data.id);
  const effectiveStatus = liveStatus?.status ?? row.data.status;

  return <ServerStatus status={effectiveStatus} enabled={row.data.enabled} />;
};
