import { FC } from "react";

import { PageHeader, PageLayout } from "~@components/layouts";
import { Button, DateRangePicker, Segmented, Select } from "~@components/ui";

import { StatsDisplay } from "./components/StatsDisplay";
import { useStatsVM } from "./hooks/useStatsVM";
import { PRESETS } from "./stats.constants";

export const Stats: FC = () => {
  const vm = useStatsVM();

  return (
    <PageLayout
      header={
        <PageHeader title="Статистика" subtitle="Трафик и скорость WireGuard" />
      }
      contentClassName="gap-3 sm:gap-6"
    >
      <div className="flex items-center gap-3 flex-wrap">
        <div className={"flex grow gap-3 flex-wrap"}>
          <Select
            getOption={vm.servers.getOption}
            fetchOnMount
            fetchOptions={vm.servers.fetchOptions}
            value={vm.selectedServer}
            onChange={v => vm.setSelectedServer(v ?? "")}
            placeholder="Выберите сервер"
          />
          <Select
            search
            getOption={vm.peers.getOption}
            fetchOptions={vm.peers.fetchOptions}
            value={vm.selectedPeer}
            loadOnce={true}
            disabled={!vm.selectedServer}
            onChange={vm.setSelectedPeer}
            placeholder="Выберите peer"
            clearable={true}
          />
        </div>
        <Segmented
          options={PRESETS}
          value={vm.customRange?.from ? undefined : vm.preset}
          onChange={vm.handlePresetChange}
        />
        <DateRangePicker
          value={vm.customRange}
          onChange={vm.handleCustomRange}
          clearable
        />
        <Button variant="outline" onClick={vm.loadStats}>
          Обновить
        </Button>
      </div>

      {!vm.selectedServer ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          Выберите сервер для просмотра статистики
        </div>
      ) : (
        <StatsDisplay />
      )}
    </PageLayout>
  );
};
