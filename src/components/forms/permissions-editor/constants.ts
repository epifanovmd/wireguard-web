import { EPermissions } from "~@api/api-gen/data-contracts";

import { PermissionGroup } from "./types";

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "Серверы WireGuard",
    wildcard: EPermissions.WgServer,
    items: [
      {
        value: EPermissions.WgServerView,
        label: "Просмотр",
        description: "Список и детали серверов",
      },
      {
        value: EPermissions.WgServerManage,
        label: "Управление",
        description: "Создание, редактирование, удаление серверов",
      },
      {
        value: EPermissions.WgServerControl,
        label: "Контроль",
        description: "Запуск, остановка, перезапуск серверов",
      },
    ],
  },
  {
    label: "Пиры WireGuard",
    wildcard: EPermissions.WgPeer,
    items: [
      {
        value: EPermissions.WgPeerView,
        label: "Просмотр",
        description: "Список и детали пиров",
      },
      {
        value: EPermissions.WgPeerManage,
        label: "Управление",
        description: "Создание, редактирование, удаление пиров",
      },
      {
        value: EPermissions.WgPeerOwn,
        label: "Только свои пиры",
        description: "Доступ только к назначенным пирам пользователя",
      },
    ],
  },
  {
    label: "Статистика",
    wildcard: EPermissions.WgStats,
    items: [
      {
        value: EPermissions.WgStatsView,
        label: "Просмотр",
        description: "Просмотр трафика и скорости",
      },
      {
        value: EPermissions.WgStatsExport,
        label: "Экспорт",
        description: "Скачивание и экспорт данных",
      },
    ],
  },
  {
    label: "Пользователи",
    items: [
      {
        value: EPermissions.UserView,
        label: "Просмотр",
        description: "Список и детали пользователей",
      },
      {
        value: EPermissions.UserManage,
        label: "Управление",
        description: "Назначение прав, удаление пользователей",
      },
    ],
  },
];
