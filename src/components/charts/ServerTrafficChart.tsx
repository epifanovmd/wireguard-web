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
  title = "Трафик сервера",
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
