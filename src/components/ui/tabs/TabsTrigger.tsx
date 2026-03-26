import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "../cn";
import { TabsContext } from "./TabsContext";
import { tabsMotionVariants, tabsTriggerVariants } from "./tabsVariants";

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
    const {
      layoutId,
      variant: contextVariant,
      size: contextSize,
    } = React.useContext(TabsContext);
    const variant = variantProp || contextVariant;
    const size = sizeProp || contextSize;
    const [isActive, setIsActive] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => triggerRef.current!);

    React.useEffect(() => {
      const trigger = triggerRef.current;

      if (!trigger) return;

      const observer = new MutationObserver(() => {
        setIsActive(trigger.getAttribute("data-state") === "active");
      });

      observer.observe(trigger, {
        attributes: true,
        attributeFilter: ["data-state"],
      });

      setIsActive(trigger.getAttribute("data-state") === "active");

      return () => observer.disconnect();
    }, []);

    return (
      <TabsPrimitive.Trigger
        ref={triggerRef}
        className={cn(tabsTriggerVariants({ variant, size, className }))}
        {...props}
      >
        {isActive && (
          <motion.div
            layoutId={`${layoutId}-indicator`}
            className={tabsMotionVariants({ variant })}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          />
        )}
        <span className="relative z-10 min-w-0 overflow-hidden shrink truncate">{children}</span>
      </TabsPrimitive.Trigger>
    );
  },
);

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { TabsTrigger };
