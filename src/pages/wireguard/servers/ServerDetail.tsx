import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Button,
  Card,
  Drawer,
  PageHeader,
  Spinner,
  Tabs,
  useToast,
} from "~@components";
import { useServersDataStore, useStatsDataStore } from "~@store";

import { formatBytes } from "../../dashboard";
import { ServerForm } from "./components/ServerForm";
import { ServerStatusBadge } from "./components/ServerStatusBadge";

interface ServerDetailProps {
  serverId: string;
  onBack: () => void;
}

export const ServerDetail: FC<ServerDetailProps> = observer(({ serverId }) => {
  const store = useServersDataStore();
  const stats = useStatsDataStore();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    store.loadServer(serverId).then();
    store.loadServerStatus(serverId).then();
    stats.loadServerStats(serverId).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  const server = store.server;
  const liveStatus = store.liveStatus;

  if (store.isLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Server"
          breadcrumbs={[
            { label: "Servers", href: "/wireguard/servers" },
            { label: "..." },
          ]}
        />
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!server)
    return <div className="p-6 text-[var(--text-muted)]">Server not found</div>;

  const handleAction = async (action: "start" | "stop" | "restart") => {
    setActionLoading(action);
    let res;
    if (action === "start") res = await store.startServer(serverId);
    else if (action === "stop") res = await store.stopServer(serverId);
    else res = await store.restartServer(serverId);
    setActionLoading("");
    if (res?.error) toast.error(res.error.message);
  };

  const trafficData = (stats.serverStats?.traffic ?? []).map(t => ({
    time: new Date(t.timestamp).toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    rx: t.rxBytes,
    tx: t.txBytes,
  }));

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={server.name}
        breadcrumbs={[
          { label: "Servers", href: "/wireguard/servers" },
          { label: server.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="secondary"
              loading={actionLoading === "start"}
              onClick={() => handleAction("start")}
              disabled={server.status === "up"}
            >
              Start
            </Button>
            <Button
              size="sm"
              variant="secondary"
              loading={actionLoading === "stop"}
              onClick={() => handleAction("stop")}
              disabled={server.status === "down"}
            >
              Stop
            </Button>
            <Button
              size="sm"
              variant="secondary"
              loading={actionLoading === "restart"}
              onClick={() => handleAction("restart")}
            >
              Restart
            </Button>
          </div>
        }
      />

      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Status cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <Card padding="md">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Status
            </p>
            <ServerStatusBadge status={server.status} />
          </Card>
          <Card padding="md">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Interface
            </p>
            <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
              {server.interface}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Total peers
            </p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {liveStatus?.peerCount ?? "—"}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Active peers
            </p>
            <p className="text-2xl font-bold text-green-500">
              {liveStatus?.activePeerCount ?? "—"}
            </p>
          </Card>
        </div>

        <Tabs
          items={[
            {
              key: "overview",
              label: "Traffic",
              children: (
                <Card title="Traffic history (24h)">
                  <div className="h-56">
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
              ),
            },
            {
              key: "config",
              label: "Configuration",
              children: (
                <Card title="Server configuration" padding="md">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {[
                      ["Interface", server.interface],
                      ["Listen port", String(server.listenPort)],
                      ["Address", server.address],
                      ["Endpoint", server.endpoint ?? "—"],
                      ["DNS", server.dns ?? "—"],
                      ["MTU", server.mtu ? String(server.mtu) : "—"],
                      ["Status", server.status],
                      ["Enabled", server.enabled ? "Yes" : "No"],
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
                  {server.publicKey && (
                    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        Public Key
                      </p>
                      <p className="font-mono text-xs text-[var(--text-secondary)] break-all">
                        {server.publicKey}
                      </p>
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
        title="Edit server"
      >
        <ServerForm
          isEdit
          defaultValues={server}
          onCancel={() => setEditOpen(false)}
          onSubmit={async data => {
            const res = await store.updateServer(serverId, data as any);
            if (res.error) {
              toast.error(res.error.message);
            } else {
              toast.success("Server updated");
              setEditOpen(false);
            }
          }}
        />
      </Drawer>
    </div>
  );
});
