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
  <div className="flex flex-col h-full overflow-hidden">
    {header}
    <div className={cn("p-4 sm:p-6 overflow-auto", contentClassName)}>
      {children}
    </div>
  </div>
);
