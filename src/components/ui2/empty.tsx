import { cva, type VariantProps } from "class-variance-authority";
import { Database, FileQuestion, Inbox, Package, Search } from "lucide-react";
import * as React from "react";

import { cn } from "./cn";

const emptyVariants = cva(
  "flex flex-col items-center justify-center text-center py-12 px-4",
  {
    variants: {
      size: {
        sm: "py-8 gap-2",
        md: "py-12 gap-3",
        lg: "py-16 gap-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const emptyIconVariants = cva("text-muted-foreground/50", {
  variants: {
    size: {
      sm: "h-12 w-12",
      md: "h-16 w-16",
      lg: "h-24 w-24",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

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

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      size,
      icon = "inbox",
      title = "No data",
      description,
      action,
      children,
      ...props
    },
    ref,
  ) => {
    const iconMap = {
      inbox: Inbox,
      search: Search,
      package: Package,
      database: Database,
      question: FileQuestion,
    };

    const renderIcon = () => {
      if (React.isValidElement(icon)) {
        return icon;
      }

      const IconComponent = iconMap[icon as keyof typeof iconMap] || Inbox;
      return <IconComponent className={cn(emptyIconVariants({ size }))} />;
    };

    return (
      <div
        ref={ref}
        className={cn(emptyVariants({ size }), className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {renderIcon()}
          <div className="space-y-1">
            {title && (
              <h3 className="font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground max-w-sm">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="mt-2">{action}</div>}
        {children}
      </div>
    );
  },
);
Empty.displayName = "Empty";

export { Empty, emptyVariants };
