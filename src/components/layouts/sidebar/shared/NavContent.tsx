import { FC } from "react";

import { NavGroup } from "../constants";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav } from "./SidebarNav";

export interface NavContentProps {
  displayName: string;
  initials: string;
  visibleGroups: NavGroup[];
  onSignOut: () => void;
  onClose?: () => void;
}

export const NavContent: FC<NavContentProps> = ({
  displayName,
  initials,
  visibleGroups,
  onSignOut,
  onClose,
}) => (
  <div className="flex flex-col h-full">
    <SidebarLogo onClose={onClose} />
    <SidebarNav visibleGroups={visibleGroups} onClose={onClose} />
    <SidebarFooter
      displayName={displayName}
      initials={initials}
      onSignOut={onSignOut}
      onClose={onClose}
    />
  </div>
);
