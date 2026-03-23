import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

interface IPeerTrafficChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const PeerTrafficChart: FC<IPeerTrafficChartProps> = ({
  points,
  title = "Трафик пира",
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
