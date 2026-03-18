import { observer } from "mobx-react-lite";
import { FC } from "react";

import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  ServerActions,
  ServerConfigurationCard,
  ServerStatusBadge,
} from "~@components/shared";
import { PeersTable } from "~@components/tables/peers";
import {
  Badge,
  Card,
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
import { ServerForm } from "./components/ServerForm";
import { useServerDetailVM } from "./hooks";

interface ServerDetailProps {
  serverId: string;
  onBack: () => void;
}

export const ServerDetail: FC<ServerDetailProps> = observer(
  ({ serverId, onBack }) => {
    const vm = useServerDetailVM(serverId, onBack);
    const { server, liveStats, peersVM } = vm;

    if (vm.isLoading || !vm.isReady) {
      return (
        <div className="flex flex-col h-full">
          <PageHeader title="Сервер" />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    if (!server) {
      return (
        <div className="p-6 text-[var(--muted-foreground)]">
          Сервер не найден
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title={server.name}
          actions={
            <ServerActions
              status={vm.effectiveStatus}
              size="sm"
              onEdit={() => vm.setEditOpen(true)}
              onStart={() => vm.handleAction("start")}
              onStop={() => vm.handleAction("stop")}
              onRestart={() => vm.handleAction("restart")}
            />
          }
        />

        <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Status cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Статус"
              value={<ServerStatusBadge status={vm.effectiveStatus} />}
            />
            <StatCard title="Интерфейс" value={server.interface} />

            <StatCard title="Всего пиров" value={vm.peerCount ?? "—"} />

            <StatCard
              title="Активных пиров"
              value={vm.activePeerCount ?? "—"}
            />
          </div>

          {/* Live speed stat cards */}
          {liveStats && (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Скорость RX"
                value={formatSpeed(liveStats.rxSpeedBps)}
                subtitle="Загрузка"
                color="info"
              />
              <StatCard
                title="Скорость TX"
                value={formatSpeed(liveStats.txSpeedBps)}
                subtitle="Отдача"
                color="success"
              />
              <StatCard
                title="Всего RX"
                value={formatBytes(liveStats.totalRxBytes)}
                subtitle="Загружено"
                color="purple"
              />
              <StatCard
                title="Всего TX"
                value={formatBytes(liveStats.totalTxBytes)}
                subtitle="Отдано"
                color="warning"
              />
            </div>
          )}

          <Tabs defaultValue="charts">
            <TabsList>
              <TabsTrigger value="charts">Скорость / Трафик</TabsTrigger>
              <TabsTrigger value="config">Конфигурация</TabsTrigger>
              <TabsTrigger value="peers">Пиры</TabsTrigger>
            </TabsList>
            <TabsContent value="charts" className={"flex flex-col gap-4"}>
              <ServerSpeedChart points={vm.speedPoints} />
              <ServerTrafficChart points={vm.trafficPoints} />
            </TabsContent>
            <TabsContent value="config">
              <ServerConfigurationCard server={server} />
            </TabsContent>
            <TabsContent value="peers">
              <Card
                title="Пиры"
                extra={<Badge variant="gray">{peersVM.total} всего</Badge>}
              >
                <PeersTable
                  data={peersVM.data}
                  columns={peersVM.columns}
                  loading={peersVM.loading}
                  onRowClick={peersVM.handleRowClick}
                />
              </Card>
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
              <ModalTitle>Редактировать сервер</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <ServerForm
                isEdit
                defaultValues={server}
                onCancel={() => vm.setEditOpen(false)}
                onSubmit={vm.handleUpdate}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  },
);
