import { IWGChartProps } from "../wgChart";

export type ChartProps = Pick<
  IWGChartProps,
  "points" | "title" | "description" | "isLoading"
>;
