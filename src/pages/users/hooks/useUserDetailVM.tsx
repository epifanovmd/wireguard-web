import { useCallback, useEffect, useMemo, useState } from "react";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { AsyncButton, type ColumnDef, useConfirm } from "~@components/ui";
import { useNotification } from "~@core/notifications";
import { PeerModel } from "~@models";
import {
  usePeerDataStore,
  usePeersListStore,
  usePermissions,
  useUsersDataStore,
} from "~@store";

import { peerColumns as basePeerColumns } from "../../../components/tables/peers";
import { useRolesSelectOptions } from "../../../hooks";

interface UseUserDetailVMParams {
  userId: string;
  onBack: () => void;
}

export const useUserDetailVM = ({ userId, onBack }: UseUserDetailVMParams) => {
  const store = useUsersDataStore();
  const peersStore = usePeersListStore();
  const peerDataStore = usePeerDataStore();
  const confirm = useConfirm();
  const toast = useNotification();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(EPermissions.UserManage);

  const { options: roleOptions, getRolePermissions } = useRolesSelectOptions();

  const [selectedRole, setSelectedRole] = useState<ERole>(ERole.User);
  const [directPerms, setDirectPerms] = useState<EPermissions[]>([]);

  useEffect(() => {
    store.loadUser(userId);
    peersStore.load({ userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (store.user) {
      setSelectedRole((store.user.roles[0]?.name as ERole) ?? ERole.User);
      setDirectPerms(
        store.user.directPermissions.map(p => p.name as EPermissions),
      );
    }
  }, [store.user]);

  const handleSavePrivileges = useCallback(async () => {
    const res = await store.setPrivileges(userId, {
      roles: [selectedRole],
      permissions: directPerms,
    });

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Права обновлены");
    }
  }, [store, userId, selectedRole, directPerms, toast]);

  const handleDeleteUser = useCallback(async () => {
    const ok = await confirm({
      title: "Удалить пользователя",
      message: "Удалить этого пользователя навсегда?",
      variant: "danger",
    });

    if (!ok) return;
    const res = await store.deleteUser(userId);

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Удалено");
      onBack();
    }
  }, [store, userId, confirm, toast, onBack]);

  const revokeColumn: ColumnDef<PeerModel> = useMemo(
    () => ({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <AsyncButton
          variant="outline"
          size="sm"
          onClick={async e => {
            e.stopPropagation();
            const ok = await confirm({
              title: "Отозвать пир",
              message: `Отозвать пир «${row.original.name}» от этого пользователя?`,
              variant: "danger",
            });

            if (!ok) return;
            const res = await peerDataStore.revokePeer(row.original.data.id);

            if (res.error) {
              toast.error(res.error.message);
            } else {
              toast.success("Пир отозван");
              peersStore.load({ userId });
            }
          }}
        >
          Отозвать
        </AsyncButton>
      ),
    }),
    [confirm, peerDataStore, peersStore, toast, userId],
  );

  const peerColumns: ColumnDef<PeerModel>[] = useMemo(
    () => (canManage ? [...basePeerColumns, revokeColumn] : basePeerColumns),
    [canManage, revokeColumn],
  );

  const rolePermissions = useMemo(
    () => getRolePermissions(selectedRole),
    [getRolePermissions, selectedRole],
  );

  return {
    isLoading: store.userHolder.isLoading || !store.userHolder.isReady,
    user: store.user,
    model: store.userModel,
    canManage,
    roleOptions,
    rolePermissions,
    selectedRole,
    setSelectedRole,
    directPerms,
    setDirectPerms,
    peerColumns,
    peers: peersStore.models,
    peersLoading: peersStore.isLoading,
    isSavingPrivileges: store.setPrivilegesMutation.isLoading,
    isDeletingUser: store.deleteUserMutation.isLoading,
    handleSavePrivileges,
    handleDeleteUser,
  };
};
