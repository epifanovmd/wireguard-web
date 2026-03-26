import { formatter } from "@utils";
import { FC } from "react";

import { WGChart } from "../wgChart";
import { ChartProps } from "./types";

export const PeerSpeedChart: FC<ChartProps> = ({
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
