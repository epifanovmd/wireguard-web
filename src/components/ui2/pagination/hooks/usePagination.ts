import { useMemo } from "react";

export type PageItem = number | "ellipsis";

export interface UsePaginationOptions {
  currentPage: number;
  totalPages: number;
}

export interface UsePaginationResult {
  pages: PageItem[];
  hasPrev: boolean;
  hasNext: boolean;
}

export const usePagination = ({
  currentPage,
  totalPages,
}: UsePaginationOptions): UsePaginationResult => {
  const pages = useMemo<PageItem[]>(() => {
    const result: PageItem[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) result.push(i);
      result.push("ellipsis");
      result.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      result.push(1);
      result.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);
      result.push("ellipsis");
      result.push(currentPage - 1);
      result.push(currentPage);
      result.push(currentPage + 1);
      result.push("ellipsis");
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);

  return {
    pages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
};
