import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

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
    formatter={v => formatter.bytes(v)}
    rxLabel="Получено"
    txLabel="Отправлено"
  />
);
