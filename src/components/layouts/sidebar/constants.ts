import { type LinkProps } from "@tanstack/react-router";
import { BarChart3, Grid2x2, type LucideIcon, Server, Users, Zap } from "lucide-react";

import { EPermissions } from "~@api/api-gen/data-contracts";

export interface NavItem {
  to: LinkProps["to"];
  label: string;
  icon: LucideIcon;
  badge?: number;
  /** Права для отображения пункта (OR-логика). Отсутствие = доступно всем. */
  permissions?: EPermissions[];
  /** Только для администраторов. */
  adminOnly?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV_ICON_SIZE = 17;

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        to: "/",
        label: "Дашборд",
        icon: Grid2x2,
        permissions: [EPermissions.WgStatsView],
      },
    ],
  },
  {
    label: "Управление",
    items: [
      {
        to: "/users",
        label: "Пользователи",
        icon: Users,
        permissions: [EPermissions.UserView],
      },
    ],
  },
  {
    label: "WireGuard VPN",
    items: [
      {
        to: "/wireguard/servers",
        label: "Серверы",
        icon: Server,
        permissions: [EPermissions.WgServerView, EPermissions.WgServerOwn],
      },
      {
        to: "/wireguard/peers",
        label: "Пиры",
        icon: Zap,
        permissions: [EPermissions.WgPeerView, EPermissions.WgPeerOwn],
      },
      {
        to: "/wireguard/stats",
        label: "Статистика",
        icon: BarChart3,
        adminOnly: true,
      },
    ],
  },
];
