import React, { FC } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";
import { Badge } from "~@components/ui2";

const STATUS_CONFIG: Record<string, { variant: any; label: string }> = {
  [EWgServerStatus.Up]: { variant: "success", label: "Up" },
  [EWgServerStatus.Down]: { variant: "gray", label: "Down" },
  [EWgServerStatus.Error]: { variant: "danger", label: "Error" },
  [EWgServerStatus.Unknown]: { variant: "default", label: "Unknown" },
};

export const ServerStatusBadge: FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[EWgServerStatus.Unknown];
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
};
