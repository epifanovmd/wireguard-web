import { FC } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";

import { Badge } from "../../ui";
import { ServerStatusBadge } from "./ServerStatusBadge";

export interface ServerStatusProps {
  status?: EWgServerStatus;
  enabled?: boolean;
}

export const ServerStatus: FC<ServerStatusProps> = ({
  status = EWgServerStatus.Unknown,
  enabled,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {<ServerStatusBadge status={status} />}
      {!enabled && <Badge variant="warning">Disabled</Badge>}
    </div>
  );
};
