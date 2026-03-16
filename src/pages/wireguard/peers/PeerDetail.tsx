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

import {
  Badge,
  Button,
  Card,
  CopyableText,
  Drawer,
  PageHeader,
  Spinner,
  StatCard,
  Tabs,
  useConfirm,
  useToast,
} from "~@components";
import { usePeersDataStore, useStatsDataStore } from "~@store";

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

    useEffect(() => {
      store.loadPeer(peerId);
      stats.loadPeerStats(peerId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [peerId]);

    const peer = store.peer;
    const model = store.peerModel;

    if (store.peerHolder.isLoading) {
      return (
        <div className="flex flex-col h-full">
          <PageHeader
            title="Peer"
            breadcrumbs={[
              { label: "Peers", href: "/wireguard/peers" },
              { label: "..." },
            ]}
          />
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        </div>
      );
    }

    if (!peer || !model)
      return <div className="p-6 text-[var(--text-muted)]">Peer not found</div>;

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
          breadcrumbs={[
            { label: "Peers", href: "/wireguard/peers" },
            { label: peer.name },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setQrOpen(true)}
              >
                QR / Config
              </Button>
              <Button
                size="sm"
                variant="secondary"
                loading={toggling}
                onClick={handleToggle}
              >
                {peer.enabled ? "Disable" : "Enable"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
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
                Delete
              </Button>
            </div>
          }
        />

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Status strip */}
          <div className="flex items-center gap-3 flex-wrap">
            <PeerStatusBadge
              enabled={peer.enabled}
              isExpired={model.isExpired}
            />
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
          </div>

          {/* Stat cards */}
          {latest && (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Total RX"
                value={formatBytes(latest.rxBytes)}
                subtitle="Downloaded"
                color="info"
              />
              <StatCard
                title="Total TX"
                value={formatBytes(latest.txBytes)}
                subtitle="Uploaded"
                color="success"
              />
              <StatCard
                title="RX Speed"
                value={formatSpeed(latest.rxSpeedBps)}
                subtitle="Download speed"
                color="purple"
              />
              <StatCard
                title="TX Speed"
                value={formatSpeed(latest.txSpeedBps)}
                subtitle="Upload speed"
                color="warning"
              />
            </div>
          )}

          <Tabs
            items={[
              {
                key: "traffic",
                label: "Traffic",
                children: (
                  <div className="flex flex-col gap-4">
                    <Card title="Traffic history">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trafficData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="var(--border-color)"
                            />
                            <XAxis
                              dataKey="time"
                              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                            />
                            <YAxis
                              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                              tickFormatter={v => formatBytes(v)}
                            />
                            <Tooltip
                              contentStyle={{
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border-color)",
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
                    <Card title="Speed history">
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={speedData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="var(--border-color)"
                            />
                            <XAxis
                              dataKey="time"
                              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                            />
                            <YAxis
                              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                              tickFormatter={v => formatSpeed(v)}
                            />
                            <Tooltip
                              contentStyle={{
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border-color)",
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
                ),
              },
              {
                key: "config",
                label: "Configuration",
                children: (
                  <Card title="Peer configuration" padding="md">
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
                          <dt className="text-xs text-[var(--text-muted)]">
                            {k}
                          </dt>
                          <dd className="font-medium text-[var(--text-primary)] mt-0.5">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        Public Key
                      </p>
                      <CopyableText
                        text={peer.publicKey}
                        truncate={false}
                        className="text-[var(--text-secondary)]"
                      />
                    </div>
                    {peer.hasPresharedKey && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
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
                          variant="outline"
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
                ),
              },
            ]}
          />
        </div>

        <Drawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit peer"
        >
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
        </Drawer>

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
