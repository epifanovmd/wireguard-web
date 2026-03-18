import { FC } from "react";

import { ServerModel } from "~@models";

import { Badge } from "../../ui2";
import { ServerStatusBadge } from "./ServerStatusBadge";

interface ServerNameCellProps {
  server: ServerModel;
  /** Live status string from socket; falls back to model status */
  liveStatus?: string;
}

export const ServerNameCell: FC<ServerNameCellProps> = ({
  server,
  liveStatus,
}) => {
  const effectiveStatus = liveStatus ?? server.data.status;

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-medium text-[var(--foreground)]">{server.name}</p>
        <ServerStatusBadge status={effectiveStatus} />
        {!server.data.enabled && <Badge variant="warning">Disabled</Badge>}
      </div>
      <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--muted-foreground)]">
        <span className="font-mono">{server.data.interface}</span>
        {server.data.endpoint && (
          <>
            <span>·</span>
            <span>{server.data.endpoint}</span>
          </>
        )}
      </div>
    </div>
  );
};
