import { ServerSpeedChart, ServerTrafficChart } from "@components";
import { useServerStatsStore } from "@store/serverStats";
import { observer } from "mobx-react-lite";
import { FC } from "react";

export const ServerLiveCharts: FC = observer(() => {
  const store = useServerStatsStore();

  return (
    <>
      <ServerSpeedChart
        title="Скорость"
        points={store.speedPoints}
        isLoading={store.isLoading}
      />
      <ServerTrafficChart
        title="Трафик"
        points={store.trafficPoints}
        isLoading={store.isLoading}
      />
    </>
  );
});
