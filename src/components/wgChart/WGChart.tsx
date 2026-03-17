import { observer } from "mobx-react-lite";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../ui2";

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
          <LineChart data={points}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="t" tick={tickStyle} />
            <YAxis tick={tickStyle} tickFormatter={formatter} />
            <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
            <Line
              type="monotone"
              dataKey="rx"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              name="rx"
            />
            <Line
              type="monotone"
              dataKey="tx"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="tx"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <span className="w-3 h-0.5 bg-[#6366f1] inline-block" /> {rxLabel}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <span className="w-3 h-0.5 bg-[#22c55e] inline-block" /> {txLabel}
          </span>
        </div>
      </Card>
    );
  },
);
