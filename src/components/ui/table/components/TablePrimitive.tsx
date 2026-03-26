import * as React from "react";

import { cn } from "../../cn";
import { TableContext } from "./TableContext";
import {
  tableCellVariants,
  tableHeadVariants,
  tableVariants,
} from "./tableVariants";

const TableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);

  return (
    <table
      ref={ref}
      className={cn(tableVariants({ variant }), className)}
      {...props}
    />
  );
});

TableRoot.displayName = "TableRoot";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b bg-muted/50", className)}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 relative", className)}
    {...props}
  />
));

TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));

TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <tr
    ref={ref}
    data-state={selected ? "selected" : undefined}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-primary/5",
      className,
    )}
    {...props}
  />
));

TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(TableContext);

  return (
    <th
      ref={ref}
      className={cn(tableHeadVariants({ size }), className)}
      {...props}
    />
  );
});

TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { size } = React.useContext(TableContext);

  return (
    <td
      ref={ref}
      className={cn(tableCellVariants({ size }), className)}
      {...props}
    />
  );
});

TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";

export {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
};
