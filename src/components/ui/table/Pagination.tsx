import { Pagination as MantinePagination } from "@mantine/core";
import React, { FC } from "react";

import { cn } from "../cn";

export interface PaginationProps {
  total: number;
  offset: number;
  limit: number;
  onChange: (offset: number) => void;
  className?: string;
}

export const Pagination: FC<PaginationProps> = ({
  total,
  offset,
  limit,
  onChange,
  className,
}) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  if (totalPages <= 1) return null;

  return (
    <div className={cn(`flex justify-end p-3`, className)}>
      <MantinePagination
        total={totalPages}
        value={currentPage}
        onChange={page => onChange((page - 1) * limit)}
      />
    </div>
  );
};
