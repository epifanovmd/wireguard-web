import * as React from "react";

import { cn } from "../../cn";
import { Spinner } from "../../spinner";

export const SelectLoading = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center px-2 py-6", className)}>
    <Spinner size="md" />
  </div>
);
SelectLoading.displayName = "SelectLoading";
