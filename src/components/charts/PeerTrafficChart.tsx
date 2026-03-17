import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { usePeerStatsStore } from "~@store/peerStats";

import { formatBytes,WGChart } from "../wgChart";

interface IPeerTrafficChartProps {
  peerId: string;
  title?: string;
  description?: string;
}

export const PeerTrafficChart: FC<IPeerTrafficChartProps> = observer(
  ({
    peerId,
    title = "Peer traffic",
    description = "Cumulative RX / TX bytes",
  }) => {
    const store = usePeerStatsStore();

    useEffect(() => store.subscribe(peerId), [store, peerId]);

    return (
      <WGChart
        title={title}
        description={description}
        points={store.trafficPoints}
        formatter={formatBytes}
        rxLabel="Received"
        txLabel="Sent"
      />
    );
  },
);
