import { useEffect, useState } from "react";

import { type DateRange } from "~@components/ui";
import { useServersListStore, useServerStatsStore } from "~@store";

import { getPresetRange, type Preset } from "../stats.constants";

export const useStatsVM = () => {
  const serversStore = useServersListStore();
  const serverStatsStore = useServerStatsStore();

  const [selectedServer, setSelectedServer] = useState("");
  const [preset, setPreset] = useState<Preset>("1h");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(
    undefined,
  );

  const [activeFrom, activeTo] =
    customRange?.from && customRange?.to
      ? [customRange.from, customRange.to]
      : getPresetRange(preset);

  useEffect(() => {
    serversStore.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serversStore.listHolder.items.length > 0 && !selectedServer) {
      setSelectedServer(serversStore.listHolder.items[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serversStore.listHolder.items.length]);

  useEffect(() => {
    const rangeReady = !customRange || (customRange.from && customRange.to);

    if (selectedServer && rangeReady) {
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServer, preset, customRange]);

  const loadStats = () => {
    serverStatsStore.load(
      selectedServer,
      activeFrom.toISOString(),
      activeTo.toISOString(),
    );
  };

  const handlePresetChange = (val: string) => {
    setPreset(val as Preset);
    setCustomRange(undefined);
  };

  const handleCustomRange = (range: DateRange | undefined) => {
    setCustomRange(range);
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

  return {
    serversStore,
    serverStatsStore,
    selectedServer,
    setSelectedServer,
    preset,
    customRange,
    totalRx,
    totalTx,
    maxRxSpeed,
    maxTxSpeed,
    loadStats,
    handlePresetChange,
    handleCustomRange,
  };
};
