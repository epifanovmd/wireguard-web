import * as React from "react";

import { Pagination } from "../../pagination";
import { Select } from "../../select";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export interface TablePaginationProps {
  totalPages: number;
  currentPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  totalPages,
  currentPage = 1,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
}) => {
  const showNav = totalPages > 1;
  const showSizeSelector = !!onPageSizeChange && pageSize !== undefined;

  const options = React.useMemo(
    () =>
      pageSizeOptions.map(n => ({
        value: String(n),
        label: `${n} / стр.`,
      })),
    [pageSizeOptions],
  );

  return (
    <div className="flex items-center justify-between p-4">
      <p className="text-xs text-muted-foreground">
        {showNav && (
          <>
            Страница {currentPage} из {totalPages}
          </>
        )}
      </p>

      <div className="flex items-center gap-3">
        {showNav && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange ?? (() => {})}
            size="sm"
          />
        )}
        {showSizeSelector && (
          <Select
            options={options}
            value={String(pageSize)}
            onValueChange={v => onPageSizeChange!(Number(v))}
            triggerSize="sm"
            triggerClassName="w-[110px]"
          />
        )}
      </div>
    </div>
  );
};
