import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "./cn";

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        underline: "bg-transparent border-b border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer relative",
  {
    variants: {
      variant: {
        default: "data-[state=active]:text-foreground",
        underline: "rounded-none data-[state=active]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const Tabs = TabsPrimitive.Root;

// Context to share layoutId and variant between TabsList and TabsTrigger
const TabsContext = React.createContext<{
  layoutId: string;
  variant?: "default" | "underline";
}>({
  layoutId: "",
  variant: "default",
});

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => {
  const layoutId = React.useId();

  return (
    <TabsContext.Provider value={{ layoutId, variant }}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant, className }))}
        {...props}
      />
    </TabsContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant: variantProp, children, ...props }, ref) => {
  const { layoutId, variant: contextVariant } = React.useContext(TabsContext);
  const variant = variantProp || contextVariant;
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

    // Initial state
    setIsActive(trigger.getAttribute("data-state") === "active");

    return () => observer.disconnect();
  }, []);

  return (
    <TabsPrimitive.Trigger
      ref={triggerRef}
      className={cn(tabsTriggerVariants({ variant, className }))}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId={`${layoutId}-indicator`}
          className={cn(
            "absolute inset-0 z-0",
            variant === "default" && "bg-background shadow-sm rounded-md",
            variant === "underline" &&
              "border-b-2 border-primary top-auto h-0.5 rounded-none",
          )}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
