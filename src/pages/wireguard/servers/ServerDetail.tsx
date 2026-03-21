import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PageHeader } from "~@components/layouts";
import {
  QrCodeModal,
  ServerActions,
  ServerConfigurationCard,
  ServerStatus,
} from "~@components/shared";
import {
  Badge,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
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
import { ServerLiveCharts } from "./components/ServerLiveCharts";
import { ServerLiveStatCards } from "./components/ServerLiveStatCards";
import { useServerDetailVM } from "./hooks";

interface ServerDetailProps {
  serverId: string;
  onBack: () => void;
}

export const ServerDetail: FC<ServerDetailProps> = observer(({ serverId }) => {
  const vm = useServerDetailVM(serverId);
  const { server, peersVM } = vm;

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
    return <div className="p-6 text-muted-foreground">Сервер не найден</div>;
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
          <StatCard title="Активных пиров" value={vm.activePeerCount ?? "—"} />
        </div>

        {/* Live speed stat cards */}
        <ServerLiveStatCards />

        <Tabs defaultValue="charts">
          <TabsList>
            <TabsTrigger value="charts">Скорость / Трафик</TabsTrigger>
            <TabsTrigger value="config">Конфигурация</TabsTrigger>
            <TabsTrigger value="peers">Пиры</TabsTrigger>
          </TabsList>
          <TabsContent value="charts" className={"flex flex-col gap-4"}>
            <ServerLiveCharts />
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

      <QrCodeModal
        open={!!vm.peersVM.qrPeer}
        peerId={vm.peersVM.qrPeer?.id}
        peerName={vm.peersVM.qrPeer?.name}
        onClose={() => vm.peersVM.setQrPeer(null)}
      />

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
              form="server-form"
              loading={vm.isUpdateLoading}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
});
