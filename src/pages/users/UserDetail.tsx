import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { PageHeader, PageLayout } from "~@components/layouts";
import { UserInfoCard } from "~@components/shared";
import { peerColumns } from "~@components/tables/peers";
import {
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
import { usePeersListStore, useUsersDataStore } from "~@store";

import { PermissionsEditor } from "./components/PermissionsEditor";

interface UserDetailProps {
  userId: string;
  onBack: () => void;
}

export const UserDetail: FC<UserDetailProps> = observer(
  ({ userId, onBack }) => {
    const store = useUsersDataStore();
    const peersStore = usePeersListStore();
    const confirm = useConfirm();
    const toast = useNotification();

    // Роль пользователя (одна — первая из массива)
    const [selectedRole, setSelectedRole] = useState<ERole>(ERole.User);
    // Прямые права (directPermissions) — редактируемые
    const [directPerms, setDirectPerms] = useState<EPermissions[]>([]);

    useEffect(() => {
      store.loadUser(userId);
      peersStore.loadByUser(userId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
      if (store.user) {
        // Берём первую роль из массива (текущая модель предполагает одну роль)
        setSelectedRole((store.user.roles[0]?.name as ERole) ?? ERole.User);
        // Инициализируем прямые права из directPermissions
        setDirectPerms(store.user.directPermissions.map(p => p.name as EPermissions));
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
        <div className="p-6 text-muted-foreground">
          Пользователь не найден
        </div>
      );

    // Права, унаследованные от выбранной роли (для отображения в PermissionsEditor)
    const rolePermissions = user.roles
      .filter(r => r.name === selectedRole)
      .flatMap(r => r.permissions.map(p => p.name as EPermissions));

    return (
      <PageLayout
        header={
          <PageHeader
            title={model?.displayName ?? "Пользователь"}
            actions={
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
                      onChange={(v: ERole) =>
                        setSelectedRole((v ?? ERole.User) as ERole)
                      }
                    />
                    {selectedRole === ERole.Admin && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Роль Администратор даёт полный доступ ко всему — прямые права не требуются.
                      </p>
                    )}
                  </Card>
                  <Card title="Права доступа" className="p-5">
                    <p className="text-xs text-muted-foreground mb-4">
                      Серые права унаследованы от роли и не редактируются. Синие — назначены напрямую этому пользователю.
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
