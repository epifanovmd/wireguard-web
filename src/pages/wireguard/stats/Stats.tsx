import { observer } from "mobx-react-lite";
import { FC } from "react";

import { formatter } from "~@common";
import { ServerSpeedChart, ServerTrafficChart } from "~@components";
import { PageHeader } from "~@components/layouts";
import {
  Button,
  DateRangePicker,
  Segmented,
  Select,
  Spinner,
  StatCard,
} from "~@components/ui";

import { useStatsVM } from "./hooks/useStatsVM";
import { PRESETS } from "./stats.constants";

export const Stats: FC = observer(() => {
  const vm = useStatsVM();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Статистика" subtitle="Трафик и скорость WireGuard" />
      <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-auto">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            options={vm.serversStore.listHolder.items.map(s => ({
              value: s.id,
              label: s.name,
            }))}
            value={vm.selectedServer}
            loading={vm.serversStore.isLoading}
            onValueChange={v => vm.setSelectedServer(v ?? "")}
            placeholder="Выберите сервер"
            triggerClassName="w-48"
          />
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
        ) : vm.serverStatsStore.isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                title="Всего RX"
                value={formatter.bytes(vm.totalRx)}
                subtitle="За период"
                color="info"
              />
              <StatCard
                title="Всего TX"
                value={formatter.bytes(vm.totalTx)}
                subtitle="За период"
                color="success"
              />
              <StatCard
                title="Пик скорости RX"
                value={formatter.speed(vm.maxRxSpeed)}
                subtitle="Макс. загрузка"
                color="purple"
              />
              <StatCard
                title="Пик скорости TX"
                value={formatter.speed(vm.maxTxSpeed)}
                subtitle="Макс. отдача"
                color="warning"
              />
            </div>

            <ServerSpeedChart
              title="Скорость"
              description="Мгновенная скорость передачи данных"
              points={vm.serverStatsStore.speedPoints}
            />

            <ServerTrafficChart
              title="Трафик"
              description="Накопленный объём переданных данных"
              points={vm.serverStatsStore.trafficPoints}
            />
          </>
        )}
      </div>
    </div>
  );
});
