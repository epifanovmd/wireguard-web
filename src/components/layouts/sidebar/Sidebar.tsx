import { type LinkProps } from "@tanstack/react-router";
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

import { Button, ThemeToggle } from "~@components/ui2";
import { cn } from "~@components/ui2/cn";
import { useProfileDataStore } from "~@store";

import { ButtonLink } from "../../ui2/button";

interface NavItem {
  to: LinkProps["to"];
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
    items: [{ to: "/", label: "Dashboard", icon: <Grid2x2 size={17} /> }],
  },
  {
    label: "Management",
    items: [{ to: "/users", label: "Users", icon: <Users size={17} /> }],
  },
  {
    label: "WireGuard VPN",
    items: [
      {
        to: "/wireguard/servers",
        label: "Servers",
        icon: <Server size={17} />,
      },
      { to: "/wireguard/peers", label: "Peers", icon: <Zap size={17} /> },
      {
        to: "/wireguard/stats",
        label: "Statistics",
        icon: <BarChart3 size={17} />,
      },
    ],
  },
  {
    items: [
      { to: "/settings", label: "Settings", icon: <Settings size={17} /> },
    ],
  },
];

interface NavContentProps {
  onSignOut: () => void;
  displayName: string;
  initials: string;
}

export const NavContent: FC<NavContentProps> = ({
  onSignOut,
  displayName,
  initials,
}) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--sidebar-border)]">
      <div className="w-7 h-7 bg-[#6366f1] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
        <ShieldCheck size={15} className="text-white" />
      </div>
      <div>
        <p className="text-[var(--sidebar-foreground)] text-sm font-semibold leading-none">
          WireGuard
        </p>
        <p className="text-[var(--muted-foreground)] text-[11px] mt-0.5">
          Admin Panel
        </p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] px-3 mb-1">
              {group.label}
            </p>
          )}
          {group.items.map(item => (
            <ButtonLink
              to={item.to}
              size="sm"
              leftIcon={item.icon}
              className={"justify-start"}
            >
              {item.label}
            </ButtonLink>
          ))}
        </div>
      ))}
      <ThemeToggle />
    </nav>

    {/* User area */}
    <div className="px-2 py-2 border-t border-[var(--sidebar-border)]">
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5">
        <div className="w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--sidebar-foreground)] truncate">
            {displayName}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSignOut}
        className={cn(
          "w-full justify-start gap-2.5 font-normal",
          "hover:bg-[var(--sidebar-accent)] hover:text-destructive",
        )}
      >
        <LogOut size={15} className="opacity-70" />
        <span>Sign out</span>
      </Button>
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
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Admin";
  const initials =
    [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .map(s => s![0])
      .join("")
      .toUpperCase() || "A";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-56 flex-shrink-0 h-screen hidden md:flex flex-col bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]">
        <NavContent
          onSignOut={onSignOut}
          displayName={displayName}
          initials={initials}
        />
      </aside>

      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "md:hidden fixed top-3 left-3 z-50 w-9 h-9 p-0",
          "bg-[var(--sidebar)] border border-[var(--sidebar-border)]",
          "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]",
          "shadow-sm",
        )}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </Button>

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
          <DrawerPrimitive.Content className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] outline-none">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--sidebar-border)]">
              <p className="text-[var(--sidebar-foreground)] text-sm font-semibold">
                WireGuard Admin
              </p>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-7 h-7 p-0",
                  "text-[var(--sidebar-foreground)]",
                  "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]",
                )}
                onClick={() => setMobileOpen(false)}
              >
                <X size={15} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent
                onSignOut={onSignOut}
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
