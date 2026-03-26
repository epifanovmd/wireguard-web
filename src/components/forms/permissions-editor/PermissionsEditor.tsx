import { EPermissions, ERole } from "@api/api-gen/data-contracts";
import { FC, memo } from "react";

import {
  PermissionSourceBadge,
  PermissionWildcardCheckboxRow,
} from "../../shared";
import { PERMISSION_GROUPS } from "./constants";
import { usePermissionsEditor } from "./hooks";
import { PermissionGroupSection } from "./shared";

export interface PermissionsEditorProps {
  value: EPermissions[];
  onChange: (perms: EPermissions[]) => void;
  rolePermissions?: EPermissions[];
  role?: ERole;
}

export const PermissionsEditor: FC<PermissionsEditorProps> = memo(
  ({ value, onChange, rolePermissions = [], role }) => {
    const {
      isAdminRole,
      isFromRole,
      isDirect,
      isEffective,
      isWildcardEffective,
      hasSuperWildcard,
      hasWgWildcard,
      wgWildcardFromRole,
      toggleSuperWildcard,
      toggleWgWildcard,
      toggleDirect,
      toggleGroupWildcard,
    } = usePermissionsEditor({ value, onChange, rolePermissions, role });

    return (
      <div className="flex flex-col gap-5">
        <PermissionWildcardCheckboxRow
          label={
            <>
              Суперправо{" "}
              <code className="text-xs bg-muted px-1 rounded">*</code>
            </>
          }
          description="Полный доступ ко всему (аналог роли Admin)"
          checked={isAdminRole || hasSuperWildcard}
          disabled={isAdminRole}
          onCheckedChange={toggleSuperWildcard}
          badge={isAdminRole && <PermissionSourceBadge fromRole />}
        />

        <PermissionWildcardCheckboxRow
          label={
            <>
              Всё WireGuard{" "}
              <code className="text-xs bg-muted px-1 rounded">wg:*</code>
            </>
          }
          description="Полный доступ ко всем WG серверам, пирам и статистике"
          checked={
            isAdminRole ||
            wgWildcardFromRole ||
            hasSuperWildcard ||
            hasWgWildcard
          }
          disabled={isAdminRole || hasSuperWildcard || wgWildcardFromRole}
          onCheckedChange={toggleWgWildcard}
          badge={
            (isAdminRole || wgWildcardFromRole) && (
              <PermissionSourceBadge fromRole />
            )
          }
        />

        {PERMISSION_GROUPS.map(group => (
          <PermissionGroupSection
            key={group.label}
            group={group}
            isAdminRole={isAdminRole}
            hasSuperWildcard={hasSuperWildcard}
            hasWgWildcard={hasWgWildcard}
            isEffective={isEffective}
            isFromRole={isFromRole}
            isDirect={isDirect}
            isWildcardEffective={isWildcardEffective}
            onToggleDirect={toggleDirect}
            onToggleGroupWildcard={toggleGroupWildcard}
          />
        ))}
      </div>
    );
  },
);
