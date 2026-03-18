import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

interface IServerSpeedChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
}

export const ServerSpeedChart: FC<IServerSpeedChartProps> = ({
  title = "Скорость сервера",
  description = "Загрузка / отдача в реальном времени",
  points,
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
