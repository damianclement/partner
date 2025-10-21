"use client";

import { cn } from "@/lib/utils";

interface FooterProps {
  sidebarCollapsed: boolean;
  isMobile?: boolean;
}

export function Footer({ sidebarCollapsed, isMobile = false }: FooterProps) {
  return (
    <footer
      className={cn(
        "fixed bottom-0 right-0 z-20 bg-white text-obus-text-secondary py-4 px-6 transition-all duration-300 ease-in-out border-t border-obus-primary/10 dark:bg-obus-primary dark:text-obus-text-light dark:border-white/10",
        isMobile ? "left-0" : sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="flex items-center justify-between text-sm">
        <div>(c) 2024 OBUS Partner Dashboard. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>Version 1.0.0</span>
          <span>|</span>
          <span>Powered by OBUS</span>
        </div>
      </div>
    </footer>
  );
}
