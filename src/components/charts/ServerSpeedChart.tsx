import { FC } from "react";

import { IChartPoint } from "../wgChart";
import { formatSpeed, WGChart } from "../wgChart";

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
    formatter={formatSpeed}
    rxLabel="Загрузка"
    txLabel="Отдача"
  />
);
