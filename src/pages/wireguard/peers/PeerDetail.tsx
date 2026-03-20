import { observer } from "mobx-react-lite";
import { FC } from "react";

import { formatter } from "~@common";
import { PeerSpeedChart, PeerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  PeerActions,
  PeerConfigurationCard,
  PeerStatus,
  QrCodeModal,
} from "~@components/shared";
import {
  Badge,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Spinner,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~@components/ui";

import { PeerForm } from "./components/PeerForm";
import { usePeerDetailVM } from "./hooks";

interface PeerDetailProps {
  peerId: string;
  onBack: () => void;
}

export const PeerDetail: FC<PeerDetailProps> = observer(
  ({ peerId, onBack }) => {
    const vm = usePeerDetailVM(peerId, onBack);
    const { peer, model, liveStats, liveStatus, liveActive } = vm;

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
      return (
        <div className="p-6 text-muted-foreground">Пир не найден</div>
      );
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
          <div className="flex items-center gap-3 flex-wrap">
            <PeerStatus
              status={liveStatus?.status ?? peer.status}
              enabled={peer.enabled}
            />
            {liveActive?.lastHandshake &&
              Date.now() - new Date(liveActive.lastHandshake).getTime() <
                3 * 60 * 1000 && (
                <Badge variant="success" dot>
                  Подключён
                </Badge>
              )}
            {peer.hasPresharedKey && (
              <Badge variant="info" dot>
                PSK включён
              </Badge>
            )}
            {peer.userId && (
              <Badge variant="purple" dot>
                Назначен
              </Badge>
            )}
            {liveActive?.lastHandshake && (
              <span className="text-xs text-muted-foreground">
                {`Последнее рукопожатие:${formatter.date.format(liveActive?.lastHandshake)}`}
              </span>
            )}
          </div>

          {/* Live stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Всего RX"
              value={formatter.bytes(liveStats?.rxBytes ?? 0)}
              subtitle="Загружено"
              color="info"
            />
            <StatCard
              title="Всего TX"
              value={formatter.bytes(liveStats?.txBytes ?? 0)}
              subtitle="Отдано"
              color="success"
            />
            <StatCard
              title="Скорость RX"
              value={formatter.speed(liveStats?.rxSpeedBps ?? 0)}
              subtitle="Загрузка"
              color="purple"
            />
            <StatCard
              title="Скорость TX"
              value={formatter.speed(liveStats?.txSpeedBps ?? 0)}
              subtitle="Отдача"
              color="warning"
            />
          </div>

          <Tabs defaultValue="charts">
            <TabsList>
              <TabsTrigger value="charts">Скорость / Трафик</TabsTrigger>
              <TabsTrigger value="config">Конфигурация</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className={"flex flex-col gap-4"}>
              <PeerSpeedChart points={vm.speedPoints} />
              <PeerTrafficChart points={vm.trafficPoints} />
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
                loading={vm.isUpdateLoading}
                onCancel={() => vm.setEditOpen(false)}
                onSubmit={vm.handleUpdate}
              />
            </ModalBody>
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
