import { Link, useRouterState } from "@tanstack/react-router";
import cn from "classnames";
import {
  BarChart3,
  Grid2x2,
  LogOut,
  Server,
  Settings,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";

import { useProfileDataStore } from "~@store";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ to: "/", label: "Dashboard", icon: <Grid2x2 size={18} /> }],
  },
  {
    label: "Management",
    items: [{ to: "/users", label: "Users", icon: <Users size={18} /> }],
  },
  {
    label: "WireGuard VPN",
    items: [
      {
        to: "/wireguard/servers",
        label: "Servers",
        icon: <Server size={18} />,
      },
      { to: "/wireguard/peers", label: "Peers", icon: <Zap size={18} /> },
      {
        to: "/wireguard/stats",
        label: "Statistics",
        icon: <BarChart3 size={18} />,
      },
    ],
  },
  {
    items: [
      { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
    ],
  },
];

const NavItemComponent: FC<{ item: NavItem }> = ({ item }) => {
  const state = useRouterState();
  const currentPath = state.location.pathname;
  const isActive =
    item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);

  return (
    <Link
      to={item.to as any}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
        isActive
          ? "bg-[var(--bg-sidebar-item-active)] text-[var(--text-sidebar-active)] font-medium"
          : "text-[var(--text-sidebar)] hover:bg-[var(--bg-sidebar-item-hover)] hover:text-[var(--text-sidebar-active)]",
      )}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span>{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span className="ml-auto bg-[#6366f1] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );
};

interface SidebarProps {
  onSignOut: () => void;
}

export const Sidebar: FC<SidebarProps> = observer(({ onSignOut }) => {
  const { profile } = useProfileDataStore();

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Admin";

  const initials =
    [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .map(s => s![0])
      .join("")
      .toUpperCase() || "A";

  return (
    <aside className="w-56 flex-shrink-0 h-screen flex flex-col bg-[var(--bg-sidebar)] border-r border-[rgba(255,255,255,0.06)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="w-7 h-7 bg-[#6366f1] rounded-lg flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[var(--text-sidebar-active)] text-sm font-semibold leading-none">
            WireGuard
          </p>
          <p className="text-[var(--text-muted)] text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-5">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {group.label && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map(item => (
              <NavItemComponent key={item.to} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* User area */}
      <div className="px-3 py-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--text-sidebar-active)] truncate">
              {displayName}
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-sidebar)] hover:bg-[var(--bg-sidebar-item-hover)] hover:text-[#ef4444] transition-all duration-150 mt-0.5"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
});
