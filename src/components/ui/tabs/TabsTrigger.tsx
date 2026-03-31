import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../cn";
import { TabsContext } from "./TabsContext";
import { tabsTriggerVariants } from "./tabsVariants";

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    { className, variant: variantProp, size: sizeProp, children, ...props },
    ref,
  ) => {
    const { variant: contextVariant, size: contextSize } =
      React.useContext(TabsContext);
    const variant = variantProp || contextVariant;
    const size = sizeProp || contextSize;

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTriggerVariants({ variant, size, className }))}
        {...props}
      >
        <span className="relative z-10 min-w-0 overflow-hidden shrink truncate">
          {children}
        </span>
      </TabsPrimitive.Trigger>
    );
  },
);

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { TabsTrigger };
