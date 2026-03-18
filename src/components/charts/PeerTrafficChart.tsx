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
  title = "Трафик пира",
  description = "Накопленный RX / TX трафик",
}) => (
  <WGChart
    title={title}
    description={description}
    points={points}
    formatter={formatBytes}
    rxLabel="Получено"
    txLabel="Отправлено"
  />
);
