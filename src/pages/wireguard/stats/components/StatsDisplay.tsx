import { observer } from "mobx-react-lite";
import { FC } from "react";

import { formatter } from "~@common";
import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { Spinner, StatCard } from "~@components/ui";
import { useServerStatsStore } from "~@store/serverStats";

export const StatsDisplay: FC = observer(() => {
  const store = useServerStatsStore();

  if (store.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const totalRx = store.stats?.totalRxBytes ?? 0;
  const totalTx = store.stats?.totalTxBytes ?? 0;
  const maxRxSpeed =
    store.speedPoints.length > 0
      ? store.speedPoints.reduce((max, d) => Math.max(max, d.rx), 0)
      : 0;
  const maxTxSpeed =
    store.speedPoints.length > 0
      ? store.speedPoints.reduce((max, d) => Math.max(max, d.tx), 0)
      : 0;

  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Всего RX"
          value={formatter.bytes(totalRx)}
          subtitle="За период"
          color="info"
        />
        <StatCard
          title="Всего TX"
          value={formatter.bytes(totalTx)}
          subtitle="За период"
          color="success"
        />
        <StatCard
          title="Пик скорости RX"
          value={formatter.speed(maxRxSpeed)}
          subtitle="Макс. загрузка"
          color="purple"
        />
        <StatCard
          title="Пик скорости TX"
          value={formatter.speed(maxTxSpeed)}
          subtitle="Макс. отдача"
          color="warning"
        />
      </div>

      <ServerSpeedChart
        title="Скорость"
        description="Мгновенная скорость передачи данных"
        points={store.speedPoints}
      />

      <ServerTrafficChart
        title="Трафик"
        description="Накопленный объём переданных данных"
        points={store.trafficPoints}
      />
    </>
  );
});
