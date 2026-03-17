import { useNavigate } from "@tanstack/react-router";
import { Search, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import {
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
  Table,
  TableColumn,
  useConfirm,
  useToast,
} from "~@components";
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

  const columns: TableColumn<PublicUserModel>[] = [
    {
      key: "user",
      title: "User",
      render: (_, user) => (
        <div className="flex items-center gap-2.5">
          <UserAvatar name={user.displayName} />
          <span className="font-medium text-[var(--foreground)]">
            {user.displayName}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (_, user) => (
        <span className="text-[var(--muted-foreground)]">
          {user.data.email ?? "—"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (_, user) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={e => e.stopPropagation()}
        >
          <button
            title="Delete"
            className="cursor-pointer p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444] transition-colors"
            onClick={() => handleDelete(user.data.userId, user.displayName)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Users"
        subtitle={`${store.total} total`}
        actions={<Button onClick={() => setCreateOpen(true)}>Add user</Button>}
      />
      <div className="p-6 flex flex-col gap-4">
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            wrapperClassName="flex-1 min-w-[200px]"
            leftIcon={<Search size={16} />}
          />
        </div>

        <Card padding="none">
          <Table
            columns={columns}
            data={filtered}
            rowKey={u => u.data.userId}
            loading={store.isLoading}
            emptyText="No users found"
            emptyDescription="Try adjusting your search or filters"
            onRowClick={record =>
              navigate({
                to: "/users/$userId",
                params: { userId: record.data.userId },
              })
            }
          />
          <Pagination
            total={store.total}
            offset={store.offset}
            limit={store.limit}
            onChange={offset => {
              store.setOffset(offset);
              store.loadUsers();
            }}
          />
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
