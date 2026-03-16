import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { ERole } from "~@api/api-gen/data-contracts";
import {
  Badge,
  Button,
  Card,
  Drawer,
  Empty,
  Input,
  PageHeader,
  Pagination,
  Select,
  Spinner,
  useConfirm,
} from "~@components";
import { useToast } from "~@components";
import { useUsersDataStore } from "~@store";

import { UserAvatar } from "./components/UserAvatar";
import { UserRoleBadge } from "./components/UserRoleBadge";
import { CreateUserDrawer } from "./CreateUserDrawer";

export const UsersList: FC = observer(() => {
  const store = useUsersDataStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    store.loadUsers().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.offset]);

  const filtered = store.models.filter(m => {
    const matchSearch =
      !search ||
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (m.data.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || m.data.role?.name === roleFilter;
    return matchSearch && matchRole;
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

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Users"
        subtitle={`${store.total} total`}
        actions={<Button onClick={() => setCreateOpen(true)}>Add user</Button>}
      />
      <div className="p-6 flex flex-col gap-4">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            wrapperClassName="flex-1 min-w-[200px]"
            leftIcon={<Search size={16} />}
          />
          <Select
            data={[
              { value: "", label: "All roles" },
              { value: ERole.Admin, label: "Admin" },
              { value: ERole.User, label: "User" },
              { value: ERole.Guest, label: "Guest" },
            ]}
            value={roleFilter}
            onChange={v => setRoleFilter(v ?? "")}
            className="w-40"
          />
        </div>

        <Card padding="none">
          {store.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <Empty
              title="No users found"
              description="Try adjusting your search or filters"
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--table-header-bg)] border-b border-[var(--border-color)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr
                    key={user.data.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={user.displayName} />
                        <span className="font-medium text-[var(--text-primary)]">
                          {user.displayName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {user.data.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <UserRoleBadge role={user.roleLabel} />
                    </td>
                    <td className="px-4 py-3">
                      {user.data.emailVerified ? (
                        <Badge variant="success" dot>
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="gray" dot>
                          Unverified
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs">
                      {new Date(user.data.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate({
                              to: "/users/$userId",
                              params: { userId: user.data.id },
                            })
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#ef4444] hover:text-[#dc2626]"
                          onClick={() =>
                            handleDelete(user.data.id, user.displayName)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

      <CreateUserDrawer
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
