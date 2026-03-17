import { useNavigate } from "@tanstack/react-router";
import { Download, Server, Upload, Zap } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { EWgServerStatus, WgServerDto } from "~@api/api-gen/data-contracts";
import { OverviewSpeedChart } from "~@components/charts";
import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Card,
  type ColumnDef,
  Spinner,
  StatCard,
  Table,
} from "~@components/ui2";
import { useOverviewStatsStore, useServersDataStore } from "~@store";

import { formatSpeed } from "./dashboard.helpers";

function ServerStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: any; label: string }> = {
    up: { variant: "success", label: "Up" },
    down: { variant: "gray", label: "Down" },
    error: { variant: "danger", label: "Error" },
    unknown: { variant: "default", label: "Unknown" },
  };
  const cfg = map[status] ?? map.unknown;
  return (
    <Badge variant={cfg.variant} dot>
      {cfg.label}
    </Badge>
  );
}

const serverColumns: ColumnDef<WgServerDto>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-[var(--foreground)]">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "interface",
    header: "Interface",
    cell: ({ row }) => (
      <span className="font-mono text-[var(--muted-foreground)] text-xs">
        {row.original.interface}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ServerStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "listenPort",
    header: "Port",
    cell: ({ row }) => (
      <span className="text-[var(--muted-foreground)]">
        {row.original.listenPort}
      </span>
    ),
  },
  {
    accessorKey: "endpoint",
    header: "Endpoint",
    cell: ({ row }) => (
      <span className="text-[var(--muted-foreground)] text-xs">
        {row.original.endpoint ?? "—"}
      </span>
    ),
  },
];

export const Dashboard: FC = observer(() => {
  const servers = useServersDataStore();
  const overview = useOverviewStatsStore();
  const navigate = useNavigate();

  useEffect(() => {
    servers.loadServers().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeServers = servers.servers.filter(
    s => s.status === EWgServerStatus.Up,
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" subtitle="WireGuard VPN overview" />
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total servers"
            value={servers.total}
            subtitle={`${activeServers.length} active`}
            color="info"
            icon={<Server size={20} />}
          />
          <StatCard
            title="Total peers"
            value={overview.stats?.totalPeers ?? 0}
            subtitle={`${overview.stats?.activePeers ?? 0} active`}
            color="success"
            icon={<Zap size={20} />}
          />
          <StatCard
            title="RX Speed"
            value={formatSpeed(overview.stats?.rxSpeedBps ?? 0)}
            subtitle="Download speed"
            color="purple"
            icon={<Download size={20} />}
          />
          <StatCard
            title="TX Speed"
            value={formatSpeed(overview.stats?.txSpeedBps ?? 0)}
            subtitle="Upload speed"
            color="warning"
            icon={<Upload size={20} />}
          />
        </div>

        {/* Live speed chart */}
        <OverviewSpeedChart />

        {/* Servers table */}
        <Card
          title="Servers"
          extra={
            <Badge variant={activeServers.length > 0 ? "success" : "gray"} dot>
              {activeServers.length} / {servers.total} active
            </Badge>
          }
        >
          {servers.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <Table
              columns={serverColumns}
              data={servers.servers}
              getRowId={s => s.id}
              empty={
                <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
                  No servers configured
                </div>
              }
              onRowClick={s =>
                navigate({
                  to: "/wireguard/servers/$serverId",
                  params: { serverId: s.id },
                })
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
});
