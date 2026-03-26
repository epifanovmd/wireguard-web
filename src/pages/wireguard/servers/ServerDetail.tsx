import { EPermissions } from "@api/api-gen/data-contracts";
import { PageHeader, PageLayout } from "@components/layouts";
import {
  QrCodeModal,
  ServerActions,
  ServerConfigurationCard,
  ServerStatus,
} from "@components/shared";
import { PageLoader } from "@components/shared/loaders";
import {
  Badge,
  Button,
  Card,
  Empty,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  PageEmpty,
  StatCard,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/ui";
import { usePermissions } from "@store";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { ServerForm } from "./components/ServerForm";
import { ServerLiveCharts } from "./components/ServerLiveCharts";
import { ServerLiveStatCards } from "./components/ServerLiveStatCards";
import { useServerDetailVM } from "./hooks";

interface ServerDetailProps {
  serverId: string;
}

export const ServerDetail: FC<ServerDetailProps> = observer(({ serverId }) => {
  const vm = useServerDetailVM(serverId);
  const { server, peersVM } = vm;
  const { hasPermission } = usePermissions();

  const canManage = hasPermission(EPermissions.WgServerManage);
  const canControl = canManage;
  const canViewStats = hasPermission(EPermissions.WgStatsView);
  const canViewPeers = hasPermission(EPermissions.WgPeerView);

  return (
    <PageLayout
      header={
        <PageHeader
          title={server?.name ?? "Сервер"}
          actions={
            server && (
              <ServerActions
                status={vm.effectiveStatus}
                size="sm"
                canManage={canManage}
                canControl={canControl}
                onEdit={() => vm.setEditOpen(true)}
                onStart={() => vm.handleAction("start")}
                onStop={() => vm.handleAction("stop")}
                onRestart={() => vm.handleAction("restart")}
              />
            )
          }
        />
      }
      contentClassName="gap-3 sm:gap-6"
    >
      {vm.isLoading ? (
        <PageLoader />
      ) : !server ? (
        <PageEmpty icon="question" title="Сервер не найден" />
      ) : (
        <>
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

          {canViewStats && <ServerLiveStatCards />}

          <Tabs defaultValue={canViewStats ? "charts" : "config"}>
            <TabsList>
              {canViewStats && (
                <TabsTrigger value="charts">Скорость / Трафик</TabsTrigger>
              )}
              <TabsTrigger value="config">Конфигурация</TabsTrigger>
              {canViewPeers && <TabsTrigger value="peers">Пиры</TabsTrigger>}
            </TabsList>
            {canViewStats && (
              <TabsContent value="charts" className={"flex flex-col gap-4"}>
                <ServerLiveCharts />
              </TabsContent>
            )}
            <TabsContent value="config">
              <ServerConfigurationCard server={server} />
            </TabsContent>
            {canViewPeers && (
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
                        <Empty size="sm" icon="inbox" title="Пиры не найдены" />
                      }
                    />
                  </div>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <QrCodeModal
            open={!!vm.peersVM.qrPeer}
            peerId={vm.peersVM.qrPeer?.id}
            peerName={vm.peersVM.qrPeer?.name}
            onClose={() => vm.peersVM.setQrPeer(null)}
          />

          {canManage && (
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
          )}
        </>
      )}
    </PageLayout>
  );
});
