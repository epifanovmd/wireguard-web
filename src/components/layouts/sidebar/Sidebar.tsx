import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Grid2x2,
  LogOut,
  Menu,
  Server,
  Settings,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, ReactNode, useState } from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { ThemeToggle } from "~@components/ui2";
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
      { to: "/wireguard/servers", label: "Servers", icon: <Server size={18} /> },
      { to: "/wireguard/peers", label: "Peers", icon: <Zap size={18} /> },
      { to: "/wireguard/stats", label: "Statistics", icon: <BarChart3 size={18} /> },
    ],
  },
  {
    items: [
      { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
    ],
  },
];

const NavItemComponent: FC<{ item: NavItem; onClick?: () => void }> = ({ item, onClick }) => {
  const state = useRouterState();
  const currentPath = state.location.pathname;
  const isActive =
    item.to === "/" ? currentPath === "/" : currentPath.startsWith(item.to);

  return (
    <Link
      to={item.to as any}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
        isActive
          ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-medium"
          : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-primary-foreground)]"
      }`}
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

interface NavContentProps {
  onSignOut: () => void;
  onNavClick?: () => void;
  displayName: string;
  initials: string;
}

export const NavContent: FC<NavContentProps> = ({ onSignOut, onNavClick, displayName, initials }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
      <div className="w-7 h-7 bg-[#6366f1] rounded-lg flex items-center justify-center flex-shrink-0">
        <ShieldCheck size={16} className="text-white" />
      </div>
      <div>
        <p className="text-[var(--sidebar-primary-foreground)] text-sm font-semibold leading-none">
          WireGuard
        </p>
        <p className="text-[var(--muted-foreground)] text-xs mt-0.5">Admin Panel</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-5">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] px-3 mb-1">
              {group.label}
            </p>
          )}
          {group.items.map(item => (
            <NavItemComponent key={item.to} item={item} onClick={onNavClick} />
          ))}
        </div>
      ))}
      <ThemeToggle />
    </nav>

    {/* User area */}
    <div className="px-3 py-3 border-t border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <div className="w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--sidebar-primary-foreground)] truncate">
            {displayName}
          </p>
        </div>
      </div>
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[#ef4444] transition-all duration-150 mt-0.5 cursor-pointer"
      >
        <LogOut size={18} />
        <span>Sign out</span>
      </button>
    </div>
  </div>
);

interface SidebarProps {
  onSignOut: () => void;
}

export const Sidebar: FC<SidebarProps> = observer(({ onSignOut }) => {
  const { profile } = useProfileDataStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Admin";
  const initials =
    [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .map(s => s![0])
      .join("")
      .toUpperCase() || "A";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-56 flex-shrink-0 h-screen hidden md:flex flex-col bg-[var(--sidebar)] border-r border-[rgba(255,255,255,0.06)]">
        <NavContent
          onSignOut={onSignOut}
          displayName={displayName}
          initials={initials}
        />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--sidebar)] border border-[rgba(255,255,255,0.1)] text-[var(--sidebar-foreground)] shadow-md cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer (left-side) */}
      <DrawerPrimitive.Root
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        direction="left"
      >
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <DrawerPrimitive.Content className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col bg-[var(--sidebar)] border-r border-[rgba(255,255,255,0.06)] outline-none">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
              <p className="text-[var(--sidebar-primary-foreground)] text-sm font-semibold">
                WireGuard Admin
              </p>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent
                onSignOut={onSignOut}
                onNavClick={() => setMobileOpen(false)}
                displayName={displayName}
                initials={initials}
              />
            </div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    </>
  );
});
