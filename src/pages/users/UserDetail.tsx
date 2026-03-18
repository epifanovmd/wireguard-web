import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { PageHeader } from "~@components/layouts";
import { peerColumns, PeersTable } from "~@components/tables/peers";
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
import { usePeersListStore, useUsersDataStore } from "~@store";

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
    const peersStore = usePeersListStore();
    const confirm = useConfirm();
    const toast = useToast();
    const [selectedRole, setSelectedRole] = useState<ERole>(ERole.User);
    const [selectedPerms, setSelectedPerms] = useState<EPermissions[]>([]);
    const [savingPrivileges, setSavingPrivileges] = useState(false);

    useEffect(() => {
      store.loadUser(userId);
      peersStore.loadByUser(userId);
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
        toast.success("Права обновлены");
      }
    };

    if (store.userHolder.isLoading || !store.userHolder.isReady) {
      return (
        <div className="flex flex-col h-full">
          <PageHeader title="Пользователь" />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    const user = store.user;
    const model = store.userModel;

    if (!user)
      return (
        <div className="p-6 text-[var(--muted-foreground)]">
          Пользователь не найден
        </div>
      );

    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title={model?.displayName ?? "Пользователь"}
          actions={
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
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
              }}
            >
              Удалить пользователя
            </Button>
          }
        />
        <div className="p-4 sm:p-6 flex gap-6 flex-wrap xl:flex-nowrap">
          {/* Sidebar - user info */}
          <div className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-4">
            <Card className="p-4">
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
                    {user.emailVerified
                      ? "Email подтверждён"
                      : "Email не подтверждён"}
                  </Badge>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">
                    {`Зарегистрирован ${new Date(user.createdAt).toLocaleDateString()}`}
                  </span>
                </div>
                {user.profile?.lastOnline && (
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">
                      Последний визит
                    </span>
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
                <TabsTrigger value="privileges">Права</TabsTrigger>
                <TabsTrigger value="peers">VPN пиры</TabsTrigger>
              </TabsList>
              <TabsContent value="privileges">
                <div className="flex flex-col gap-6 mt-4">
                  <Card title="Роль" className="p-5">
                    <Select
                      options={[
                        { value: ERole.Admin, label: "Администратор" },
                        { value: ERole.User, label: "Пользователь" },
                        { value: ERole.Guest, label: "Гость" },
                      ]}
                      value={selectedRole}
                      onValueChange={v =>
                        setSelectedRole((v ?? ERole.User) as ERole)
                      }
                    />
                  </Card>
                  <Card title="Права доступа" className="p-5">
                    <PermissionsEditor
                      value={selectedPerms}
                      onChange={setSelectedPerms}
                    />
                  </Card>
                  <div className="flex justify-end">
                    <Button
                      loading={savingPrivileges}
                      onClick={handleSavePrivileges}
                    >
                      Сохранить права
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="peers">
                <div className="mt-4">
                  <PeersTable
                    data={peersStore.models}
                    columns={peerColumns}
                    loading={peersStore.isLoading}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  },
);
