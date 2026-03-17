import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { useServerStatsStore } from "~@store/serverStats";

import { formatSpeed,WGChart } from "../wgChart";

interface IServerSpeedChartProps {
  serverId: string;
  title?: string;
  description?: string;
}

export const ServerSpeedChart: FC<IServerSpeedChartProps> = observer(
  ({
    serverId,
    title = "Server speed",
    description = "Real-time download / upload",
  }) => {
    const store = useServerStatsStore();

    useEffect(() => store.subscribe(serverId), [store, serverId]);

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
