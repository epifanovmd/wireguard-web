import { Loader, Overlay } from "@mantine/core";
import React, { forwardRef } from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<SpinnerSize, number | string> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
};

export interface SpinnerProps {
  className?: string;
  size?: SpinnerSize;
  fullscreen?: boolean;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "sm", className, fullscreen }, ref) => {
    const loader = (
      <Loader ref={ref} size={SIZE_MAP[size]} className={className} />
    );

    if (fullscreen) {
      return (
        <Overlay
          fixed
          blur={4}
          backgroundOpacity={0.5}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          {loader}
        </Overlay>
      );
    }

    return loader;
  },
);
