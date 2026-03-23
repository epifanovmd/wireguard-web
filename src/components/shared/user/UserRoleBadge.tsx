import { FC } from "react";

import { ERole } from "~@api/api-gen/data-contracts";
import { Badge } from "~@components/ui";
import { RoleModel } from "~@models";

import { ROLE_BADGE_VARIANT } from "./constants";

export const UserRoleBadge: FC<{ role: ERole }> = ({ role }) => {
  const label = new RoleModel(role).label;

  return (
    <Badge variant={ROLE_BADGE_VARIANT[role] ?? "default"}>{label}</Badge>
  );
};
