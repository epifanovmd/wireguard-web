import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

import { useOverviewStatsStore } from "~@store/overviewStats";

import { formatSpeed,WGChart } from "../wgChart";

interface IOverviewSpeedChartProps {
  title?: string;
  description?: string;
}

export const OverviewSpeedChart: FC<IOverviewSpeedChartProps> = observer(
  ({ title = "Live speed", description = "Real-time download / upload" }) => {
    const store = useOverviewStatsStore();

    useEffect(() => store.subscribe(), [store]);

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
