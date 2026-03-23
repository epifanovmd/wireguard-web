import { Menu } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { Button, cn } from "~@components/ui";

import { AppLogoLink } from "../app-logo-link";
import { useSidebarVM } from "./hooks";
import { NavContent } from "./shared";

interface SidebarProps {
  onSignOut: () => void;
}

export const Sidebar: FC<SidebarProps> = observer(({ onSignOut }) => {
  const { displayName, initials, visibleGroups, mobileOpen, setMobileOpen } =
    useSidebarVM();

  const navContentProps = { displayName, initials, visibleGroups, onSignOut };

  return (
    <div>
      <aside className="w-56 flex-shrink-0 h-screen hidden md:flex flex-col bg-sidebar border-r border-sidebar-border">
        <NavContent {...navContentProps} />
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-3 px-3 bg-sidebar border-b border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-9 h-9 p-0 text-sidebar-foreground")}
          onClick={() => setMobileOpen(true)}
          aria-label="Открыть меню"
        >
          <Menu size={18} />
        </Button>
        <AppLogoLink />
      </header>

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
            <DrawerPrimitive.Title className="sr-only">
              Навигация
            </DrawerPrimitive.Title>
            <NavContent
              {...navContentProps}
              onClose={() => setMobileOpen(false)}
            />
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    </div>
  );
});
