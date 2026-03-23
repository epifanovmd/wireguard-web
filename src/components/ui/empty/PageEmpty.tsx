import * as React from "react";

import { cn } from "../cn";
import { Empty, type EmptyProps } from "./Empty";

export type PageEmptyProps = EmptyProps;

const PageEmpty = React.forwardRef<HTMLDivElement, PageEmptyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 flex items-center justify-center", className)}
    >
      <Empty {...props} />
    </div>
  ),
);
PageEmpty.displayName = "PageEmpty";

export { PageEmpty };
