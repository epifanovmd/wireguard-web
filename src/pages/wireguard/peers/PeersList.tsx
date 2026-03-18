import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { PageHeader } from "~@components/layouts";
import { QrCodeModal } from "~@components/shared";
import { PeersTable } from "~@components/tables/peers";
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

import { PeerForm } from "./components/PeerForm";
import { usePeersListVM } from "./hooks";

export const PeersList: FC = observer(() => {
  const vm = usePeersListVM();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Peers"
        subtitle={`${vm.total} total`}
        actions={<Button onClick={() => setCreateOpen(true)}>Add peer</Button>}
      />

      <div className="p-4 sm:p-6 flex flex-col gap-4">
        <Card
          title="Peers"
          extra={<Badge variant="gray">{vm.total} total</Badge>}
        >
          <PeersTable
            data={vm.data}
            columns={vm.columns}
            loading={vm.loading}
            onRowClick={vm.handleRowClick}
          />
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
            <ModalTitle>Add peer</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <PeerForm
              servers={vm.servers.map(s => s.data)}
              selectedServerId={vm.servers[0]?.data.id}
              onCancel={() => setCreateOpen(false)}
              onSubmit={async (data, serverId) => {
                if (!serverId) {
                  toast.error("Select a server");
                  return;
                }
                const res = await vm.createPeer(serverId, data);

                if (res.error) toast.error(res.error.message);
                else {
                  toast.success("Peer created");
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
