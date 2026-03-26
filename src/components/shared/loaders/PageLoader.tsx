import * as React from "react";

import { cn, Spinner } from "../../ui";

export interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  ({ className, label, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-3",
        className,
      )}
      {...props}
    >
      <Spinner size="lg" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  ),
);

PageLoader.displayName = "PageLoader";

export { PageLoader };
