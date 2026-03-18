import { subDays, subHours } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  Button,
  type DateRange,
  DateRangePicker,
  Segmented,
  Select,
  Spinner,
  StatCard,
} from "~@components/ui2";
import { useServersListStore, useServerStatsStore } from "~@store";

import { formatBytes, formatSpeed } from "../../dashboard";

type Preset = "1h" | "6h" | "24h" | "7d" | "30d" | "custom";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "custom", label: "Произвольный" },
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
  const serversStore = useServersListStore();
  const serverStatsStore = useServerStatsStore();
  const [selectedServer, setSelectedServer] = useState("");
  const [preset, setPreset] = useState<Preset>("1h");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(
    undefined,
  );

  const activeFrom =
    preset !== "custom" ? getPresetRange(preset)[0] : customRange?.from;

  useEffect(() => {
    serversStore.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serversStore.listHolder.d.length > 0 && !selectedServer) {
      setSelectedServer(serversStore.listHolder.d[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serversStore.listHolder.d.length]);

  useEffect(() => {
    if (selectedServer && activeFrom) {
      loadStats().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServer, preset, customRange]);

  const loadStats = async () => {
    if (!activeFrom) return;
    const [from, to] = getPresetRange(preset);
    serverStatsStore
      .loadServerStats(selectedServer, from.toISOString(), to.toISOString())
      .then();
  };

  const handlePresetChange = (val: string) => {
    setPreset(val as Preset);
    if (val !== "custom") {
      setCustomRange(undefined);
    }
  };

  const totalRx = serverStatsStore.stats?.totalRxBytes ?? 0;
  const totalTx = serverStatsStore.stats?.totalTxBytes ?? 0;
  const maxRxSpeed =
    serverStatsStore.speedPoints.length > 0
      ? Math.max(...serverStatsStore.speedPoints.map(d => d.rx))
      : 0;
  const maxTxSpeed =
    serverStatsStore.speedPoints.length > 0
      ? Math.max(...serverStatsStore.speedPoints.map(d => d.tx))
      : 0;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Статистика"
        subtitle="Трафик и скорость WireGuard"
      />
      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            options={serversStore.listHolder.d.map(s => ({
              value: s.id,
              label: s.name,
            }))}
            value={selectedServer}
            onValueChange={v => setSelectedServer(v ?? "")}
            placeholder="Выберите сервер"
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
            Обновить
          </Button>
        </div>

        {!selectedServer ? (
          <div className="flex justify-center py-16 text-[var(--muted-foreground)]">
            Выберите сервер для просмотра статистики
          </div>
        ) : serverStatsStore.speedPointsHolder.isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Всего RX"
                value={formatBytes(totalRx)}
                subtitle="За период"
                color="info"
              />
              <StatCard
                title="Всего TX"
                value={formatBytes(totalTx)}
                subtitle="За период"
                color="success"
              />
              <StatCard
                title="Пик скорости RX"
                value={formatSpeed(maxRxSpeed)}
                subtitle="Макс. загрузка"
                color="purple"
              />
              <StatCard
                title="Пик скорости TX"
                value={formatSpeed(maxTxSpeed)}
                subtitle="Макс. отдача"
                color="warning"
              />
            </div>

            <ServerSpeedChart
              title="Скорость"
              description="Мгновенная скорость передачи данных"
              points={serverStatsStore.speedPoints}
            />

            <ServerTrafficChart
              title="Трафик"
              description="Накопленный объём переданных данных"
              points={serverStatsStore.trafficPoints}
            />
          </>
        )}
      </div>
    </div>
  );
});
