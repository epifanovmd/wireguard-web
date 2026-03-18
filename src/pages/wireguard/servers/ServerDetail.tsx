import { Pencil, Play, RotateCcw, Square } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  ServerConfigurationCard,
  ServerStatusBadge,
} from "~@components/shared";
import { PeersTable } from "~@components/tables/peers";
import {
  Badge,
  Card,
  IconButton,
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
          <PageHeader title="Server" />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    if (!server) {
      return (
        <div className="p-6 text-[var(--muted-foreground)]">
          Server not found
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title={server.name}
          actions={
            <div className="flex items-center gap-1">
              <IconButton
                title="Edit"
                variant="ghost"
                size="sm"
                onClick={() => vm.setEditOpen(true)}
              >
                <Pencil size={17} />
              </IconButton>
              <IconButton
                title="Start"
                variant="ghost"
                size="sm"
                disabled={
                  vm.actionLoading === "start" || vm.effectiveStatus === "up"
                }
                onClick={() => vm.handleAction("start")}
              >
                <Play size={17} className="text-success" />
              </IconButton>
              <IconButton
                title="Stop"
                variant="ghost"
                size="sm"
                disabled={
                  vm.actionLoading === "stop" || vm.effectiveStatus === "down"
                }
                onClick={() => vm.handleAction("stop")}
              >
                <Square size={17} className="text-warning" />
              </IconButton>
              <IconButton
                title="Restart"
                variant="ghost"
                size="sm"
                disabled={vm.actionLoading === "restart"}
                onClick={() => vm.handleAction("restart")}
              >
                <RotateCcw size={17} />
              </IconButton>
            </div>
          }
        />

        <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Status cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Status"
              value={<ServerStatusBadge status={vm.effectiveStatus} />}
            />
            <StatCard title="Interface" value={server.interface} />

            <StatCard title="Total peers" value={vm.peerCount ?? "—"} />

            <StatCard title="Active peers" value={vm.activePeerCount ?? "—"} />
          </div>

          {/* Live speed stat cards */}
          {liveStats && (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="RX Speed"
                value={formatSpeed(liveStats.rxSpeedBps)}
                subtitle="Download"
                color="info"
              />
              <StatCard
                title="TX Speed"
                value={formatSpeed(liveStats.txSpeedBps)}
                subtitle="Upload"
                color="success"
              />
              <StatCard
                title="Total RX"
                value={formatBytes(liveStats.totalRxBytes)}
                subtitle="Downloaded"
                color="purple"
              />
              <StatCard
                title="Total TX"
                value={formatBytes(liveStats.totalTxBytes)}
                subtitle="Uploaded"
                color="warning"
              />
            </div>
          )}

          <Tabs defaultValue="charts">
            <TabsList>
              <TabsTrigger value="charts">Speed / Traffic</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="peers">Peers</TabsTrigger>
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
                title="Peers"
                extra={<Badge variant="gray">{peersVM.total} total</Badge>}
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
              <ModalTitle>Edit server</ModalTitle>
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
