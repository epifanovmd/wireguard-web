import { type DateRange } from "@components/ui";
import { useServerStatsStore } from "@store";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  usePeersSelectOptions,
  useServersSelectOptions,
} from "../../../../hooks";
import { getPresetRange, type Preset } from "../stats.constants";

export const useStatsVM = () => {
  const serverStatsStore = useServerStatsStore();

  const [selectedServer, setSelectedServer] = useState<string>();
  const [selectedPeer, setSelectedPeer] = useState<string | null>();
  const [preset, setPreset] = useState<Preset>("1h");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(
    undefined,
  );

  const [activeFrom, activeTo] = useMemo(
    () =>
      customRange?.from && customRange?.to
        ? [customRange.from, customRange.to]
        : getPresetRange(preset),
    [customRange, preset],
  );

  const loadStats = useCallback(() => {
    if (selectedServer) {
      serverStatsStore.load(
        selectedServer,
        activeFrom.toISOString(),
        activeTo.toISOString(),
        selectedPeer || undefined,
      );
    }
  }, [serverStatsStore, selectedServer, activeFrom, activeTo, selectedPeer]);

  useEffect(() => {
    const rangeReady = !customRange || (customRange.from && customRange.to);

    if (selectedServer && rangeReady) {
      loadStats();
    }
  }, [selectedServer, selectedPeer, preset, customRange, loadStats]);

  const handlePresetChange = useCallback((val: string) => {
    setPreset(val as Preset);
    setCustomRange(undefined);
  }, []);

  const handleCustomRange = useCallback((range: DateRange | undefined) => {
    setCustomRange(range);
  }, []);

  const servers = useServersSelectOptions();
  const peers = usePeersSelectOptions(selectedServer);

  return {
    selectedServer,
    selectedPeer,
    setSelectedServer,
    setSelectedPeer,
    preset,
    customRange,
    loadStats,
    handlePresetChange,
    handleCustomRange,
    servers,
    peers,
  };
};
