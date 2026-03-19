import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { userColumns } from "~@components/tables/users";
import { type ColumnDef, IconButton, useConfirm } from "~@components/ui2";
import { useNotification } from "~@core/notifications";
import { PublicUserModel } from "~@models";
import { useUsersDataStore } from "~@store";

export const useUsersListVM = () => {
  const store = useUsersDataStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useNotification();

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
      navigate({
        to: "/users/$userId",
        params: { userId: user.data.userId },
      });
    },
    [navigate],
  );

  const columns: ColumnDef<PublicUserModel>[] = useMemo(
    () => [
      ...userColumns,
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div
            className="flex items-center justify-end gap-1"
            onClick={e => e.stopPropagation()}
          >
            <IconButton
              title="Удалить"
              onClick={() =>
                handleDelete(row.original.data.userId, row.original.displayName)
              }
            >
              <Trash2 size={15} className="text-destructive" />
            </IconButton>
          </div>
        ),
      },
    ],
    [handleDelete],
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
