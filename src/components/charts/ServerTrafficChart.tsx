import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

interface IServerTrafficChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const ServerTrafficChart: FC<IServerTrafficChartProps> = ({
  points,
  title = "Трафик сервера",
  description = "Накопленный RX / TX трафик",
  isLoading,
}) => (
  <WGChart
    title={title}
    description={description}
    points={points}
    isLoading={isLoading}
    formatter={v => formatter.bytes(v)}
    rxLabel="Получено"
    txLabel="Отправлено"
  />
);
