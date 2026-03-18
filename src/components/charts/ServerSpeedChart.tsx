import { FC } from "react";

import { IChartPoint } from "../wgChart";
import { formatSpeed, WGChart } from "../wgChart";

interface IServerSpeedChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
}

export const ServerSpeedChart: FC<IServerSpeedChartProps> = ({
  title = "Server speed",
  description = "Real-time download / upload",
  points,
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
