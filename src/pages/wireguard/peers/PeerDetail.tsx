import { Pencil, Power, QrCode, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Button,
  Card,
  CopyableText,
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
  useConfirm,
  useToast,
} from "~@components/ui2";
import { usePeersDataStore, useStatsDataStore } from "~@store";

import { useWgPeer } from "../../../socket";
import { formatBytes, formatSpeed } from "../../dashboard/dashboard.helpers";
import { PeerForm } from "./components/PeerForm";
import { PeerStatusBadge } from "./components/PeerStatusBadge";
import { QrCodeModal } from "./components/QrCodeModal";

interface PeerDetailProps {
  peerId: string;
  onBack: () => void;
}

export const PeerDetail: FC<PeerDetailProps> = observer(
  ({ peerId, onBack }) => {
    const store = usePeersDataStore();
    const stats = useStatsDataStore();
    const confirm = useConfirm();
    const toast = useToast();
    const [editOpen, setEditOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [toggling, setToggling] = useState(false);
    const { stats: liveStats, status: liveStatus } = useWgPeer(peerId);
    const [liveSpeedPoints, setLiveSpeedPoints] = useState<
      { t: string; rx: number; tx: number }[]
    >([]);

    useEffect(() => {
      store.loadPeer(peerId);
      stats.loadPeerStats(peerId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [peerId]);

    useEffect(() => {
      if (!liveStats) return;
      const t = new Date().toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLiveSpeedPoints(prev => [
        ...prev.slice(-59),
        { t, rx: liveStats.rxSpeedBps, tx: liveStats.txSpeedBps },
      ]);
    }, [liveStats]);

    const peer = store.peer;
    const model = store.peerModel;

    if (store.peerHolder.isLoading || !store.peerHolder.isReady) {
      return (
        <div className="flex flex-col h-full">
          <PageHeader title="Peer" />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    if (!peer || !model)
      return (
        <div className="p-6 text-[var(--muted-foreground)]">Peer not found</div>
      );

    const handleToggle = async () => {
      setToggling(true);
      const res = peer.enabled
        ? await store.disablePeer(peerId)
        : await store.enablePeer(peerId);
      setToggling(false);
      if (res.error) toast.error(res.error.message);
    };

    const trafficData = (stats.peerStats?.traffic ?? []).map(t => ({
      time: new Date(t.timestamp).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      rx: t.rxBytes,
      tx: t.txBytes,
    }));

    const speedData = (stats.peerStats?.speed ?? []).map(s => ({
      time: new Date(s.timestamp).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      rx: s.rxSpeedBps,
      tx: s.txSpeedBps,
    }));

    const latest = stats.peerStats?.latest;

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
                onClick={() => setQrOpen(true)}
              >
                <QrCode size={17} className="text-[#6366f1]" />
              </IconButton>
              <IconButton
                title={peer.enabled ? "Disable" : "Enable"}
                variant="ghost"
                size="sm"
                disabled={toggling}
                onClick={handleToggle}
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
                onClick={() => setEditOpen(true)}
              >
                <Pencil size={17} />
              </IconButton>
              <IconButton
                title="Delete"
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const ok = await confirm({
                    title: "Delete peer",
                    message: "Delete this peer permanently?",
                    variant: "danger",
                  });
                  if (!ok) return;
                  const res = await store.deletePeer(peerId);
                  if (res.error) toast.error(res.error.message);
                  else {
                    toast.success("Peer deleted");
                    onBack();
                  }
                }}
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
                Last handshake:{" "}
                {new Date(liveStatus.lastHandshake).toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Live stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Total RX"
              value={formatBytes(liveStats?.rxBytes ?? latest?.rxBytes ?? 0)}
              subtitle="Downloaded"
              color="info"
            />
            <StatCard
              title="Total TX"
              value={formatBytes(liveStats?.txBytes ?? latest?.txBytes ?? 0)}
              subtitle="Uploaded"
              color="success"
            />
            <StatCard
              title="RX Speed"
              value={formatSpeed(
                liveStats?.rxSpeedBps ?? latest?.rxSpeedBps ?? 0,
              )}
              subtitle="Download speed"
              color="purple"
            />
            <StatCard
              title="TX Speed"
              value={formatSpeed(
                liveStats?.txSpeedBps ?? latest?.txSpeedBps ?? 0,
              )}
              subtitle="Upload speed"
              color="warning"
            />
          </div>

          <Tabs defaultValue="live">
            <TabsList>
              <TabsTrigger value="live">Live speed</TabsTrigger>
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="live">
              <Card
                title="Live speed"
                description="Real-time RX / TX"
                className="mt-2 p-5"
              >
                <div className="h-48">
                  <ResponsiveContainer width="100%" height={192}>
                    <LineChart data={liveSpeedPoints}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="t"
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        tickFormatter={v => formatSpeed(v)}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v: number, name: string) => [
                          formatSpeed(v),
                          name === "rx" ? "Download" : "Upload",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="rx"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                        name="rx"
                      />
                      <Line
                        type="monotone"
                        dataKey="tx"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        name="tx"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <span className="w-3 h-0.5 bg-[#6366f1] inline-block" />{" "}
                    Download
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <span className="w-3 h-0.5 bg-[#22c55e] inline-block" />{" "}
                    Upload
                  </span>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="traffic">
              <div className="flex flex-col gap-4 mt-2">
                <Card title="Traffic history" className="p-5">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height={192}>
                      <AreaChart data={trafficData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="time"
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                          tickFormatter={v => formatBytes(v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(v: number, name: string) => [
                            formatBytes(v),
                            name === "rx" ? "Download" : "Upload",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="rx"
                          stroke="#6366f1"
                          fill="#6366f120"
                          strokeWidth={2}
                          name="rx"
                        />
                        <Area
                          type="monotone"
                          dataKey="tx"
                          stroke="#22c55e"
                          fill="#22c55e20"
                          strokeWidth={2}
                          name="tx"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card title="Speed history" className="p-5">
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={speedData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="time"
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fill: "var(--muted-foreground)",
                          }}
                          tickFormatter={v => formatSpeed(v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(v: number, name: string) => [
                            formatSpeed(v),
                            name === "rx" ? "Download" : "Upload",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="rx"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={false}
                          name="rx"
                        />
                        <Line
                          type="monotone"
                          dataKey="tx"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={false}
                          name="tx"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="config">
              <Card title="Peer configuration" className="mt-2 p-5">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {[
                    ["Allowed IPs", peer.allowedIPs],
                    ["Client IPs", peer.clientAllowedIPs],
                    ["Endpoint", peer.endpoint ?? "—"],
                    [
                      "Keepalive",
                      peer.persistentKeepalive
                        ? `${peer.persistentKeepalive}s`
                        : "—",
                    ],
                    ["DNS", peer.dns ?? "—"],
                    ["MTU", peer.mtu ? String(peer.mtu) : "—"],
                    ["PSK", peer.hasPresharedKey ? "Yes" : "No"],
                    ["Expires", model.expiresAtFormatted ?? "Never"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-[var(--muted-foreground)]">
                        {k}
                      </dt>
                      <dd className="font-medium text-[var(--foreground)] mt-0.5">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">
                    Public Key
                  </p>
                  <CopyableText
                    text={peer.publicKey}
                    truncate={false}
                    className="text-[var(--muted-foreground)]"
                  />
                </div>
                {peer.hasPresharedKey && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const res = await store.rotatePsk(peerId);
                        if (res.error) toast.error(res.error.message);
                        else toast.success("PSK rotated");
                      }}
                    >
                      Rotate PSK
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        const res = await store.removePsk(peerId);
                        if (res.error) toast.error(res.error.message);
                        else toast.success("PSK removed");
                      }}
                    >
                      Remove PSK
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Modal
          open={editOpen}
          onOpenChange={open => !open && setEditOpen(false)}
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
                onCancel={() => setEditOpen(false)}
                onSubmit={async data => {
                  const res = await store.updatePeer(peerId, data as any);
                  if (res.error) toast.error(res.error.message);
                  else {
                    toast.success("Peer updated");
                    setEditOpen(false);
                  }
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <QrCodeModal
          open={qrOpen}
          peerId={peerId}
          peerName={peer.name}
          onClose={() => setQrOpen(false)}
        />
      </div>
    );
  },
);
