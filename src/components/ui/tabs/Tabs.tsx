import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { TabsContent } from "./TabsContent";
import { TabsList, type TabsListProps } from "./TabsList";
import { TabsTrigger } from "./TabsTrigger";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  items?: TabItem[];
  listProps?: TabsListProps;
}

const _Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ items, listProps, children, ...props }, ref) => {
  if (items) {
    return (
      <TabsPrimitive.Root ref={ref} {...props}>
        <TabsList {...listProps}>
          {items.map(item => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.icon && <span className="inline-flex">{item.icon}</span>}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map(
          item =>
            item.content !== undefined && (
              <TabsContent key={item.value} value={item.value}>
                {item.content}
              </TabsContent>
            ),
        )}
      </TabsPrimitive.Root>
    );
  }

  return (
    <TabsPrimitive.Root ref={ref} {...props}>
      {children}
    </TabsPrimitive.Root>
  );
});

_Tabs.displayName = "Tabs";

export const Tabs = Object.assign(_Tabs, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
