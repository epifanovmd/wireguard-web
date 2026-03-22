import { Link } from "@tanstack/react-router";
import { ShieldCheck, X } from "lucide-react";
import { FC } from "react";

import { Button, cn } from "~@components/ui";

interface SidebarLogoProps {
  onClose?: () => void;
}

export const SidebarLogo: FC<SidebarLogoProps> = ({ onClose }) => (
  <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
    <Link to="/" className="flex items-center gap-2.5">
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
    </Link>

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
