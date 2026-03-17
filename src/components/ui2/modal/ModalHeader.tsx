import * as React from "react";

import { cn } from "../cn";

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6 pb-4 text-center sm:text-left", className)}
    {...props}
  />
);
ModalHeader.displayName = "ModalHeader";
