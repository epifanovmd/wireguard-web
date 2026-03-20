import React, { FC } from "react";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { Checkbox } from "~@components/ui";

const PERMISSION_GROUPS = [
  {
    label: "Общие",
    items: [
      {
        value: EPermissions.Read,
        label: "Чтение",
        description: "Просмотр данных",
      },
      {
        value: EPermissions.Write,
        label: "Запись",
        description: "Создание и редактирование записей",
      },
      {
        value: EPermissions.Delete,
        label: "Удаление",
        description: "Удаление записей",
      },
    ],
  },
  {
    label: "Серверы WireGuard",
    items: [
      {
        value: EPermissions.WgServerView,
        label: "Просмотр серверов",
        description: "Список и детали серверов",
      },
      {
        value: EPermissions.WgServerManage,
        label: "Управление серверами",
        description: "Создание, редактирование, удаление серверов",
      },
      {
        value: EPermissions.WgServerControl,
        label: "Контроль серверов",
        description: "Запуск, остановка, перезапуск серверов",
      },
    ],
  },
  {
    label: "Пиры WireGuard",
    items: [
      {
        value: EPermissions.WgPeerView,
        label: "Просмотр пиров",
        description: "Список и детали пиров",
      },
      {
        value: EPermissions.WgPeerManage,
        label: "Управление пирами",
        description: "Создание, редактирование, удаление пиров",
      },
      {
        value: EPermissions.WgPeerOwn,
        label: "Только свои пиры",
        description: "Доступ только к назначенным пирам",
      },
    ],
  },
  {
    label: "Статистика",
    items: [
      {
        value: EPermissions.WgStatsView,
        label: "Просмотр статистики",
        description: "Просмотр трафика и скорости",
      },
      {
        value: EPermissions.WgStatsExport,
        label: "Экспорт статистики",
        description: "Скачивание и экспорт данных",
      },
    ],
  },
];

interface PermissionsEditorProps {
  value: EPermissions[];
  onChange: (perms: EPermissions[]) => void;
}

export const PermissionsEditor: FC<PermissionsEditorProps> = ({
  value,
  onChange,
}) => {
  const toggle = (perm: EPermissions) => {
    if (value.includes(perm)) {
      onChange(value.filter(p => p !== perm));
    } else {
      onChange([...value, perm]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {PERMISSION_GROUPS.map(group => (
        <div key={group.label}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {group.label}
          </p>
          <div className="flex flex-col gap-2 pl-1">
            {group.items.map(item => (
              <Checkbox
                key={item.value}
                label={item.label}
                description={item.description}
                checked={value.includes(item.value)}
                onCheckedChange={() => toggle(item.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
