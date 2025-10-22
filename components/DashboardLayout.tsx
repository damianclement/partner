"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { UserProvider } from "@/lib/contexts/UserContext";
// import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileSidebarOpen(false); // Close mobile sidebar on resize
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-obus-bg text-obus-text-primary transition-colors duration-300 dark:bg-obus-primary dark:text-white">
        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Fixed Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          onMobileSidebarClose={() => setMobileSidebarOpen(false)}
        />

        {/* Fixed Top Bar */}
        <TopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <main
          className={cn(
            "pt-16 pb-20 transition-all duration-300 ease-in-out",
            isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
          )}
        >
          <div className="p-6">{children}</div>
        </main>

        {/* Fixed Footer */}
        {/* <Footer sidebarCollapsed={sidebarCollapsed} isMobile={isMobile} /> */}
      </div>
    </UserProvider>
  );
}
