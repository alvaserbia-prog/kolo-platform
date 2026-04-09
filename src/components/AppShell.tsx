"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppShellProps {
  verified: boolean;
  isAdmin: boolean;
  children: React.ReactNode;
}

export default function AppShell({ verified, isAdmin, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-full bg-kolo-bg text-kolo-text flex justify-center">
      <div className="flex w-full max-w-[1140px] min-w-0">
        <Sidebar
          verified={verified}
          isAdmin={isAdmin}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <Header onMenuOpen={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-auto">
            <div className="px-4 py-4 md:px-6 md:py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
