import { PeerSpeedChart, PeerTrafficChart } from "@components";
import { usePeerStatsStore } from "@store/peerStats";
import { observer } from "mobx-react-lite";
import { FC } from "react";

export const PeerLiveCharts: FC = observer(() => {
  const store = usePeerStatsStore();

  return (
    <>
      <PeerSpeedChart
        title="Скорость"
        points={store.speedPoints}
        isLoading={store.isLoading}
      />
      <PeerTrafficChart
        title="Трафик"
        points={store.trafficPoints}
        isLoading={store.isLoading}
      />
    </>
  );
});
