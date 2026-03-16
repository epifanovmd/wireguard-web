import { Skeleton, Table as MantineTable } from "@mantine/core";
import React, { ReactNode } from "react";

import { Empty } from "../empty/Empty";

export type ColumnAlign = "left" | "center" | "right";

export interface TableColumn<T = any> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string | number;
  align?: ColumnAlign;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((record: T) => string | number);
  loading?: boolean;
  emptyText?: string;
  emptyDescription?: string;
  onRowClick?: (record: T) => void;
  className?: string;
  rowClassName?: string | ((record: T, index: number) => string);
  skeletonRows?: number;
}

function getRowKey<T>(
  record: T,
  idx: number,
  rowKey: TableProps<T>["rowKey"],
): string {
  if (!rowKey) return String(idx);
  if (typeof rowKey === "function") return String(rowKey(record));
  return String((record as any)[rowKey] ?? idx);
}

export function Table<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = "No data",
  emptyDescription,
  onRowClick,
  className,
  rowClassName,
  skeletonRows = 5,
}: TableProps<T>) {
  return (
    <MantineTable.ScrollContainer minWidth={500} className={className}>
      <MantineTable highlightOnHover={!!onRowClick}>
        <MantineTable.Thead>
          <MantineTable.Tr>
            {columns.map(col => (
              <MantineTable.Th key={col.key}>{col.title}</MantineTable.Th>
            ))}
          </MantineTable.Tr>
        </MantineTable.Thead>
        <MantineTable.Tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <MantineTable.Tr key={i}>
                {columns.map(col => (
                  <MantineTable.Td key={col.key}>
                    <Skeleton height={16} radius="sm" />
                  </MantineTable.Td>
                ))}
              </MantineTable.Tr>
            ))
          ) : data.length === 0 ? (
            <MantineTable.Tr>
              <MantineTable.Td colSpan={columns.length}>
                <Empty title={emptyText} description={emptyDescription} />
              </MantineTable.Td>
            </MantineTable.Tr>
          ) : (
            data.map((record, idx) => {
              const extraClass =
                typeof rowClassName === "function"
                  ? rowClassName(record, idx)
                  : rowClassName;

              return (
                <MantineTable.Tr
                  key={getRowKey(record, idx, rowKey)}
                  onClick={() => onRowClick?.(record)}
                  style={{ cursor: onRowClick ? "pointer" : undefined }}
                  className={extraClass}
                >
                  {columns.map(col => {
                    const value =
                      col.dataIndex !== undefined
                        ? (record as any)[col.dataIndex]
                        : undefined;

                    return (
                      <MantineTable.Td key={col.key}>
                        {col.render
                          ? col.render(value, record, idx)
                          : value != null
                            ? String(value)
                            : "—"}
                      </MantineTable.Td>
                    );
                  })}
                </MantineTable.Tr>
              );
            })
          )}
        </MantineTable.Tbody>
      </MantineTable>
    </MantineTable.ScrollContainer>
  );
}
