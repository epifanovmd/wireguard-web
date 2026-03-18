import { FC } from "react";

import { IChartPoint } from "../wgChart";
import { formatBytes, WGChart } from "../wgChart";

interface IPeerTrafficChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
}

export const PeerTrafficChart: FC<IPeerTrafficChartProps> = ({
  points,
  title = "Peer traffic",
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
