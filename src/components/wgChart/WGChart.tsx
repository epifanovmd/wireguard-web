import { observer } from "mobx-react-lite";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../ui";

export interface IChartPoint {
  t: string;
  rx: number;
  tx: number;
}

export interface IWGChartProps {
  title: string;
  description?: string;
  points: IChartPoint[];
  formatter?: (v: number) => string;
  rxLabel?: string;
  txLabel?: string;
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

const tickStyle = { fontSize: 11, fill: "var(--muted-foreground)" };

export const WGChart = observer<IWGChartProps>(
  ({
    points,
    title,
    description,
    formatter = v => String(v),
    rxLabel = "Download",
    txLabel = "Upload",
  }) => {
    const tooltipFormatter = (v: number, name: string) => [
      formatter(v),
      name === "rx" ? rxLabel : txLabel,
    ];

    return (
      <Card title={title} description={description}>
        <ResponsiveContainer width="100%" height={192}>
          <AreaChart data={points}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="t" tick={tickStyle} />
            <YAxis tick={tickStyle} tickFormatter={formatter} />
            <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />

            <Area
              animationEasing={"linear"}
              type="monotone"
              dataKey="rx"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.08}
              strokeWidth={2}
              name="rx"
            />
            <Area
              animationEasing={"linear"}
              type="monotone"
              dataKey="tx"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.08}
              strokeWidth={2}
              name="tx"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-3 h-0.5 inline-block"
              style={{ background: "var(--chart-1)" }}
            />{" "}
            {rxLabel}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-3 h-0.5 inline-block"
              style={{ background: "var(--chart-2)" }}
            />{" "}
            {txLabel}
          </span>
        </div>
      </Card>
    );
  },
);
