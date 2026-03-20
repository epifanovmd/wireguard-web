import { useCallback, useEffect, useMemo, useState } from "react";

import { useApi } from "~@api";
import { WgPeerDto, WgServerDto } from "~@api/api-gen/data-contracts";
import { type DateRange } from "~@components/ui";
import { useServerStatsStore } from "~@store";

import { getPresetRange, type Preset } from "../stats.constants";

export const useStatsVM = () => {
  const serverStatsStore = useServerStatsStore();
  const api = useApi();

  const [selectedServer, setSelectedServer] = useState<string>();
  const [selectedPeer, setSelectedPeer] = useState<string>("");
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

  const onFetchPeers = useCallback(async () => {
    return selectedServer
      ? api
          .getPeersByServer({ serverId: selectedServer, limit: 10 })
          .then(res => res.data?.data ?? [])
          .catch(() => [])
      : [];
  }, [api, selectedServer]);

  const getPeerOption = useCallback(
    (s: WgPeerDto) => ({
      value: s.id,
      label: s.name,
    }),
    [],
  );

  const onFetchServers = useCallback(async () => {
    return api
      .getServers({ limit: 10 })
      .then(res => res.data?.data ?? [])
      .catch(() => []);
  }, [api]);

  const getServerOption = useCallback(
    (s: WgServerDto) => ({
      value: s.id,
      label: s.name,
    }),
    [],
  );

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
    onFetchPeers,
    getPeerOption,
    getServerOption,
    onFetchServers,
  };
};
