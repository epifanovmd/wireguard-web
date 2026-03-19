import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { PageHeader } from "~@components/layouts";
import { QrCodeModal } from "~@components/shared";
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
  Select,
  Table,
  useToast,
} from "~@components/ui2";

import { PeerForm } from "./components/PeerForm";
import { usePeersListVM } from "./hooks";

export const PeersList: FC = observer(() => {
  const vm = usePeersListVM();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Пиры"
        subtitle={`${vm.total} всего`}
        actions={
          <Button onClick={() => setCreateOpen(true)}>Добавить пир</Button>
        }
      />

      <div className="flex flex-col p-4 sm:p-6 gap-6 overflow-auto">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            options={vm.servers.map(s => ({
              value: s.data.id,
              label: s.name,
            }))}
            loading={vm.isLoadingServers}
            value={vm.serverId}
            onValueChange={vm.setServerId}
            placeholder="Выберите сервер"
            triggerClassName="w-48"
          />
        </div>

        <Card
          title="Пиры"
          extra={<Badge variant="gray">{vm.total} всего</Badge>}
        >
          <Table
            data={vm.data}
            columns={vm.columns}
            loading={vm.loading}
            refreshing={vm.refreshing}
            getRowId={p => p.data.id}
            onRowClick={vm.handleRowClick}
            empty={
              <div className="text-center py-8 text-muted-foreground text-sm">
                Пиры не найдены
              </div>
            }
          >
            {/*<Table.Pagination*/}
            {/*  totalPages={vm.totalPages}*/}
            {/*  currentPage={vm.currentPage}*/}
            {/*  pageSize={vm.pageSize}*/}
            {/*  onPageChange={vm.onPageChange}*/}
            {/*  onPageSizeChange={vm.onPageSizeChange}*/}
            {/*/>*/}
          </Table>
        </Card>
      </div>

      {vm.qrPeer && (
        <QrCodeModal
          open
          peerId={vm.qrPeer.id}
          peerName={vm.qrPeer.name}
          onClose={() => vm.setQrPeer(null)}
        />
      )}

      <Modal
        open={createOpen}
        onOpenChange={open => !open && setCreateOpen(false)}
      >
        <ModalOverlay />
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>Добавить пир</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <PeerForm
              servers={vm.servers.map(s => s.data)}
              selectedServerId={vm.servers[0]?.data.id}
              onCancel={() => setCreateOpen(false)}
              onSubmit={async (data, serverId) => {
                if (!serverId) {
                  toast.error("Выберите сервер");
                  return;
                }
                const res = await vm.createPeer(serverId, data);

                if (res.error) toast.error(res.error.message);
                else {
                  toast.success("Пир создан");
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
