import { EPermissions } from "@api/api-gen/data-contracts";
import { Checkbox } from "@components/ui";
import { FC } from "react";

import { PermissionSourceBadge } from "../../../shared";
import { PermissionGroup } from "../types";
import { PermissionItemRow } from "./PermissionItemRow";

interface PermissionGroupSectionProps {
  group: PermissionGroup;
  isAdminRole: boolean;
  hasSuperWildcard: boolean;
  hasWgWildcard: boolean;
  isEffective: (perm: EPermissions) => boolean;
  isFromRole: (perm: EPermissions) => boolean;
  isDirect: (perm: EPermissions) => boolean;
  isWildcardEffective: (perm: EPermissions) => boolean;
  onToggleDirect: (perm: EPermissions) => void;
  onToggleGroupWildcard: (
    wildcard: EPermissions,
    items: PermissionGroup["items"],
  ) => void;
}

export const PermissionGroupSection: FC<PermissionGroupSectionProps> = ({
  group,
  isAdminRole,
  hasSuperWildcard,
  hasWgWildcard,
  isEffective,
  isFromRole,
  isDirect,
  isWildcardEffective,
  onToggleDirect,
  onToggleGroupWildcard,
}) => {
  const wildcardEffective = group.wildcard
    ? isWildcardEffective(group.wildcard)
    : false;
  const wildcardFromRole = group.wildcard ? isFromRole(group.wildcard) : false;
  const wildcardInherited =
    wildcardEffective &&
    !wildcardFromRole &&
    (isAdminRole || hasSuperWildcard || hasWgWildcard);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.label}
        </p>

        {group.wildcard && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Checkbox
              checked={wildcardEffective}
              onCheckedChange={() =>
                group.wildcard &&
                onToggleGroupWildcard(group.wildcard, group.items)
              }
              disabled={
                isAdminRole ||
                wildcardFromRole ||
                hasSuperWildcard ||
                hasWgWildcard
              }
            />
            <span className="text-xs text-muted-foreground">
              <code className="bg-muted px-1 rounded">{group.wildcard}</code>
            </span>
            <PermissionSourceBadge
              fromRole={wildcardFromRole || wildcardInherited}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pl-1">
        {group.items.map(item => {
          const fromRole = isFromRole(item.value);
          const effective = isEffective(item.value);
          const direct = isDirect(item.value);
          const inheritedViaWildcard = effective && !direct && !isAdminRole;

          return (
            <PermissionItemRow
              key={item.value}
              item={item}
              effective={effective}
              direct={direct}
              fromRole={fromRole}
              inheritedViaWildcard={inheritedViaWildcard}
              isAdminRole={isAdminRole}
              onToggle={onToggleDirect}
            />
          );
        })}
      </div>
    </div>
  );
};
