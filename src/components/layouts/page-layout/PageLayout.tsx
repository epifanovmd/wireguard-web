import { FC, ReactNode } from "react";

import { cn } from "../../ui";

export interface PageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({
  header,
  children,
  contentClassName,
}) => (
  <div className="flex flex-col h-full overflow-hidden">
    {header}
    <div className="flex-1 min-h-0 overflow-auto flex flex-col">
      <div className={cn("p-3 sm:p-6 flex-1 flex flex-col", contentClassName)}>
        {children}
      </div>
    </div>
  </div>
);
