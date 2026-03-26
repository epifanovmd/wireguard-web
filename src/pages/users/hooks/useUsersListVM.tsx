import { EPermissions } from "@api/api-gen/data-contracts";
import { userColumns } from "@components/tables/users";
import {
  AsyncIconButton,
  type ColumnDef,
  IconButton,
  useConfirm,
} from "@components/ui";
import { useNotification } from "@core/notifications";
import { PublicUserModel } from "@models";
import { useAuthStore, usePermissions, useUsersDataStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useUsersListVM = () => {
  const store = useUsersDataStore();
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useNotification();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(EPermissions.UserManage);

  const [search, setSearch] = useState("");

  useEffect(() => {
    store.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      store.models.filter(m => {
        if (!search) return true;
        const q = search.toLowerCase();

        return (
          m.displayName.toLowerCase().includes(q) ||
          (m.data.email ?? "").toLowerCase().includes(q)
        );
      }),
    [store.models, search],
  );

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      const ok = await confirm({
        title: "Удалить пользователя",
        message: `Удалить пользователя «${name}»? Это действие необратимо.`,
        variant: "danger",
      });

      if (!ok) return;
      const res = await store.deleteUser(id);

      if (res.error) toast.error(res.error.message);
      else toast.success("Пользователь удалён");
    },
    [store, confirm, toast],
  );

  const handleRowClick = useCallback(
    (user: PublicUserModel) => {
      if (user.data.userId === authStore.user?.id) {
        navigate({ to: "/profile" });
      } else {
        navigate({
          to: "/users/$userId",
          params: { userId: user.data.userId },
        });
      }
    },
    [navigate, authStore.user?.id],
  );

  const columns: ColumnDef<PublicUserModel>[] = useMemo(
    () =>
      canManage
        ? [
            ...userColumns,
            {
              id: "actions",
              header: "",
              cell: ({ row }) => (
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={e => e.stopPropagation()}
                >
                  <AsyncIconButton
                    title="Удалить"
                    variant={"destructive"}
                    onClick={() =>
                      handleDelete(
                        row.original.data.userId,
                        row.original.displayName,
                      )
                    }
                  >
                    <Trash2 size={15} />
                  </AsyncIconButton>
                </div>
              ),
            },
          ]
        : userColumns,
    [handleDelete, canManage],
  );

  return {
    data: filtered,
    columns,
    loading: store.listHolder.isLoading,
    total: store.total,
    search,
    setSearch,
    handleRowClick,
    createUser: store.load,
  };
};
