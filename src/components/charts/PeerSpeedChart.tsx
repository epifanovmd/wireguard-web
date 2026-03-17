import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { usePeerStatsStore } from "~@store/peerStats";

import { formatSpeed,WGChart } from "../wgChart";

interface IPeerSpeedChartProps {
  peerId: string;
  title?: string;
  description?: string;
}

export const PeerSpeedChart: FC<IPeerSpeedChartProps> = observer(
  ({
    peerId,
    title = "Peer speed",
    description = "Real-time download / upload",
  }) => {
    const store = usePeerStatsStore();

    useEffect(() => store.subscribe(peerId), [store, peerId]);

    return (
      <WGChart
        title={title}
        description={description}
        points={store.speedPoints}
        formatter={formatSpeed}
        rxLabel="Download"
        txLabel="Upload"
      />
    );
  },
);
