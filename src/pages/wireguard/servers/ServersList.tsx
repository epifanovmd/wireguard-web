import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { PageHeader } from "~@components/layouts";
import { ServersTable } from "~@components/tables/servers";
import {
  Badge,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  useToast,
} from "~@components/ui2";

import { ServerForm } from "./components/ServerForm";
import { useServersListVM } from "./hooks/useServersListVM";

export const ServersList: FC = observer(() => {
  const vm = useServersListVM();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Servers"
        subtitle={`${vm.total} total`}
        actions={
          <Button onClick={() => setCreateOpen(true)}>Add server</Button>
        }
      />

      <div className="p-4 sm:p-6">
        <Card
          title="Servers"
          extra={<Badge variant="gray">{vm.total} total</Badge>}
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
            <ModalTitle>Add server</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ServerForm
              loading={false}
              onCancel={() => setCreateOpen(false)}
              onSubmit={async data => {
                const res = await vm.createServer(data);

                if (res.error) {
                  toast.error(res.error.message);
                } else {
                  toast.success("Server created");
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
