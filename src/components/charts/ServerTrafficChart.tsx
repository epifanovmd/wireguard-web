import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

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
    formatter={v => formatter.bytes(v)}
    rxLabel="Получено"
    txLabel="Отправлено"
  />
);
