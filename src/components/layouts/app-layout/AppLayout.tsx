import React, { FC, ReactNode } from "react";

import { useSessionDataStore } from "~@store";

import { Sidebar } from "../sidebar/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const session = useSessionDataStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar onSignOut={() => session.clear()} />
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
};
