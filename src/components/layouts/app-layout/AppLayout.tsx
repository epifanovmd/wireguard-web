import React, { FC, ReactNode } from "react";

import { useAuthStore } from "~@store";

import { Sidebar } from "../sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const auth = useAuthStore();

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar onSignOut={() => auth.signOut()} />
      <main className="flex-1 overflow-y-auto min-w-0 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
};
