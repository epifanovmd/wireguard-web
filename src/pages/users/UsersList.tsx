import { Plus, Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { PageHeader, PageLayout } from "~@components/layouts";
import { UsersTable } from "~@components/tables/users";
import { Badge, Card, IconButton, Input, Tooltip } from "~@components/ui";
import { usePermissions } from "~@store";

import { CreateUserModal } from "./CreateUserModal";
import { useUsersListVM } from "./hooks";

export const UsersList: FC = observer(() => {
  const vm = useUsersListVM();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(EPermissions.UserManage);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <PageLayout
      header={
        <PageHeader
          title="Пользователи"
          subtitle={`${vm.total} всего`}
          actions={
            canManage && (
              <Tooltip content="Добавить пользователя">
                <IconButton
                  variant="solid"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </IconButton>
              </Tooltip>
            )
          }
        />
      }
      contentClassName="flex flex-col gap-4"
    >
      <Card
        title="Пользователи"
        extra={<Badge variant="gray">{vm.total} всего</Badge>}
      >
        <div className="mb-4">
          <Input
            placeholder="Поиск по имени или email..."
            value={vm.search}
            onChange={e => vm.setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>

        <UsersTable
          data={vm.data}
          columns={vm.columns}
          loading={vm.loading}
          onRowClick={vm.handleRowClick}
        />
      </Card>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          vm.createUser().then();
        }}
      />
    </PageLayout>
  );
});
