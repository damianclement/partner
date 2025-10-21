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
        "fixed bottom-0 right-0 z-20 bg-obus-primary text-white py-4 px-6 transition-all duration-300 ease-in-out",
        isMobile ? "left-0" : sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-obus-text-light">
          © 2024 OBUS Partner Dashboard. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-sm text-obus-text-light">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Powered by OBUS</span>
        </div>
      </div>
    </footer>
  );
}
