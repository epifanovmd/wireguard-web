import { Pencil, Power, QrCode, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PeerSpeedChart, PeerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  PeerConfigurationCard,
  PeerStatusBadge,
  QrCodeModal,
} from "~@components/shared";
import {
  Badge,
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
          <PageHeader title="Peer" />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    if (!peer || !model) {
      return (
        <div className="p-6 text-[var(--muted-foreground)]">Peer not found</div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title={peer.name}
          actions={
            <div className="flex items-center gap-1">
              <IconButton
                title="QR / Config"
                variant="ghost"
                size="sm"
                onClick={() => vm.setQrOpen(true)}
              >
                <QrCode size={17} className="text-[#6366f1]" />
              </IconButton>
              <IconButton
                title={peer.enabled ? "Disable" : "Enable"}
                variant="ghost"
                size="sm"
                disabled={vm.toggling}
                onClick={vm.handleToggle}
              >
                <Power
                  size={17}
                  className={peer.enabled ? "text-warning" : "text-success"}
                />
              </IconButton>
              <IconButton
                title="Edit"
                variant="ghost"
                size="sm"
                onClick={() => vm.setEditOpen(true)}
              >
                <Pencil size={17} />
              </IconButton>
              <IconButton
                title="Delete"
                variant="ghost"
                size="sm"
                onClick={vm.handleDelete}
              >
                <Trash2 size={17} className="text-destructive" />
              </IconButton>
            </div>
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
                Connected
              </Badge>
            )}
            {peer.hasPresharedKey && (
              <Badge variant="info" dot>
                PSK enabled
              </Badge>
            )}
            {peer.userId && (
              <Badge variant="purple" dot>
                Assigned
              </Badge>
            )}
            {liveStatus?.endpoint && (
              <Badge variant="default">{liveStatus.endpoint}</Badge>
            )}
            {liveStatus?.lastHandshake && (
              <span className="text-xs text-[var(--muted-foreground)]">
                Last handshake: {liveStatus.lastHandshake}
              </span>
            )}
          </div>

          {/* Live stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Total RX"
              value={formatBytes(liveStats?.rxBytes ?? 0)}
              subtitle="Downloaded"
              color="info"
            />
            <StatCard
              title="Total TX"
              value={formatBytes(liveStats?.txBytes ?? 0)}
              subtitle="Uploaded"
              color="success"
            />
            <StatCard
              title="RX Speed"
              value={formatSpeed(liveStats?.rxSpeedBps ?? 0)}
              subtitle="Download speed"
              color="purple"
            />
            <StatCard
              title="TX Speed"
              value={formatSpeed(liveStats?.txSpeedBps ?? 0)}
              subtitle="Upload speed"
              color="warning"
            />
          </div>

          <Tabs defaultValue="charts">
            <TabsList>
              <TabsTrigger value="charts">Speed / Traffic</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
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
              <ModalTitle>Edit peer</ModalTitle>
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
