import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../cn";
import { TabsContext } from "./TabsContext";
import { tabsListVariants } from "./tabsVariants";

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, children, ...props }, ref) => {
  const layoutId = React.useId();

  const count = React.Children.toArray(children).length;

  if (count <= 1) {
    return null;
  }

  return (
    <TabsContext.Provider value={{ layoutId, variant, size }}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    </TabsContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

export { TabsList };
