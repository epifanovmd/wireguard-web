import * as React from "react";

import { type UseCollapseResult } from "./useCollapse";

export type CollapseVariant = "ghost" | "default" | "filled" | "bordered";
export type CollapseSize = "sm" | "md" | "lg";

export interface CollapseContextValue extends UseCollapseResult {
  triggerId: string;
  contentId: string;
  variant: CollapseVariant;
  size: CollapseSize;
}

export const CollapseContext = React.createContext<CollapseContextValue | null>(null);

export const useCollapseContext = (): CollapseContextValue => {
  const ctx = React.useContext(CollapseContext);

  if (!ctx) throw new Error("Collapse compound components must be used within <Collapse>");

  return ctx;
};
