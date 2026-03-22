import { LogOut, Settings } from "lucide-react";
import { FC } from "react";

import { Button, ButtonLink, cn, ThemeToggle } from "~@components/ui";

const ICON_SIZE = 15;

interface SidebarFooterProps {
  displayName: string;
  initials: string;
  onSignOut: () => void;
  onClose?: () => void;
}

export const SidebarFooter: FC<SidebarFooterProps> = ({
  displayName,
  initials,
  onSignOut,
  onClose,
}) => (
  <div className="flex flex-col px-2 py-2 gap-1 border-t border-sidebar-border">
    {/* Profile */}
    <div onClick={onClose}>
      <ButtonLink
        to="/profile"
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2.5 font-normal"
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

    {/* Settings + ThemeToggle */}
    <div className="flex items-center gap-1" onClick={onClose}>
      <ButtonLink
        to="/settings"
        variant="ghost"
        size="sm"
        leftIcon={<Settings size={ICON_SIZE} />}
        className="flex-1 justify-start"
      >
        Настройки
      </ButtonLink>
      <ThemeToggle />
    </div>

    <div className="border-t border-sidebar-border my-1" />

    {/* Logout */}
    <Button
      variant="ghost"
      size="sm"
      onClick={onSignOut}
      className={cn(
        "w-full justify-start gap-2.5",
        "hover:bg-sidebar-accent hover:text-destructive",
      )}
    >
      <LogOut size={ICON_SIZE} className="opacity-70" />
      <span>Выйти</span>
    </Button>
  </div>
);
