import cn from "classnames";
import { FC, ReactNode } from "react";

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
  <div className="flex-1 flex flex-col overflow-hidden">
    {header}
    <div className="flex-1 min-h-0 overflow-auto">
      <div className={cn("p-4 sm:p-6", contentClassName)}>{children}</div>
    </div>
  </div>
);
