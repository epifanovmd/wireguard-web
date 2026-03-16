import { ShieldCheck } from "lucide-react";
import React, { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-3xl mb-1 font-bold text-[var(--text-primary)] leading-none">
              WireGuard
            </p>
            <p className="text-xs text-[var(--text-muted)]">Admin Panel</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
