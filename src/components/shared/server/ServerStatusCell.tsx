import { FC } from "react";

import { ServerModel } from "~@models";

import { useWgServer } from "../../../socket";
import { Badge } from "../../ui2";
import { ServerStatusBadge } from "./ServerStatusBadge";

export const ServerStatusCell: FC<{ row: ServerModel }> = ({ row }) => {
  const { status: liveStatus } = useWgServer(row.data.id);
  const effectiveStatus = liveStatus?.status ?? row.data.status;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ServerStatusBadge status={effectiveStatus} />
      {!row.data.enabled && <Badge variant="warning">Disabled</Badge>}
    </div>
  );
};
