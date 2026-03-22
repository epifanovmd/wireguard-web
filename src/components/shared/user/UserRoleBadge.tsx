import { FC } from "react";

import { ERole } from "~@api/api-gen/data-contracts";
import { Badge } from "~@components/ui";
import { RoleModel } from "~@models";

const ROLE_VARIANT: Record<string, string> = {
  [ERole.Admin]: "purple",
  [ERole.User]: "info",
  [ERole.Guest]: "gray",
};

export const UserRoleBadge: FC<{ role: ERole }> = ({ role }) => {
  const label = new RoleModel(role).label;

  return (
    <Badge variant={(ROLE_VARIANT[role] ?? "default") as any}>{label}</Badge>
  );
};
