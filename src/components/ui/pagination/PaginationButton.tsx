import * as React from "react";

import { Button } from "../button";

interface PaginationButtonProps {
  page: number;
  isActive: boolean;
  size: "sm" | "md" | "lg";
  onClick: (page: number) => void;
}

export const PaginationButton = React.memo(
  ({ page, isActive, size, onClick }: PaginationButtonProps) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size={size}
      onClick={() => onClick(page)}
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? "page" : undefined}
      className="min-w-10"
    >
      {page}
    </Button>
  ),
  (prev, next) =>
    prev.page === next.page &&
    prev.isActive === next.isActive &&
    prev.size === next.size &&
    prev.onClick === next.onClick,
);

PaginationButton.displayName = "PaginationButton";
