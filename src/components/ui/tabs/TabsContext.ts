import * as React from "react";

export interface TabsContextValue {
  variant?: "default" | "underline" | null;
  size?: "sm" | "md" | "lg" | null;
}

export const TabsContext = React.createContext<TabsContextValue>({
  variant: "default",
  size: "md",
});
