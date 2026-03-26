import { useAuthStore, usePermissions } from "@store";
import { useState } from "react";

import { NAV_GROUPS } from "../constants";

export const useSidebarVM = () => {
  const { user } = useAuthStore();
  const { hasPermission, isAdmin } = usePermissions();
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

  const visibleGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.adminOnly && !isAdmin) return false;

      return !item.permissions || item.permissions.some(hasPermission);
    }),
  })).filter(group => group.items.length > 0);

  return {
    displayName,
    initials,
    visibleGroups,
    mobileOpen,
    setMobileOpen,
  };
};
