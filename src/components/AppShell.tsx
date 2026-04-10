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
    <div className="h-full bg-kolo-bg text-kolo-text flex flex-col">
      <Header onMenuOpen={() => setMobileOpen(true)} />
      <div className="flex flex-1 min-h-0 justify-center">
      <div className="flex w-full max-w-[1140px] min-w-0">
        <Sidebar
          verified={verified}
          isAdmin={isAdmin}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-auto">
          <div className="px-4 py-5 md:px-8 md:py-6">
            {children}
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
