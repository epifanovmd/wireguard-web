import { EPermissions } from "@api/api-gen/data-contracts";
import { PageHeader, PageLayout } from "@components/layouts";
import { QrCodeModal } from "@components/shared";
import {
  Badge,
  Button,
  CanAccess,
  Card,
  Empty,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Select,
  Table,
  Tooltip,
} from "@components/ui";
import { useNotification } from "@core/notifications";
import { usePermissions } from "@store";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { useServersSelectOptions } from "../../../hooks";
import { PeerForm } from "./components/PeerForm";
import { usePeersListVM } from "./hooks";

export const PeersList: FC = observer(() => {
  const vm = usePeersListVM();
  const serversOptions = useServersSelectOptions();
  const toast = useNotification();
  const { hasPermission } = usePermissions();
  const canViewServers = hasPermission(EPermissions.WgServerView);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <PageLayout
      header={
        <PageHeader
          title="Пиры"
          subtitle={`${vm.total} всего`}
          actions={
            <CanAccess permission={EPermissions.WgPeerManage}>
              <Tooltip content="Добавить пир">
                <IconButton variant="solid" onClick={() => setCreateOpen(true)}>
                  <Plus size={16} strokeWidth={2.5} />
                </IconButton>
              </Tooltip>
            </CanAccess>
          }
        />
      }
      contentClassName="gap-3 sm:gap-6"
    >
      {canViewServers && (
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            fetchOptions={serversOptions.fetchOptions}
            getOption={serversOptions.getOption}
            fetchOnMount
            value={vm.serverId}
            onChange={vm.setServerId}
            placeholder="Выберите сервер"
            className="w-48"
          />
        </div>
      )}

      <Card title="Пиры" extra={<Badge variant="gray">{vm.total} всего</Badge>}>
        <Table
          data={vm.data}
          columns={vm.columns}
          loading={vm.loading}
          refreshing={vm.refreshing}
          getRowId={p => p.data.id}
          onRowClick={vm.handleRowClick}
          empty={<Empty size="sm" icon="inbox" title="Пиры не найдены" />}
        />
      </Card>

      <QrCodeModal
        open={!!vm.qrPeer}
        peerId={vm.qrPeer?.id}
        peerName={vm.qrPeer?.name}
        onClose={() => vm.setQrPeer(null)}
      />

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
              form="peer-form"
              loading={vm.createPeerLoading}
            >
              Создать пир
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
});
