import { Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { ERole } from "~@api/api-gen/data-contracts";
import { PermissionsEditor } from "~@components/forms";
import { PageHeader, PageLayout } from "~@components/layouts";
import { UserInfoCard } from "~@components/shared";
import { PageLoader } from "~@components/shared/loaders";
import {
  AsyncIconButton,
  Button,
  Card,
  Empty,
  IconButton,
  PageEmpty,
  Select,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~@components/ui";

import { useUserDetailVM } from "./hooks";

interface UserDetailProps {
  userId: string;
  onBack: () => void;
}

export const UserDetail: FC<UserDetailProps> = observer(
  ({ userId, onBack }) => {
    const vm = useUserDetailVM({ userId, onBack });

    return (
      <PageLayout
        header={
          <PageHeader
            title={vm.model?.displayName ?? "Пользователь"}
            subtitle="Просмотр и редактирование прав"
            actions={
              vm.canManage &&
              !vm.isLoading &&
              vm.user && (
                <AsyncIconButton
                  variant={"destructive"}
                  onClick={vm.handleDeleteUser}
                >
                  <Trash2 size={15} />
                </AsyncIconButton>
              )
            }
          />
        }
      >
        {vm.isLoading ? (
          <PageLoader />
        ) : !vm.user ? (
          <PageEmpty icon="question" title="Пользователь не найден" />
        ) : (
          <div className={"flex gap-3 sm:gap-6 flex-wrap xl:flex-nowrap"}>
            {/* Sidebar - user info */}
            <div className="w-full xl:w-64 flex-shrink-0">
              <UserInfoCard
                displayName={vm.model?.displayName ?? "?"}
                login={vm.model?.login}
                role={vm.model?.roleLabel}
                emailVerified={vm.model?.emailVerified}
                registeredAt={vm.model?.createdAt}
                lastOnline={vm.model?.lastOnline}
              />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <Tabs defaultValue={vm.canManage ? "privileges" : "peers"}>
                <TabsList>
                  {vm.canManage && (
                    <TabsTrigger value="privileges">Права</TabsTrigger>
                  )}
                  <TabsTrigger value="peers">VPN пиры</TabsTrigger>
                </TabsList>

                {vm.canManage && (
                  <TabsContent value="privileges">
                    <div className="flex flex-col gap-3 sm:gap-6 mt-3">
                      <Card title="Роль" className="p-5">
                        <Select
                          options={vm.roleOptions}
                          value={vm.selectedRole}
                          onChange={(v: ERole) =>
                            vm.setSelectedRole((v ?? ERole.User) as ERole)
                          }
                        />
                        {vm.selectedRole === ERole.Admin && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Роль Администратор даёт полный доступ ко всему —
                            прямые права не требуются.
                          </p>
                        )}
                      </Card>

                      <Card title="Права доступа" className="p-5">
                        <p className="text-xs text-muted-foreground mb-4">
                          Права с меткой «через роль» унаследованы от роли и не
                          редактируются. Права с меткой «напрямую» назначены
                          этому пользователю персонально.
                        </p>
                        <PermissionsEditor
                          value={vm.directPerms}
                          onChange={vm.setDirectPerms}
                          rolePermissions={vm.rolePermissions}
                          role={vm.selectedRole}
                        />
                      </Card>

                      <div className="flex justify-end">
                        <Button
                          loading={vm.isSavingPrivileges}
                          onClick={vm.handleSavePrivileges}
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
                      data={vm.peers}
                      columns={vm.peerColumns}
                      loading={vm.peersLoading}
                      getRowId={p => p.data.id}
                      empty={
                        <Empty size="sm" icon="inbox" title="Пиры не найдены" />
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </PageLayout>
    );
  },
);
