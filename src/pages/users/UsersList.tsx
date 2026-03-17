import { useNavigate } from "@tanstack/react-router";
import { Search, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { PageHeader } from "~@components/layouts";
import {
  Button,
  Card,
  type ColumnDef,
  Input,
  Pagination,
  Table,
  useConfirm,
  useToast,
} from "~@components/ui2";
import { PublicUserModel } from "~@models";
import { useUsersDataStore } from "~@store";

import { UserAvatar } from "./components/UserAvatar";
import { CreateUserModal } from "./CreateUserModal";

export const UsersList: FC = observer(() => {
  const store = useUsersDataStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    store.loadUsers().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.offset]);

  const filtered = store.models.filter(m => {
    const matchSearch =
      !search ||
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (m.data.email ?? "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete user",
      message: `Delete user "${name}"? This action cannot be undone.`,
      variant: "danger",
    });
    if (!ok) return;
    const res = await store.deleteUser(id);
    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("User deleted");
    }
  };

  const columns: ColumnDef<PublicUserModel>[] = [
    {
      accessorKey: "displayName",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <UserAvatar name={row.original.displayName} />
          <span className="font-medium text-[var(--foreground)]">
            {row.original.displayName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-[var(--muted-foreground)]">
          {row.original.data.email ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={e => e.stopPropagation()}
        >
          <button
            title="Delete"
            className="cursor-pointer p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={() => handleDelete(row.original.data.userId, row.original.displayName)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(store.total / store.limit);
  const currentPage = Math.floor(store.offset / store.limit) + 1;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Users"
        subtitle={`${store.total} total`}
        actions={<Button onClick={() => setCreateOpen(true)}>Add user</Button>}
      />
      <div className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            wrapperClassName="flex-1 min-w-[200px]"
            leftIcon={<Search size={16} />}
          />
        </div>

        <Card>
          <Table
            columns={columns}
            data={filtered}
            getRowId={u => u.data.userId}
            loading={store.isLoading}
            empty={
              <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
                No users found
              </div>
            }
            onRowClick={record =>
              navigate({
                to: "/users/$userId",
                params: { userId: record.data.userId },
              })
            }
          />
          {totalPages > 1 && (
            <div className="flex justify-center py-3 border-t border-[var(--border)]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => {
                  store.setOffset((page - 1) * store.limit);
                  store.loadUsers();
                }}
              />
            </div>
          )}
        </Card>
      </div>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          store.loadUsers();
        }}
      />
    </div>
  );
});
