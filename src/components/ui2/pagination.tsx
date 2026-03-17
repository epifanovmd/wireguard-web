import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "./button";
import { cn } from "./cn";

const paginationVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface PaginationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
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
    const getPageNumbers = () => {
      const pages: (number | "ellipsis")[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push("ellipsis");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("ellipsis");
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push("ellipsis");
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
          pages.push("ellipsis");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";

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
          size={buttonSize}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, idx) => {
          if (page === "ellipsis") {
            return (
              <Button
                key={`ellipsis-${idx}`}
                variant="ghost"
                size={buttonSize}
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size={buttonSize}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className="min-w-10"
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";

export { Pagination };
