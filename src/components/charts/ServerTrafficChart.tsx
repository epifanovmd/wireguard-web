import { FC } from "react";

import { IChartPoint } from "../wgChart";
import { formatBytes, WGChart } from "../wgChart";

interface IServerTrafficChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
}

export const ServerTrafficChart: FC<IServerTrafficChartProps> = ({
  points,
  title = "Server traffic",
  description = "Cumulative RX / TX bytes",
}) => (
  <WGChart
    title={title}
    description={description}
    points={points}
    formatter={formatBytes}
    rxLabel="Received"
    txLabel="Sent"
  />
);
