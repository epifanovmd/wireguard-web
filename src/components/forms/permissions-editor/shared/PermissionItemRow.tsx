import { FC } from "react";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { Checkbox, cn } from "~@components/ui";

import { PermissionSourceBadge } from "../../../shared";
import { PermissionItem } from "../types";

interface PermissionItemRowProps {
  item: PermissionItem;
  effective: boolean;
  direct: boolean;
  fromRole: boolean;
  inheritedViaWildcard: boolean;
  isAdminRole: boolean;
  onToggle: (perm: EPermissions) => void;
}

export const PermissionItemRow: FC<PermissionItemRowProps> = ({
  item,
  effective,
  direct,
  fromRole,
  inheritedViaWildcard,
  isAdminRole,
  onToggle,
}) => (
  <div
    className={cn(
      "flex items-start gap-3 p-2 rounded-md transition-colors",
      effective && "bg-primary/5",
    )}
  >
    <Checkbox
      checked={effective}
      onCheckedChange={() => onToggle(item.value)}
      disabled={isAdminRole || fromRole || inheritedViaWildcard}
      className="mt-0.5"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-sm">{item.label}</span>
        <code className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
          {item.value}
        </code>
        <PermissionSourceBadge
          fromRole={fromRole || isAdminRole || inheritedViaWildcard}
          direct={direct && !fromRole && !isAdminRole}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
    </div>
  </div>
);
