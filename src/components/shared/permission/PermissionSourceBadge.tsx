import { FC } from "react";

import { Badge } from "../../ui";

interface PermissionSourceBadgeProps {
  fromRole?: boolean;
  direct?: boolean;
}

export const PermissionSourceBadge: FC<PermissionSourceBadgeProps> = ({
  fromRole,
  direct,
}) =>
  fromRole ? (
    <Badge variant={"info"}>{"через роль"}</Badge>
  ) : direct ? (
    <Badge variant={"info"}>{"напрямую"}</Badge>
  ) : null;
