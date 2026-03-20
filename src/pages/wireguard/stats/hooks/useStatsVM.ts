import { useCallback, useEffect, useState } from "react";

import { useApi } from "~@api";
import { WgPeerDto, WgServerDto } from "~@api/api-gen/data-contracts";
import { type DateRange } from "~@components/ui";
import { useServersListStore, useServerStatsStore } from "~@store";

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

  const [activeFrom, activeTo] =
    customRange?.from && customRange?.to
      ? [customRange.from, customRange.to]
      : getPresetRange(preset);

  useEffect(() => {
    const rangeReady = !customRange || (customRange.from && customRange.to);

    if (selectedServer && rangeReady) {
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServer, selectedPeer, preset, customRange]);

  const loadStats = () => {
    if (selectedServer) {
      serverStatsStore.load(
        selectedServer,
        activeFrom.toISOString(),
        activeTo.toISOString(),
        selectedPeer || undefined,
      );
    }
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
    serverStatsStore,
    selectedServer,
    selectedPeer,
    setSelectedServer,
    setSelectedPeer,
    preset,
    customRange,
    totalRx,
    totalTx,
    maxRxSpeed,
    maxTxSpeed,
    loadStats,
    handlePresetChange,
    handleCustomRange,
    onFetchPeers,
    getPeerOption,
    getServerOption,
    onFetchServers,
  };
};
