import { StatCard } from "@components/ui";
import { useServerStatsStore } from "@store/serverStats";
import { formatter } from "@utils";
import { observer } from "mobx-react-lite";
import { FC } from "react";

export const ServerLiveStatCards: FC = observer(() => {
  const store = useServerStatsStore();

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        title="Скорость RX"
        value={formatter.speed(store.stats?.rxSpeedBps)}
        subtitle="Загрузка"
        color="info"
      />
      <StatCard
        title="Скорость TX"
        value={formatter.speed(store.stats?.txSpeedBps)}
        subtitle="Отдача"
        color="success"
      />
      <StatCard
        title="Всего RX"
        value={formatter.bytes(store.stats?.totalRxBytes)}
        subtitle="Загружено"
        color="purple"
      />
      <StatCard
        title="Всего TX"
        value={formatter.bytes(store.stats?.totalTxBytes)}
        subtitle="Отдано"
        color="warning"
      />
    </div>
  );
});
