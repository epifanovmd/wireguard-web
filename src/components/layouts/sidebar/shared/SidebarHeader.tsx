import { X } from "lucide-react";
import { FC } from "react";

import { AppLogoLink } from "~@components/layouts/app-logo-link";
import { Button, cn } from "~@components/ui";

interface SidebarLogoProps {
  onClose?: () => void;
}

export const SidebarHeader: FC<SidebarLogoProps> = ({ onClose }) => (
  <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
    <AppLogoLink size="sm" />

    {onClose && (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "w-7 h-7 p-0 text-sidebar-foreground",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
        onClick={onClose}
        aria-label="Закрыть меню"
      >
        <X size={15} />
      </Button>
    )}
  </div>
);
