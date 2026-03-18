import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PeerSpeedChart, PeerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  PeerActions,
  PeerConfigurationCard,
  PeerStatusBadge,
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
} from "~@components/ui2";

import { formatBytes, formatSpeed } from "../../dashboard";
import { PeerForm } from "./components/PeerForm";
import { usePeerDetailVM } from "./hooks";

interface PeerDetailProps {
  peerId: string;
  onBack: () => void;
}

export const PeerDetail: FC<PeerDetailProps> = observer(
  ({ peerId, onBack }) => {
    const vm = usePeerDetailVM(peerId, onBack);
    const { peer, model, liveStats, liveStatus } = vm;

    if (vm.isLoading || !vm.isReady) {
      return (
        <div className="flex flex-col h-full">
          <PageHeader title="Пир" />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    if (!peer || !model) {
      return (
        <div className="p-6 text-[var(--muted-foreground)]">Пир не найден</div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title={peer.name}
          actions={
            <PeerActions
              enabled={peer.enabled}
              size="sm"
              onQr={() => vm.setQrOpen(true)}
              onToggle={vm.handleToggle}
              onEdit={() => vm.setEditOpen(true)}
              onDelete={vm.handleDelete}
            />
          }
        />

        <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Status strip */}
          <div className="flex items-center gap-3 flex-wrap">
            <PeerStatusBadge
              enabled={peer.enabled}
              isExpired={model.isExpired}
            />
            {(liveStatus?.isActive ?? false) && (
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
            {liveStatus?.endpoint && (
              <Badge variant="default">{liveStatus.endpoint}</Badge>
            )}
            {liveStatus?.lastHandshake && (
              <span className="text-xs text-[var(--muted-foreground)]">
                Последнее рукопожатие: {liveStatus.lastHandshake}
              </span>
            )}
          </div>

          {/* Live stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Всего RX"
              value={formatBytes(liveStats?.rxBytes ?? 0)}
              subtitle="Загружено"
              color="info"
            />
            <StatCard
              title="Всего TX"
              value={formatBytes(liveStats?.txBytes ?? 0)}
              subtitle="Отдано"
              color="success"
            />
            <StatCard
              title="Скорость RX"
              value={formatSpeed(liveStats?.rxSpeedBps ?? 0)}
              subtitle="Загрузка"
              color="purple"
            />
            <StatCard
              title="Скорость TX"
              value={formatSpeed(liveStats?.txSpeedBps ?? 0)}
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
