import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

interface IPeerSpeedChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const PeerSpeedChart: FC<IPeerSpeedChartProps> = ({
  points,
  title = "Скорость пира",
  description = "Загрузка / отдача в реальном времени",
  isLoading,
}) => (
  <WGChart
    title={title}
    description={description}
    points={points}
    isLoading={isLoading}
    formatter={v => formatter.speed(v)}
    rxLabel="Загрузка"
    txLabel="Отдача"
  />
);
