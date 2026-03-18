import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { PageHeader } from "~@components/layouts";
import { UsersTable } from "~@components/tables/users";
import { Badge, Button, Card, Input } from "~@components/ui2";

import { CreateUserModal } from "./CreateUserModal";
import { useUsersListVM } from "./hooks";

export const UsersList: FC = observer(() => {
  const vm = useUsersListVM();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Пользователи"
        subtitle={`${vm.total} всего`}
        actions={<Button onClick={() => setCreateOpen(true)}>Добавить пользователя</Button>}
      />

      <div className="p-4 sm:p-6 flex flex-col gap-4">
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
            manualPagination
            paginationState={vm.paginationState}
            onPaginationChange={vm.onPaginationChange}
            pageCount={vm.pageCount}
            onRowClick={vm.handleRowClick}
          />
        </Card>
      </div>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          vm.createUser().then();
        }}
      />
    </div>
  );
});
