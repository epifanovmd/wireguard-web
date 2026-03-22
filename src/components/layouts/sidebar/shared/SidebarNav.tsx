import { FC } from "react";

import { ButtonLink } from "~@components/ui";

import { NAV_ICON_SIZE, NavGroup } from "../constants";

interface SidebarNavProps {
  visibleGroups: NavGroup[];
  onClose?: () => void;
}

export const SidebarNav: FC<SidebarNavProps> = ({ visibleGroups, onClose }) => (
  <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4">
    {visibleGroups.map((group, gi) => (
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
              leftIcon={<item.icon size={NAV_ICON_SIZE} />}
              className="justify-start w-full"
            >
              {item.label}
            </ButtonLink>
          </div>
        ))}
      </div>
    ))}
  </nav>
);
