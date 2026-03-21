import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { PageHeader } from "~@components/layouts";
import { ServersTable } from "~@components/tables/servers";
import {
  Badge,
  Card,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Tooltip,
} from "~@components/ui";
import { useNotification } from "~@core/notifications";

import { ServerForm } from "./components/ServerForm";
import { useServersListVM } from "./hooks";

export const ServersList: FC = observer(() => {
  const vm = useServersListVM();
  const toast = useNotification();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Серверы"
        subtitle={`${vm.total} всего`}
        actions={
          <Tooltip content="Добавить сервер">
            <IconButton
              variant="solid"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={16} strokeWidth={2.5} />
            </IconButton>
          </Tooltip>
        }
      />

      <div className="p-4 sm:p-6 overflow-auto">
        <Card
          title="Серверы"
          extra={<Badge variant="gray">{vm.total} всего</Badge>}
        >
          <ServersTable
            data={vm.data}
            columns={vm.columns}
            loading={vm.loading}
            onRowClick={vm.handleRowClick}
          />
        </Card>
      </div>

      <Modal
        open={createOpen}
        onOpenChange={open => !open && setCreateOpen(false)}
      >
        <ModalOverlay />
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>Добавить сервер</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ServerForm
              loading={vm.createServerLoading}
              onCancel={() => setCreateOpen(false)}
              onSubmit={async data => {
                const res = await vm.createServer(data);

                if (res.error) {
                  toast.error(res.error.message);
                } else {
                  toast.success("Сервер создан");
                  setCreateOpen(false);
                }
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
});
