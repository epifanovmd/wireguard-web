import { EPermissions } from "@api/api-gen/data-contracts";
import { PageHeader, PageLayout } from "@components/layouts";
import { ServersTable } from "@components/tables/servers";
import {
  Badge,
  Button,
  CanAccess,
  Card,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Tooltip,
} from "@components/ui";
import { useNotification } from "@core/notifications";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { ServerForm } from "./components/ServerForm";
import { useServersListVM } from "./hooks";

export const ServersList: FC = observer(() => {
  const vm = useServersListVM();
  const toast = useNotification();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <PageLayout
      header={
        <PageHeader
          title="Серверы"
          subtitle={`${vm.total} всего`}
          actions={
            <CanAccess permission={EPermissions.WgServerManage}>
              <Tooltip content="Добавить сервер">
                <IconButton variant="solid" onClick={() => setCreateOpen(true)}>
                  <Plus size={16} strokeWidth={2.5} />
                </IconButton>
              </Tooltip>
            </CanAccess>
          }
        />
      }
    >
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
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              form="server-form"
              loading={vm.createServerLoading}
            >
              Создать сервер
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
});
