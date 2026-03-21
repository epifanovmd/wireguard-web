import React, { FC } from "react";

import { ERole } from "~@api/api-gen/data-contracts";
import { Badge } from "~@components/ui";

export const UserRoleBadge: FC<{ role: ERole }> = ({ role }) => {
  const map: Record<string, { variant: any }> = {
    [ERole.Admin]: { variant: "purple" },
    [ERole.User]: { variant: "info" },
    [ERole.Guest]: { variant: "gray" },
  };

  return <Badge variant={map[role]?.variant ?? "default"}>{role}</Badge>;
};
