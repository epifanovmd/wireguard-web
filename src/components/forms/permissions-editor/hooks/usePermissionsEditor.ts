import { EPermissions, ERole } from "@api/api-gen/data-contracts";
import { hasPermission } from "@core/permissions";
import { useCallback } from "react";

import { PermissionItem } from "../types";

interface UsePermissionsEditorProps {
  value: EPermissions[];
  onChange: (perms: EPermissions[]) => void;
  rolePermissions: EPermissions[];
  role?: ERole;
}

export const usePermissionsEditor = ({
  value,
  onChange,
  rolePermissions,
  role,
}: UsePermissionsEditorProps) => {
  const isAdminRole = role === ERole.Admin;

  const isFromRole = useCallback(
    (perm: EPermissions) => hasPermission(rolePermissions, perm),
    [rolePermissions],
  );

  const isDirect = useCallback(
    (perm: EPermissions) => value.includes(perm),
    [value],
  );

  const isEffective = useCallback(
    (perm: EPermissions) =>
      isAdminRole || isFromRole(perm) || value.includes(perm),
    [isAdminRole, isFromRole, value],
  );

  const isWildcardEffective = useCallback(
    (wildcard: EPermissions) =>
      isAdminRole ||
      hasPermission(rolePermissions, wildcard) ||
      value.includes(wildcard),
    [isAdminRole, rolePermissions, value],
  );

  const hasSuperWildcard = value.includes(EPermissions.Value);
  const hasWgWildcard = value.includes(EPermissions.Wg);
  const wgWildcardFromRole = hasPermission(rolePermissions, EPermissions.Wg);

  const toggleSuperWildcard = useCallback(() => {
    if (isAdminRole) return;
    onChange(
      hasSuperWildcard
        ? value.filter(p => p !== EPermissions.Value)
        : [EPermissions.Value],
    );
  }, [isAdminRole, hasSuperWildcard, value, onChange]);

  const toggleWgWildcard = useCallback(() => {
    if (isAdminRole || hasSuperWildcard) return;
    if (hasWgWildcard) {
      onChange(value.filter(p => p !== EPermissions.Wg));
    } else {
      onChange([...value.filter(p => !p.startsWith("wg:")), EPermissions.Wg]);
    }
  }, [isAdminRole, hasSuperWildcard, hasWgWildcard, value, onChange]);

  const toggleDirect = useCallback(
    (perm: EPermissions) => {
      if (isFromRole(perm) || isAdminRole) return;
      onChange(
        value.includes(perm) ? value.filter(p => p !== perm) : [...value, perm],
      );
    },
    [isFromRole, isAdminRole, value, onChange],
  );

  const toggleGroupWildcard = useCallback(
    (wildcard: EPermissions, groupItems: PermissionItem[]) => {
      if (isAdminRole) return;
      if (value.includes(wildcard)) {
        onChange(value.filter(p => p !== wildcard));
      } else {
        const itemValues = groupItems.map(i => i.value);

        onChange([...value.filter(p => !itemValues.includes(p)), wildcard]);
      }
    },
    [isAdminRole, value, onChange],
  );

  return {
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
  };
};
