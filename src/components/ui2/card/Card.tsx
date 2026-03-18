import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../cn";
import { CardContent } from "./CardContent";
import { CardDescription } from "./CardDescription";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "./CardTitle";
import { cardVariants } from "./cardVariants";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof cardVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
}

const _Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      title,
      description,
      extra,
      footer,
      contentClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const hasHeader = title || description || extra;

    return (
      <div
        className={cn(cardVariants({ variant, padding, className }))}
        ref={ref}
        {...props}
      >
        {hasHeader && (
          <CardHeader extra={extra}>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        {children && <CardContent className={contentClassName}>{children}</CardContent>}
        {footer && <CardFooter>{footer}</CardFooter>}
      </div>
    );
  },
);

_Card.displayName = "Card";

export const Card = Object.assign(_Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
