import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

interface IPeerSpeedChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
}

export const PeerSpeedChart: FC<IPeerSpeedChartProps> = ({
  points,
  title = "Скорость пира",
  description = "Загрузка / отдача в реальном времени",
}) => (
  <WGChart
    title={title}
    description={description}
    points={points}
    formatter={formatter.speed}
    rxLabel="Загрузка"
    txLabel="Отдача"
  />
);
