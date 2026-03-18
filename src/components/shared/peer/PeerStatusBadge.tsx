import React, { FC } from "react";

import { Badge } from "../../ui2";

interface PeerStatusBadgeProps {
  enabled: boolean;
  isExpired?: boolean;
}

export const PeerStatusBadge: FC<PeerStatusBadgeProps> = ({
  enabled,
  isExpired,
}) => {
  if (isExpired)
    return (
      <Badge variant="warning" dot>
        Истёк
      </Badge>
    );
  if (!enabled)
    return (
      <Badge variant="gray" dot>
        Отключён
      </Badge>
    );
  return (
    <Badge variant="success" dot>
      Включён
    </Badge>
  );
};
