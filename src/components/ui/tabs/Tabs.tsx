import { Tabs as MantineTabs } from "@mantine/core";
import React, { forwardRef, useState } from "react";

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  renderContent?: boolean;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      defaultActiveKey,
      activeKey: controlledKey,
      onChange,
      className,
      tabsClassName,
      contentClassName,
      renderContent = true,
    },
    ref,
  ) => {
    const [internalKey, setInternalKey] = useState(
      defaultActiveKey ?? items[0]?.key ?? "",
    );
    const active = controlledKey ?? internalKey;

    const handleChange = (key: string | null) => {
      if (!key) return;
      setInternalKey(key);
      onChange?.(key);
    };

    return (
      <MantineTabs
        ref={ref}
        value={active}
        onChange={handleChange}
        className={className}
      >
        <MantineTabs.List className={tabsClassName}>
          {items.map(item => (
            <MantineTabs.Tab
              key={item.key}
              value={item.key}
              disabled={item.disabled}
              leftSection={item.icon}
            >
              {item.label}
            </MantineTabs.Tab>
          ))}
        </MantineTabs.List>

        {renderContent &&
          items.map(item => (
            <MantineTabs.Panel
              key={item.key}
              value={item.key}
              pt="md"
              className={contentClassName}
            >
              {item.children}
            </MantineTabs.Panel>
          ))}
      </MantineTabs>
    );
  },
);

Tabs.displayName = "Tabs";
