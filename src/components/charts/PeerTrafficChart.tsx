import { formatter } from "@utils";
import { FC } from "react";

import { WGChart } from "../wgChart";
import { ChartProps } from "./types";

export const PeerTrafficChart: FC<ChartProps> = ({
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
