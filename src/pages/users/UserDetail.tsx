import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Button,
  Card,
  Select,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useConfirm,
  useToast,
} from "~@components/ui2";
import { usePeersDataStore, useUsersDataStore } from "~@store";

import { PermissionsEditor } from "./components/PermissionsEditor";
import { UserAvatar } from "./components/UserAvatar";
import { UserRoleBadge } from "./components/UserRoleBadge";

interface UserDetailProps {
  userId: string;
  onBack: () => void;
}

export const UserDetail: FC<UserDetailProps> = observer(
  ({ userId, onBack }) => {
    const store = useUsersDataStore();
    const peersStore = usePeersDataStore();
    const confirm = useConfirm();
    const toast = useToast();
    const [selectedRole, setSelectedRole] = useState<ERole>(ERole.User);
    const [selectedPerms, setSelectedPerms] = useState<EPermissions[]>([]);
    const [savingPrivileges, setSavingPrivileges] = useState(false);

    useEffect(() => {
      store.loadUser(userId);
      peersStore.loadPeersByUser(userId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
      if (store.user) {
        setSelectedRole((store.user.role?.name as ERole) ?? ERole.User);
        setSelectedPerms((store.user.role?.permissions ?? []).map(p => p.name));
      }
    }, [store.user]);

    const handleSavePrivileges = async () => {
      setSavingPrivileges(true);
      const res = await store.setPrivileges(userId, {
        roleName: selectedRole,
        permissions: selectedPerms,
      });
      setSavingPrivileges(false);
      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Privileges updated");
      }
    };

    if (!store.userHolder.isReady && !store.userHolder.isError) {
      return (
        <div className="flex flex-col h-full">
          <PageHeader
            title="User"
            breadcrumbs={[{ label: "Users", href: "/users" }, { label: "..." }]}
          />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    const user = store.user;
    const model = store.userModel;

    if (!user)
      return <div className="p-6 text-[var(--muted-foreground)]">User not found</div>;

    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title={model?.displayName ?? "User"}
          breadcrumbs={[
            { label: "Users", href: "/users" },
            { label: model?.displayName ?? "User" },
          ]}
          actions={
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                const ok = await confirm({
                  title: "Delete user",
                  message: "Delete this user permanently?",
                  variant: "danger",
                });
                if (!ok) return;
                const res = await store.deleteUser(userId);
                if (res.error) {
                  toast.error(res.error.message);
                } else {
                  toast.success("Deleted");
                  onBack();
                }
              }}
            >
              Delete user
            </Button>
          }
        />
        <div className="p-4 sm:p-6 flex gap-6 flex-wrap xl:flex-nowrap">
          {/* Sidebar - user info */}
          <div className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-4">
            <Card className="p-5">
              <div className="flex flex-col items-center text-center gap-2.5">
                <UserAvatar name={model?.displayName ?? "?"} size="lg" />
                <div>
                  <p className="font-semibold text-[var(--foreground)]">
                    {model?.displayName}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {user.email ?? user.phone ?? "—"}
                  </p>
                </div>
                <UserRoleBadge role={model?.roleLabel ?? "user"} />
                {user.emailVerified !== undefined && (
                  <Badge variant={user.emailVerified ? "success" : "gray"} dot>
                    {user.emailVerified ? "Email verified" : "Email unverified"}
                  </Badge>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Registered</span>
                  <span className="text-[var(--muted-foreground)]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.profile?.lastOnline && (
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Last online</span>
                    <span className="text-[var(--muted-foreground)]">
                      {new Date(user.profile.lastOnline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="privileges">
              <TabsList>
                <TabsTrigger value="privileges">Privileges</TabsTrigger>
                <TabsTrigger value="peers">VPN Peers</TabsTrigger>
              </TabsList>
              <TabsContent value="privileges">
                <div className="flex flex-col gap-6 mt-4">
                  <Card title="Role" className="p-5">
                    <Select
                      options={[
                        { value: ERole.Admin, label: "Admin" },
                        { value: ERole.User, label: "User" },
                        { value: ERole.Guest, label: "Guest" },
                      ]}
                      value={selectedRole}
                      onValueChange={v => setSelectedRole((v ?? ERole.User) as ERole)}
                    />
                  </Card>
                  <Card title="Permissions" className="p-5">
                    <PermissionsEditor
                      value={selectedPerms}
                      onChange={setSelectedPerms}
                    />
                  </Card>
                  <div className="flex justify-end">
                    <Button loading={savingPrivileges} onClick={handleSavePrivileges}>
                      Save privileges
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="peers">
                <div className="mt-4">
                  {peersStore.isLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : peersStore.peers.length === 0 ? (
                    <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
                      No peers assigned to this user
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                            <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Name</th>
                            <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase">IP</th>
                            <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
                            <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Expires</th>
                          </tr>
                        </thead>
                        <tbody>
                          {peersStore.models.map(peer => (
                            <tr key={peer.data.id} className="border-b border-[var(--border)] hover:bg-[var(--accent)]">
                              <td className="px-3 py-2.5 font-medium text-[var(--foreground)]">{peer.name}</td>
                              <td className="px-3 py-2.5 font-mono text-xs text-[var(--muted-foreground)]">{peer.data.allowedIPs}</td>
                              <td className="px-3 py-2.5">
                                <Badge variant={peer.enabled ? "success" : "gray"} dot>
                                  {peer.statusLabel}
                                </Badge>
                              </td>
                              <td className="px-3 py-2.5 text-xs text-[var(--muted-foreground)]">
                                {peer.expiresAtFormatted ?? "No expiry"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  },
);
