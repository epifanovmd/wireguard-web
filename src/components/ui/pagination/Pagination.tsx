import { type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "../button";
import { cn } from "../cn";
import { usePagination } from "./hooks";
import { PaginationButton } from "./PaginationButton";
import { PaginationEllipsis } from "./PaginationEllipsis";
import { paginationVariants } from "./paginationVariants";

export interface PaginationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

export const Pagination = React.memo(
  React.forwardRef<HTMLElement, PaginationProps>(
    (
      {
        className,
        size,
        currentPage,
        totalPages,
        onPageChange,
        showFirstLast = true,
        ...props
      },
      ref,
    ) => {
      const { pages, hasPrev, hasNext } = usePagination({ currentPage, totalPages });
      const btnSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";

      return (
        <nav
          ref={ref}
          role="navigation"
          aria-label="pagination"
          className={cn(paginationVariants({ size, className }))}
          {...props}
        >
          <Button
            variant="outline"
            size={btnSize}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pages.map((page, idx) =>
            page === "ellipsis" ? (
              <PaginationEllipsis key={`ellipsis-${idx}`} size={btnSize} />
            ) : (
              <PaginationButton
                key={page}
                page={page}
                isActive={currentPage === page}
                size={btnSize}
                onClick={onPageChange}
              />
            ),
          )}

          <Button
            variant="outline"
            size={btnSize}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      );
    },
  ),
);

Pagination.displayName = "Pagination";
