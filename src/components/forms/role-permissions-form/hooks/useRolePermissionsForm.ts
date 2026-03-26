import { useApi } from "@api";
import { EPermissions, ERole, IRoleDto } from "@api/api-gen/data-contracts";
import { useNotification } from "@core/notifications";
import { useCallback, useEffect, useState } from "react";

const ROLE_ORDERS: Record<string, number> = {
  [ERole.Admin]: 0,
  [ERole.User]: 1,
  [ERole.Guest]: 2,
};

export const useRolePermissionsForm = () => {
  const api = useApi();
  const toast = useNotification();

  const [roles, setRoles] = useState<IRoleDto[]>([]);
  const [editedPerms, setEditedPerms] = useState<
    Record<string, EPermissions[]>
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    const res = await api.getRoles().catch(() => null);

    if (!res?.data) return;

    setRoles(res.data);
    setEditedPerms(
      Object.fromEntries(
        res.data
          .sort((a, b) => ROLE_ORDERS[a.name] - ROLE_ORDERS[b.name])
          .map(r => [r.id, r.permissions.map(p => p.name as EPermissions)]),
      ),
    );
  }, [api]);

  useEffect(() => {
    loadRoles().then();
  }, [loadRoles]);

  const setRolePerms = useCallback(
    (roleId: string, perms: EPermissions[]) =>
      setEditedPerms(prev => ({ ...prev, [roleId]: perms })),
    [],
  );

  const saveRole = useCallback(
    async (role: IRoleDto) => {
      setSavingId(role.id);
      try {
        await api.setRolePermissions(
          { id: role.id },
          {
            permissions: editedPerms[role.id] ?? [],
          },
        );
        await loadRoles();
        toast.success(`Права роли «${role.name}» сохранены`);
      } catch {
        toast.error("Ошибка сохранения");
      } finally {
        setSavingId(null);
      }
    },
    [api, editedPerms, loadRoles, toast],
  );

  const resetRole = useCallback(
    (role: IRoleDto) =>
      setEditedPerms(prev => ({
        ...prev,
        [role.id]: role.permissions.map(p => p.name as EPermissions),
      })),
    [],
  );

  const hasChanges = useCallback(
    (role: IRoleDto) => {
      const original = role.permissions
        .map(p => p.name)
        .sort()
        .join(",");
      const edited = (editedPerms[role.id] ?? []).sort().join(",");

      return original !== edited;
    },
    [editedPerms],
  );

  return {
    roles,
    editedPerms,
    savingId,
    setRolePerms,
    saveRole,
    resetRole,
    hasChanges,
  };
};
