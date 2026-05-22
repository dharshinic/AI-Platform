"use client";

import { useEffect, useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-w-0 flex-col bg-background lg:min-h-[calc(100dvh-4rem)] lg:flex-row">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 top-14 z-40 bg-foreground/20 backdrop-blur-[1px] sm:top-16 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 top-14 z-50 w-[min(280px,88vw)] transition-transform duration-200 ease-out sm:top-16 lg:static lg:z-auto lg:w-60 lg:shrink-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)]">
          <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:h-14 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground"
            aria-label="Open sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-foreground">
            Dashboard
          </span>
        </header>

        <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
