import { useNavigate } from "@tanstack/react-router";
import { Download, Server, Upload, Zap } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useMemo } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";
import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import { ServersTable } from "~@components/tables/servers";
import { serverColumns } from "~@components/tables/servers/serverColumns";
import { StatCard } from "~@components/ui2";
import { ServerModel } from "~@models";
import { useOverviewStatsStore, useServersListStore } from "~@store";

import { formatSpeed } from "./dashboard.helpers";

export const Dashboard: FC = observer(() => {
  const serversStore = useServersListStore();
  const { speedPoints, trafficPoints, stats, subscribe } =
    useOverviewStatsStore();

  const navigate = useNavigate();

  useEffect(() => {
    serversStore.load().then();

    return subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onServerClick = (server: ServerModel) => {
    return navigate({
      to: "/wireguard/servers/$serverId",
      params: { serverId: server.data.id },
    });
  };

  const activeServers = serversStore.listHolder.d.filter(
    s => s.status === EWgServerStatus.Up,
  );

  const columns = useMemo(() => serverColumns, []);

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Дашборд" subtitle="Обзор WireGuard VPN" />
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Серверов"
            value={serversStore.total}
            subtitle={`${activeServers.length} активных`}
            color="info"
            icon={<Server size={20} />}
          />
          <StatCard
            title="Пиров"
            value={stats?.totalPeers ?? 0}
            subtitle={`${stats?.activePeers ?? 0} активных`}
            color="success"
            icon={<Zap size={20} />}
          />
          <StatCard
            title="Скорость RX"
            value={formatSpeed(stats?.rxSpeedBps ?? 0)}
            subtitle="Загрузка"
            color="purple"
            icon={<Download size={20} />}
          />
          <StatCard
            title="Скорость TX"
            value={formatSpeed(stats?.txSpeedBps ?? 0)}
            subtitle="Отдача"
            color="warning"
            icon={<Upload size={20} />}
          />
        </div>

        <ServerSpeedChart title={"Скорость всех серверов"} points={speedPoints} />
        <ServerTrafficChart
          title={"Трафик всех серверов"}
          points={trafficPoints}
        />

        <ServersTable
          data={serversStore.models}
          columns={columns}
          loading={serversStore.isLoading}
          onRowClick={onServerClick}
        />
      </div>
    </div>
  );
});
