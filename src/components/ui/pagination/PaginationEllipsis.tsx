import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "../button";

interface PaginationEllipsisProps {
  size: "sm" | "md" | "lg";
}

export const PaginationEllipsis = React.memo(({ size }: PaginationEllipsisProps) => (
  <Button variant="ghost" size={size} disabled aria-hidden>
    <MoreHorizontal className="h-4 w-4" />
  </Button>
));

PaginationEllipsis.displayName = "PaginationEllipsis";
