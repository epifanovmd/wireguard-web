import { type VariantProps } from "class-variance-authority";
import { Database, Inbox, Package, PackageSearch, Search } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { emptyIconVariants, emptyVariants } from "./emptyVariants";

export interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {
  icon?:
    | "inbox"
    | "search"
    | "package"
    | "database"
    | "question"
    | React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const iconMap = {
  inbox: Inbox,
  search: Search,
  package: Package,
  database: Database,
  question: PackageSearch,
};

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      size,
      icon = "inbox",
      title = "Нет данных",
      description,
      action,
      children,
      ...props
    },
    ref,
  ) => {
    const renderIcon = () => {
      if (React.isValidElement(icon)) {
        return icon;
      }

      const IconComponent =
        iconMap[icon as keyof typeof iconMap] || Inbox;

      return (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-muted/60 blur-xl" />
          <div className="relative rounded-2xl border border-border/60 bg-muted/40 p-4 shadow-sm backdrop-blur-sm">
            <IconComponent className={cn(emptyIconVariants({ size }))} />
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(emptyVariants({ size }), className)}
        {...props}
      >
        {renderIcon()}
        <div className="flex flex-col items-center gap-1">
          {title && (
            <p className="font-medium text-foreground">{title}</p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
        {children}
      </div>
    );
  },
);

Empty.displayName = "Empty";

export { Empty };
