import React, { FC } from "react";

import { Badge } from "~@components";

interface PeerStatusBadgeProps {
  enabled: boolean;
  isExpired?: boolean;
}

export const PeerStatusBadge: FC<PeerStatusBadgeProps> = ({ enabled, isExpired }) => {
  if (isExpired) return <Badge variant="warning" dot>Expired</Badge>;
  if (!enabled) return <Badge variant="gray" dot>Disabled</Badge>;
  return <Badge variant="success" dot>Enabled</Badge>;
};
