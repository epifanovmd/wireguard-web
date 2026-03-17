import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { useServerStatsStore } from "~@store/serverStats";

import { formatBytes,WGChart } from "../wgChart";

interface IServerTrafficChartProps {
  serverId: string;
  title?: string;
  description?: string;
}

export const ServerTrafficChart: FC<IServerTrafficChartProps> = observer(
  ({
    serverId,
    title = "Server traffic",
    description = "Cumulative RX / TX bytes",
  }) => {
    const store = useServerStatsStore();

    useEffect(() => store.subscribe(serverId), [store, serverId]);

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
