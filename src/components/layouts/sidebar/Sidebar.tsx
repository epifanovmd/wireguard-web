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
import { FC, ReactNode, useState } from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { Button, ButtonLink, cn, ThemeToggle } from "~@components/ui";
import { useAuthStore } from "~@store";

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
    items: [{ to: "/", label: "Дашборд", icon: <Grid2x2 size={17} /> }],
  },
  {
    label: "Управление",
    items: [{ to: "/users", label: "Пользователи", icon: <Users size={17} /> }],
  },
  {
    label: "WireGuard VPN",
    items: [
      {
        to: "/wireguard/servers",
        label: "Серверы",
        icon: <Server size={17} />,
      },
      { to: "/wireguard/peers", label: "Пиры", icon: <Zap size={17} /> },
      {
        to: "/wireguard/stats",
        label: "Статистика",
        icon: <BarChart3 size={17} />,
      },
    ],
  },
  {
    items: [
      { to: "/settings", label: "Настройки", icon: <Settings size={17} /> },
    ],
  },
];

interface NavContentProps {
  onSignOut: () => void;
  displayName: string;
  initials: string;
  onClose?: () => void;
}

export const NavContent: FC<NavContentProps> = ({
  onSignOut,
  displayName,
  initials,
  onClose,
}) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <ShieldCheck size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sidebar-foreground text-sm font-semibold leading-none">
            WireGuard
          </p>
          <p className="text-muted-foreground text-[11px] mt-0.5">
            Панель управления
          </p>
        </div>
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-7 h-7 p-0",
            "text-sidebar-foreground",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={15} />
        </Button>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1">
              {group.label}
            </p>
          )}
          {group.items.map(item => (
            <div key={item.to as string} onClick={onClose}>
              <ButtonLink
                to={item.to}
                size="sm"
                leftIcon={item.icon}
                className={"justify-start w-full"}
              >
                {item.label}
              </ButtonLink>
            </div>
          ))}
        </div>
      ))}
      <ThemeToggle />
    </nav>

    {/* User area */}
    <div className="flex flex-col px-2 py-2 gap-2 border-t border-sidebar-border">
      <div onClick={onClose}>
        <ButtonLink
          to="/profile"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 font-normal mb-0.5"
        >
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {displayName}
            </p>
          </div>
        </ButtonLink>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSignOut}
        className={cn(
          "w-full justify-start gap-2.5",
          "hover:bg-sidebar-accent hover:text-destructive",
        )}
      >
        <LogOut size={15} className="opacity-70" />
        <span>Выйти</span>
      </Button>
    </div>
  </div>
);

interface SidebarProps {
  onSignOut: () => void;
}

export const Sidebar: FC<SidebarProps> = observer(({ onSignOut }) => {
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "Admin";
  const initials =
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .map(s => s![0])
      .join("")
      .toUpperCase() || (user?.email?.[0] ?? "A").toUpperCase();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-56 flex-shrink-0 h-screen hidden md:flex flex-col bg-sidebar border-r border-sidebar-border">
        <NavContent
          onSignOut={onSignOut}
          displayName={displayName}
          initials={initials}
        />
      </aside>

      {/* Mobile header bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-3 px-3 bg-sidebar border-b border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-9 h-9 p-0",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <ShieldCheck size={15} className="text-white" />
          </div>
          <p className="text-sidebar-foreground text-sm font-semibold">
            WireGuard
          </p>
        </div>
      </header>

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
          <DrawerPrimitive.Content className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col bg-sidebar border-r border-sidebar-border outline-none">
            <NavContent
              onSignOut={onSignOut}
              displayName={displayName}
              initials={initials}
              onClose={() => setMobileOpen(false)}
            />
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    </>
  );
});
