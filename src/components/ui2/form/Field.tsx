import { Info } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import type { FieldProps } from "./types";

export type { FieldProps };

export const Field = React.forwardRef<
  HTMLDivElement,
  FieldProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      label,
      hint,
      description,
      error,
      required,
      htmlFor,
      fieldClassName,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5", fieldClassName ?? className)}
      {...props}
    >
      {label !== undefined && (
        <div className="flex items-center gap-1.5 min-h-[1.25rem]">
          <label
            htmlFor={htmlFor}
            className={cn(
              "text-sm font-medium text-foreground leading-none select-none",
              !htmlFor && "cursor-default",
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden>
                *
              </span>
            )}
          </label>

          {hint !== undefined && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    role="img"
                    aria-label="Hint"
                    className="inline-flex items-center cursor-help text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[260px] text-xs">
                  {hint}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {children}

      {error ? (
        <p role="alert" className="text-xs text-destructive leading-tight">
          {error}
        </p>
      ) : description !== undefined ? (
        <p className="text-xs text-muted-foreground leading-tight">
          {description}
        </p>
      ) : null}
    </div>
  ),
);
Field.displayName = "Field";
