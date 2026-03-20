import { FC } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";

import { Badge } from "../../ui";
import { PeerStatusBadge } from "./PeerStatusBadge";

export interface PeerStatusProps {
  status?: EWgServerStatus;
  enabled?: boolean;
}

export const PeerStatus: FC<PeerStatusProps> = ({
  status = EWgServerStatus.Unknown,
  enabled,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {<PeerStatusBadge status={status} />}
      {!enabled && <Badge variant="warning">Disabled</Badge>}
    </div>
  );
};
