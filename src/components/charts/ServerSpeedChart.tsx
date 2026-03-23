import { FC } from "react";

import { formatter } from "~@common";

import { IChartPoint, WGChart } from "../wgChart";

interface IServerSpeedChartProps {
  points: IChartPoint[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const ServerSpeedChart: FC<IServerSpeedChartProps> = ({
  title = "Скорость сервера",
  description = "Загрузка / отдача в реальном времени",
  points,
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
