import { FC } from "react";

import { formatSpeed, IChartPoint, WGChart } from "../wgChart";

interface IPeerSpeedChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
}

export const PeerSpeedChart: FC<IPeerSpeedChartProps> = ({
  points,
  title = "Peer speed",
  description = "Real-time download / upload",
}) => (
  <WGChart
    title={title}
    description={description}
    points={points}
    formatter={formatSpeed}
    rxLabel="Download"
    txLabel="Upload"
  />
);
