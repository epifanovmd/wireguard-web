import { Link } from "@tanstack/react-router";
import cn from "classnames";
import { ChevronRight } from "lucide-react";
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
    <div className={cn("relative px-6 py-4 border-b border-[var(--border)] bg-[var(--card)]", className)}>
      {/* accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#6366f1] rounded-r" />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mb-2 ml-3">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight size={12} className="opacity-40 flex-shrink-0" />}
              {crumb.href ? (
                <Link
                  to={crumb.href as any}
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className={i === breadcrumbs.length - 1 ? "text-[var(--foreground)] font-medium" : ""}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex items-center justify-between gap-4 ml-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)] leading-tight tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
