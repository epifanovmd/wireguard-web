import cn from "classnames";
import React, { FC, ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, actions, breadcrumbs, className }) => {
  return (
    <div className={cn("px-6 py-5 border-b border-[var(--border-color)] bg-[var(--bg-surface)]", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-[var(--text-primary)] transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className={i === breadcrumbs.length - 1 ? "text-[var(--text-primary)]" : ""}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
