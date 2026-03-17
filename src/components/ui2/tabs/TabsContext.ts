import * as React from "react";

export interface TabsContextValue {
  layoutId: string;
  variant?: "default" | "underline" | null;
}

export const TabsContext = React.createContext<TabsContextValue>({
  layoutId: "",
  variant: "default",
});
