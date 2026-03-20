import { ShieldCheck } from "lucide-react";
import React, { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-3xl mb-1 font-bold text-foreground leading-none">
              WireGuard
            </p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
