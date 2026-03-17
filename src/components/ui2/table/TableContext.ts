import * as React from "react";

export interface TableContextValue {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "striped" | "bordered";
}

export const TableContext = React.createContext<TableContextValue>({
  size: "md",
  variant: "default",
});
