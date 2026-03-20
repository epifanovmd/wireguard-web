import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PeerSpeedChart, PeerTrafficChart } from "~@components";
import { usePeerStatsStore } from "~@store/peerStats";

export const PeerLiveCharts: FC = observer(() => {
  const store = usePeerStatsStore();

  return (
    <>
      <PeerSpeedChart points={store.speedPoints} />
      <PeerTrafficChart points={store.trafficPoints} />
    </>
  );
});
