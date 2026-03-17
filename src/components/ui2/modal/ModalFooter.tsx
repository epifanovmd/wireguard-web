import * as React from "react";

import { cn } from "../cn";

export const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse p-6 pt-4 gap-2 sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";
