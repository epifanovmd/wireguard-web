import { useNavigate } from "@tanstack/react-router";
import { Download, Server, Upload, Zap } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useEffect, useMemo } from "react";

import { EPermissions, EWgServerStatus } from "~@api/api-gen/data-contracts";
import { formatter } from "~@common";
import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { PageHeader, PageLayout } from "~@components/layouts";
import { ServersTable } from "~@components/tables/servers";
import { serverColumns } from "~@components/tables/servers/serverColumns";
import { StatCard } from "~@components/ui";
import { ServerModel } from "~@models";
import {
  useOverviewStatsStore,
  usePermissions,
  useServersListStore,
} from "~@store";

export const Dashboard: FC = observer(() => {
  const serversStore = useServersListStore();
  const overviewStatsStore = useOverviewStatsStore();
  const { hasPermission } = usePermissions();

  const navigate = useNavigate();

  const canViewStats = hasPermission(EPermissions.WgStatsView);
  const canViewServers = hasPermission(EPermissions.WgServerView);

  useEffect(() => {
    if (canViewServers) {
      serversStore.load().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canViewStats) return;

    return overviewStatsStore.subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onServerClick = useCallback(
    (server: ServerModel) => {
      return navigate({
        to: "/wireguard/servers/$serverId",
        params: { serverId: server.data.id },
      });
    },
    [navigate],
  );

  const activeServers = serversStore.listHolder.items.filter(
    s => s.status === EWgServerStatus.Up,
  );

  const columns = useMemo(() => serverColumns, []);

  const stats = overviewStatsStore.stats;

  return (
    <PageLayout
      header={<PageHeader title="Дашборд" subtitle="Обзор WireGuard VPN" />}
      contentClassName="gap-3 sm:gap-6"
    >
      {/* Stat cards */}
      {canViewStats && (
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
            value={formatter.speed(stats?.rxSpeedBps ?? 0)}
            subtitle="Загрузка"
            color="purple"
            icon={<Download size={20} />}
          />
          <StatCard
            title="Скорость TX"
            value={formatter.speed(stats?.txSpeedBps ?? 0)}
            subtitle="Отдача"
            color="warning"
            icon={<Upload size={20} />}
          />
        </div>
      )}

      {canViewStats && (
        <>
          <ServerSpeedChart
            title={"Скорость всех серверов"}
            points={overviewStatsStore.speedPoints}
            isLoading={overviewStatsStore.isLoading}
          />
          <ServerTrafficChart
            title={"Трафик всех серверов"}
            points={overviewStatsStore.trafficPoints}
            isLoading={overviewStatsStore.isLoading}
          />
        </>
      )}

      {canViewServers && (
        <ServersTable
          data={serversStore.models}
          columns={columns}
          loading={serversStore.isLoading}
          onRowClick={onServerClick}
        />
      )}
    </PageLayout>
  );
});
