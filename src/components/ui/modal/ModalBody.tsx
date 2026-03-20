import * as React from "react";

import { cn } from "../cn";

export const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6", className)} {...props} />
);
ModalBody.displayName = "ModalBody";
