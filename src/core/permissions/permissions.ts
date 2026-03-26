import { EPermissions, ERole } from "@api/api-gen/data-contracts";

/**
 * Проверяет наличие права с поддержкой wildcard-иерархии.
 * Зеркалит логику TokenService.hasPermission() на бэкенде.
 *
 * Иерархия wildcards:
 *   "wg:server:view" → проверяет "wg:server:*" → "wg:*" → "*"
 *   "wg:peer:manage" → проверяет "wg:peer:*"  → "wg:*" → "*"
 */
export function hasPermission(
  userPerms: EPermissions[],
  required: EPermissions,
): boolean {
  if (userPerms.includes(EPermissions.Value)) return true;
  if (userPerms.includes(required)) return true;

  const parts = required.split(":");

  for (let i = parts.length - 1; i >= 1; i--) {
    const wildcard = [...parts.slice(0, i), "*"].join(":") as EPermissions;

    if (userPerms.includes(wildcard)) return true;
  }

  return false;
}

/**
 * Возвращает true если пользователь имеет роль ADMIN (superadmin bypass).
 */
export function isAdminRole(roles: ERole[]): boolean {
  return roles.includes(ERole.Admin);
}

/**
 * Проверяет доступ: admin bypass ИЛИ конкретное право.
 */
export function canAccess(
  roles: ERole[],
  userPerms: EPermissions[],
  required: EPermissions,
): boolean {
  return isAdminRole(roles) || hasPermission(userPerms, required);
}

/**
 * Вычисляет effective permissions = union(rolePermissions) ∪ directPermissions.
 * Дедуплицирует результат.
 */
export function computeEffectivePermissions(
  rolePermissions: EPermissions[],
  directPermissions: EPermissions[],
): EPermissions[] {
  return Array.from(new Set([...rolePermissions, ...directPermissions]));
}
