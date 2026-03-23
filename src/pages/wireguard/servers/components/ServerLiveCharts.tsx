import { observer } from "mobx-react-lite";
import { FC } from "react";

import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { useServerStatsStore } from "~@store/serverStats";

export const ServerLiveCharts: FC = observer(() => {
  const store = useServerStatsStore();

  return (
    <>
      <ServerSpeedChart points={store.speedPoints} isLoading={store.isLoading} />
      <ServerTrafficChart points={store.trafficPoints} isLoading={store.isLoading} />
    </>
  );
});
