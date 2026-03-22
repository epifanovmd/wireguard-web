import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { PermissionsEditor } from "~@components/forms";
import { PageHeader, PageLayout } from "~@components/layouts";
import { UserInfoCard } from "~@components/shared";
import { peerColumns as basePeerColumns } from "~@components/tables/peers";
import {
  AsyncButton,
  Button,
  Card,
  Select,
  Spinner,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useConfirm,
} from "~@components/ui";
import { useNotification } from "~@core/notifications";
import { PeerModel } from "~@models";
import {
  usePeerDataStore,
  usePeersListStore,
  usePermissions,
  useUsersDataStore,
} from "~@store";

import { type ColumnDef } from "../../components/ui";
import { useRolesSelectOptions } from "../../hooks/useRolesSelectOptions";

interface UserDetailProps {
  userId: string;
  onBack: () => void;
}

export const UserDetail: FC<UserDetailProps> = observer(
  ({ userId, onBack }) => {
    const store = useUsersDataStore();
    const peersStore = usePeersListStore();
    const peerDataStore = usePeerDataStore();
    const confirm = useConfirm();
    const toast = useNotification();
    const { hasPermission } = usePermissions();
    const canManage = hasPermission(EPermissions.UserManage);

    const revokeColumn: ColumnDef<PeerModel> = {
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
    };

    const peerColumns: ColumnDef<PeerModel>[] = canManage
      ? [...basePeerColumns, revokeColumn]
      : basePeerColumns;

    const { options: roleOptions, getRolePermissions } =
      useRolesSelectOptions();

    // Роль пользователя (одна — первая из массива)
    const [selectedRole, setSelectedRole] = useState<ERole>(ERole.User);
    // Прямые права (directPermissions) — редактируемые
    const [directPerms, setDirectPerms] = useState<EPermissions[]>([]);

    useEffect(() => {
      store.loadUser(userId);
      peersStore.load({ userId });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
      if (store.user) {
        // Берём первую роль из массива (текущая модель предполагает одну роль)
        setSelectedRole((store.user.roles[0]?.name as ERole) ?? ERole.User);
        // Инициализируем прямые права из directPermissions
        setDirectPerms(
          store.user.directPermissions.map(p => p.name as EPermissions),
        );
      }
    }, [store.user]);

    const handleSavePrivileges = async () => {
      const res = await store.setPrivileges(userId, {
        roles: [selectedRole],
        permissions: directPerms,
      });

      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Права обновлены");
      }
    };

    if (store.userHolder.isLoading || !store.userHolder.isReady) {
      return (
        <PageLayout header={<PageHeader title="Пользователь" />}>
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </PageLayout>
      );
    }

    const user = store.user;
    const model = store.userModel;

    if (!user)
      return (
        <div className="p-6 text-muted-foreground">Пользователь не найден</div>
      );

    // Права выбранной роли (с бэкенда, обновляются при смене роли)
    const rolePermissions = getRolePermissions(selectedRole);

    return (
      <PageLayout
        header={
          <PageHeader
            title={model?.displayName ?? "Пользователь"}
            actions={
              canManage && (
                <Button
                  variant="destructive"
                  size="sm"
                  loading={store.deleteUserMutation.isLoading}
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
              )
            }
          />
        }
        contentClassName="flex gap-6 flex-wrap xl:flex-nowrap"
      >
        {/* Sidebar - user info */}
        <div className="w-full xl:w-64 flex-shrink-0">
          <UserInfoCard
            displayName={model?.displayName ?? "?"}
            login={model?.login}
            role={model?.roleLabel}
            emailVerified={model?.emailVerified}
            registeredAt={model?.createdAt}
            lastOnline={model?.lastOnline}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Tabs defaultValue={canManage ? "privileges" : "peers"}>
            <TabsList>
              {canManage && (
                <TabsTrigger value="privileges">Права</TabsTrigger>
              )}
              <TabsTrigger value="peers">VPN пиры</TabsTrigger>
            </TabsList>
            {canManage && (
              <TabsContent value="privileges">
                <div className="flex flex-col gap-6 mt-4">
                  <Card title="Роль" className="p-5">
                    <Select
                      options={roleOptions}
                      value={selectedRole}
                      onChange={(v: ERole) =>
                        setSelectedRole((v ?? ERole.User) as ERole)
                      }
                    />
                    {selectedRole === ERole.Admin && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Роль Администратор даёт полный доступ ко всему — прямые
                        права не требуются.
                      </p>
                    )}
                  </Card>
                  <Card title="Права доступа" className="p-5">
                    <p className="text-xs text-muted-foreground mb-4">
                      Серые права унаследованы от роли и не редактируются.
                      Синие — назначены напрямую этому пользователю.
                    </p>
                    <PermissionsEditor
                      value={directPerms}
                      onChange={setDirectPerms}
                      rolePermissions={rolePermissions}
                      role={selectedRole}
                    />
                  </Card>
                  <div className="flex justify-end">
                    <Button
                      loading={store.setPrivilegesMutation.isLoading}
                      onClick={handleSavePrivileges}
                    >
                      Сохранить права
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
            <TabsContent value="peers">
              <div className="mt-4">
                <Table
                  data={peersStore.models}
                  columns={peerColumns}
                  loading={peersStore.isLoading}
                  getRowId={p => p.data.id}
                  empty={
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Пиры не найдены
                    </div>
                  }
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    );
  },
);
