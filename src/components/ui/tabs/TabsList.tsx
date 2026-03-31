import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "../cn";
import { TabsContext } from "./TabsContext";
import { tabsListVariants, tabsMotionVariants } from "./tabsVariants";

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [left, setLeft] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [hasActive, setHasActive] = React.useState(false);

  const count = React.useMemo(
    () => React.Children.toArray(children).length,
    [children],
  );

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;

    if (!list) return;

    const active = list.querySelector<HTMLElement>('[data-state="active"]');

    if (!active) {
      setHasActive(false);

      return;
    }

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const newLeft = activeRect.left - listRect.left;
    const newWidth = activeRect.width;

    setHasActive(true);
    setLeft(prev => (prev === newLeft ? prev : newLeft));
    setWidth(prev => (prev === newWidth ? prev : newWidth));
  }, []);

  React.useEffect(() => {
    const list = listRef.current;

    if (!list) return;

    const observer = new MutationObserver(updateIndicator);

    observer.observe(list, {
      attributes: true,
      attributeFilter: ["data-state"],
      subtree: true,
    });

    updateIndicator();

    return () => observer.disconnect();
  }, [updateIndicator]);

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  const ctxValue = React.useMemo(() => ({ variant, size }), [variant, size]);

  if (count <= 1) {
    return null;
  }

  return (
    <TabsContext.Provider value={ctxValue}>
      <TabsPrimitive.List
        ref={mergedRef}
        className={cn(
          "relative",
          tabsListVariants({ variant, size, className }),
        )}
        {...props}
      >
        {hasActive && (
          <motion.div
            className={tabsMotionVariants({ variant })}
            initial={false}
            animate={{ x: left, width }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ position: "absolute", left: 0 }}
          />
        )}
        {children}
      </TabsPrimitive.List>
    </TabsContext.Provider>
  );
});

TabsList.displayName = TabsPrimitive.List.displayName;

export { TabsList };
