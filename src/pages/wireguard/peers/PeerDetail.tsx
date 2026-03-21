import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PageHeader } from "~@components/layouts";
import {
  PeerActions,
  PeerConfigurationCard,
  QrCodeModal,
} from "~@components/shared";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~@components/ui";

import { PeerForm } from "./components/PeerForm";
import { PeerLiveCharts } from "./components/PeerLiveCharts";
import { PeerLiveStatCards } from "./components/PeerLiveStatCards";
import { PeerLiveStatusStrip } from "./components/PeerLiveStatusStrip";
import { usePeerDetailVM } from "./hooks";

interface PeerDetailProps {
  peerId: string;
  onBack: () => void;
}

export const PeerDetail: FC<PeerDetailProps> = observer(
  ({ peerId, onBack }) => {
    const vm = usePeerDetailVM(peerId, onBack);
    const { peer, model } = vm;

    if (vm.isLoading || !vm.isReady) {
      return (
        <div className="flex flex-col h-full overflow-hidden">
          <PageHeader title="Пир" />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    if (!peer || !model) {
      return <div className="p-6 text-muted-foreground">Пир не найден</div>;
    }

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <PageHeader
          title={peer.name}
          actions={
            <PeerActions
              status={peer.status}
              size="sm"
              onQr={() => vm.setQrOpen(true)}
              onToggle={vm.handleToggle}
              onEdit={() => vm.setEditOpen(true)}
              onDelete={vm.handleDelete}
            />
          }
        />

        <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-auto">
          {/* Status strip */}
          <PeerLiveStatusStrip peer={peer} />

          {/* Live stat cards */}
          <PeerLiveStatCards />

          <Tabs defaultValue="charts">
            <TabsList>
              <TabsTrigger value="charts">Скорость / Трафик</TabsTrigger>
              <TabsTrigger value="config">Конфигурация</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className={"flex flex-col gap-4"}>
              <PeerLiveCharts />
            </TabsContent>

            <TabsContent value="config">
              <PeerConfigurationCard
                peer={model}
                handleRotatePsk={vm.handleRotatePsk}
                handleRemovePsk={vm.handleRemovePsk}
              />
            </TabsContent>
          </Tabs>
        </div>

        <Modal
          open={vm.editOpen}
          onOpenChange={open => !open && vm.setEditOpen(false)}
        >
          <ModalOverlay />
          <ModalContent className="max-w-lg">
            <ModalHeader>
              <ModalTitle>Редактировать пир</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <PeerForm
                isEdit
                defaultValues={peer}
                onSubmit={vm.handleUpdate}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => vm.setEditOpen(false)}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                form="peer-form"
                loading={vm.isUpdateLoading}
              >
                Сохранить
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <QrCodeModal
          open={vm.qrOpen}
          peerId={peerId}
          peerName={peer.name}
          onClose={() => vm.setQrOpen(false)}
        />
      </div>
    );
  },
);
