import { useCallback } from "react";

import { EPermissions } from "~@api/api-gen/data-contracts";

import { useAuthStore } from "./useAuthStore";

/**
 * Хук для проверки прав текущего пользователя.
 *
 * @example
 * const { isAdmin, hasPermission } = usePermissions();
 * if (hasPermission(EPermissions.WgServerManage)) { ... }
 */
export const usePermissions = () => {
  const auth = useAuthStore();

  const check = useCallback(
    (required: EPermissions) => auth.hasPermission(required),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth.roles, auth.permissions],
  );

  return {
    isAdmin: auth.isAdmin,
    roles: auth.roles,
    permissions: auth.permissions,
    directPermissions: auth.directPermissions,
    hasPermission: check,
  };
};
