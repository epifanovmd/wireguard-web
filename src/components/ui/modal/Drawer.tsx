import { Drawer as MantineDrawer } from "@mantine/core";
import React, { FC, ReactNode } from "react";

export type DrawerPlacement = "right" | "left";
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

const SIZE_MAP: Record<DrawerSize, string> = {
  sm: "320px",
  md: "480px",
  lg: "640px",
  xl: "800px",
  full: "100%",
};

export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: string;
  size?: DrawerSize;
  placement?: DrawerPlacement;
  closable?: boolean;
  maskClosable?: boolean;
  className?: string;
  bodyClassName?: string;
}

export const Drawer: FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  width,
  size = "md",
  placement = "right",
  closable = true,
  maskClosable = true,
  className,
  bodyClassName,
}) => {
  return (
    <MantineDrawer
      opened={open}
      onClose={onClose ?? (() => {})}
      title={title}
      position={placement}
      size={width ?? SIZE_MAP[size]}
      withCloseButton={closable}
      closeOnClickOutside={maskClosable}
      className={className}
      classNames={{ body: bodyClassName }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[var(--border)] sticky bottom-0 bg-[var(--card)]">
            {footer}
          </div>
        )}
      </div>
    </MantineDrawer>
  );
};
