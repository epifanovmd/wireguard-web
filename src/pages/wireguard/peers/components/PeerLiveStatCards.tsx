import { observer } from "mobx-react-lite";
import { FC } from "react";

import { formatter } from "~@common";
import { StatCard } from "~@components/ui";
import { usePeerStatsStore } from "~@store/peerStats";

export const PeerLiveStatCards: FC = observer(() => {
  const store = usePeerStatsStore();

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        title="Всего RX"
        value={formatter.bytes(store.stats?.rxBytes ?? 0)}
        subtitle="Загружено"
        color="info"
      />
      <StatCard
        title="Всего TX"
        value={formatter.bytes(store.stats?.txBytes ?? 0)}
        subtitle="Отдано"
        color="success"
      />
      <StatCard
        title="Скорость RX"
        value={formatter.speed(store.stats?.rxSpeedBps ?? 0)}
        subtitle="Загрузка"
        color="purple"
      />
      <StatCard
        title="Скорость TX"
        value={formatter.speed(store.stats?.txSpeedBps ?? 0)}
        subtitle="Отдача"
        color="warning"
      />
    </div>
  );
});
