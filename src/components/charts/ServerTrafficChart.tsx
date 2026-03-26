import { formatter } from "@common";
import { FC } from "react";

import { WGChart } from "../wgChart";
import { ChartProps } from "./types";

export const ServerTrafficChart: FC<ChartProps> = ({
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
