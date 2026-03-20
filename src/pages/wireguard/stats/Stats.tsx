import { FC } from "react";

import { PageHeader } from "~@components/layouts";
import {
  AsyncSelect,
  Button,
  DateRangePicker,
  SearchSelect,
  Segmented,
  Select,
} from "~@components/ui";

import { StatsDisplay } from "./components/StatsDisplay";
import { useStatsVM } from "./hooks/useStatsVM";
import { PRESETS } from "./stats.constants";

export const Stats: FC = () => {
  const vm = useStatsVM();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Статистика" subtitle="Трафик и скорость WireGuard" />
      <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-auto">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className={"flex grow gap-3 flex-wrap"}>
            <AsyncSelect
              getOption={vm.servers.getOption}
              fetchOnMount={true}
              fetchOptions={vm.servers.fetchOptions}
              value={vm.selectedServer}
              onValueChange={v => vm.setSelectedServer(v ?? "")}
              placeholder="Выберите сервер"
            />
            <SearchSelect
              getOption={vm.peers.getOption}
              fetchOptions={vm.peers.fetchOptions}
              value={vm.selectedPeer}
              disabled={!vm.selectedServer}
              onValueChange={v => vm.setSelectedPeer(v ?? "")}
              placeholder="Выберите peer"
              clearable={true}
              tagsDisplay={true}
              // multi={true}
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
      </div>
    </div>
  );
};
