import { observer } from "mobx-react-lite";
import { FC } from "react";

import { formatter } from "~@common";
import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  ServerActions,
  ServerConfigurationCard,
  ServerStatus,
} from "~@components/shared";
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
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~@components/ui";

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

    if (vm.isLoading || !vm.isFilled) {
      return (
        <div className="flex flex-col h-full overflow-hidden">
          <PageHeader title="Сервер" />
          <div className="flex justify-center py-12 overflow-auto">
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
      <div className="flex flex-col h-full overflow-hidden">
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

        <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-auto">
          {/* Status cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Статус"
              value={
                <div className={"flex gap-2"}>
                  <ServerStatus
                    status={vm.effectiveStatus}
                    enabled={server.enabled}
                  />
                </div>
              }
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
                value={formatter.speed(liveStats.rxSpeedBps)}
                subtitle="Загрузка"
                color="info"
              />
              <StatCard
                title="Скорость TX"
                value={formatter.speed(liveStats.txSpeedBps)}
                subtitle="Отдача"
                color="success"
              />
              <StatCard
                title="Всего RX"
                value={formatter.bytes(liveStats.totalRxBytes)}
                subtitle="Загружено"
                color="purple"
              />
              <StatCard
                title="Всего TX"
                value={formatter.bytes(liveStats.totalTxBytes)}
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
                <div className="flex flex-col gap-2">
                  <Table
                    data={peersVM.data}
                    columns={peersVM.columns}
                    loading={peersVM.loading}
                    getRowId={p => p.data.id}
                    onRowClick={peersVM.handleRowClick}
                    empty={
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Пиры не найдены
                      </div>
                    }
                  >
                    {/*<Table.Pagination*/}
                    {/*  totalPages={peersVM.totalPages}*/}
                    {/*  currentPage={peersVM.currentPage}*/}
                    {/*  pageSize={peersVM.pageSize}*/}
                    {/*  onPageChange={peersVM.onPageChange}*/}
                    {/*  onPageSizeChange={peersVM.onPageSizeChange}*/}
                    {/*/>*/}
                  </Table>
                </div>
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
                loading={vm.isUpdateLoading}
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
