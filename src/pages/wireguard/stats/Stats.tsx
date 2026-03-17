import { formatISO, subDays, subHours } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "~@components/layouts";
import {
  Button,
  Card,
  type DateRange,
  DateRangePicker,
  Segmented,
  Select,
  Spinner,
  StatCard,
} from "~@components/ui2";
import { useServersDataStore, useStatsDataStore } from "~@store";

import { formatBytes, formatSpeed } from "../../dashboard";

type Preset = "1h" | "6h" | "24h" | "7d" | "30d" | "custom";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "custom", label: "Custom" },
];

function getPresetRange(preset: Preset): [Date, Date] {
  const now = new Date();
  if (preset === "1h") return [subHours(now, 1), now];
  if (preset === "6h") return [subHours(now, 6), now];
  if (preset === "24h") return [subHours(now, 24), now];
  if (preset === "7d") return [subDays(now, 7), now];
  if (preset === "30d") return [subDays(now, 30), now];
  return [subDays(now, 1), now];
}

export const Stats: FC = observer(() => {
  const serversStore = useServersDataStore();
  const stats = useStatsDataStore();
  const [selectedServer, setSelectedServer] = useState("");
  const [preset, setPreset] = useState<Preset>("1h");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

  const activeFrom =
    preset !== "custom" ? getPresetRange(preset)[0] : customRange?.from;

  useEffect(() => {
    serversStore.loadServers().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serversStore.servers.length > 0 && !selectedServer) {
      setSelectedServer(serversStore.servers[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serversStore.servers.length]);

  useEffect(() => {
    if (selectedServer && activeFrom) {
      loadStats().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServer, preset, customRange]);

  const loadStats = async () => {
    if (!activeFrom) return;
    setLoading(true);
    await stats.loadServerStats(selectedServer, formatISO(activeFrom));
    setLoading(false);
  };

  const handlePresetChange = (val: string) => {
    setPreset(val as Preset);
    if (val !== "custom") {
      setCustomRange(undefined);
    }
  };

  const trafficData = (stats.serverStats?.traffic ?? []).map(t => ({
    time: new Date(t.timestamp).toLocaleString("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    rx: t.rxBytes,
    tx: t.txBytes,
  }));

  const speedData = (stats.serverStats?.speed ?? []).map(s => ({
    time: new Date(s.timestamp).toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    rx: s.rxSpeedBps,
    tx: s.txSpeedBps,
  }));

  const totalRx =
    trafficData.length > 0 ? trafficData[trafficData.length - 1].rx : 0;
  const totalTx =
    trafficData.length > 0 ? trafficData[trafficData.length - 1].tx : 0;
  const maxRxSpeed =
    speedData.length > 0 ? Math.max(...speedData.map(d => d.rx)) : 0;
  const maxTxSpeed =
    speedData.length > 0 ? Math.max(...speedData.map(d => d.tx)) : 0;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Statistics"
        subtitle="WireGuard traffic and speed analytics"
      />
      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            options={serversStore.servers.map(s => ({
              value: s.id,
              label: s.name,
            }))}
            value={selectedServer}
            onValueChange={v => setSelectedServer(v ?? "")}
            placeholder="Select server"
            triggerClassName="w-48"
          />
          <Segmented
            options={PRESETS}
            value={preset}
            onChange={handlePresetChange}
          />
          {preset === "custom" && (
            <DateRangePicker
              value={customRange}
              onChange={setCustomRange}
              clearable
            />
          )}
          <Button size="sm" variant="outline" onClick={loadStats}>
            Refresh
          </Button>
        </div>

        {!selectedServer ? (
          <div className="flex justify-center py-16 text-[var(--muted-foreground)]">
            Select a server to view statistics
          </div>
        ) : loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Total RX"
                value={formatBytes(totalRx)}
                subtitle="Selected period"
                color="info"
              />
              <StatCard
                title="Total TX"
                value={formatBytes(totalTx)}
                subtitle="Selected period"
                color="success"
              />
              <StatCard
                title="Peak RX Speed"
                value={formatSpeed(maxRxSpeed)}
                subtitle="Max download"
                color="purple"
              />
              <StatCard
                title="Peak TX Speed"
                value={formatSpeed(maxTxSpeed)}
                subtitle="Max upload"
                color="warning"
              />
            </div>

            {/* Traffic chart */}
            <Card
              title="Traffic"
              description="Cumulative bytes transferred over time"
              className="p-5"
            >
              <div className="h-56">
                <ResponsiveContainer width="100%" height={224}>
                  <AreaChart data={trafficData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickFormatter={v => formatBytes(v)}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number, name: string) => [
                        formatBytes(v),
                        name === "rx" ? "Download" : "Upload",
                      ]}
                    />
                    <Legend
                      formatter={v => (v === "rx" ? "Download" : "Upload")}
                    />
                    <Area
                      type="monotone"
                      dataKey="rx"
                      stroke="#6366f1"
                      fill="#6366f115"
                      strokeWidth={2}
                      name="rx"
                    />
                    <Area
                      type="monotone"
                      dataKey="tx"
                      stroke="#22c55e"
                      fill="#22c55e15"
                      strokeWidth={2}
                      name="tx"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Speed chart */}
            <Card
              title="Speed"
              description="Instantaneous transfer speed over time"
              className="p-5"
            >
              <div className="h-48">
                <ResponsiveContainer width="100%" height={192}>
                  <AreaChart data={speedData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickFormatter={v => formatSpeed(v)}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number, name: string) => [
                        formatSpeed(v),
                        name === "rx" ? "Download" : "Upload",
                      ]}
                    />
                    <Legend
                      formatter={v => (v === "rx" ? "Download" : "Upload")}
                    />
                    <Area
                      type="monotone"
                      dataKey="rx"
                      stroke="#6366f1"
                      fill="#6366f115"
                      strokeWidth={2}
                      name="rx"
                    />
                    <Area
                      type="monotone"
                      dataKey="tx"
                      stroke="#22c55e"
                      fill="#22c55e15"
                      strokeWidth={2}
                      name="tx"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
});
