"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  User,
  Bus,
  Calendar,
  Settings,
  Handshake,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  mobileSidebarOpen?: boolean;
  onMobileSidebarClose?: () => void;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    name: "Partner Management",
    href: "/partners",
    icon: Handshake,
  },
  {
    name: "Agent Management",
    href: "/agents",
    icon: Users,
  },
  {
    name: "User Management",
    href: "/users",
    icon: User,
  },
  {
    name: "Bus Systems",
    href: "/buses",
    icon: Bus,
  },
  {
    name: "Bookings",
    href: "/bookings",
    icon: Calendar,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({
  isCollapsed,
  isMobile = false,
  mobileSidebarOpen = false,
  onMobileSidebarClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Update active item based on current pathname
  React.useEffect(() => {
    const currentItem = navigationItems.find((item) => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.name);
    } else if (pathname === "/") {
      setActiveItem("Dashboard");
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-50 bg-obus-primary text-white transition-all duration-300 ease-in-out flex flex-col border-r border-white/10",
        isMobile
          ? mobileSidebarOpen
            ? "w-64"
            : "-translate-x-full w-64"
          : isCollapsed
          ? "w-16"
          : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-obus-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
            O
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">OBUS</h1>
              <p className="text-xs text-obus-text-light">PARTNER</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => {
              setActiveItem(item.name);
              if (isMobile && onMobileSidebarClose) {
                onMobileSidebarClose();
              }
            }}
            className={cn(
              "sidebar-item",
              activeItem === item.name && "sidebar-item-active",
              isCollapsed && !isMobile && "justify-center px-2"
            )}
            title={isCollapsed && !isMobile ? item.name : undefined}
          >
            <item.icon className="w-5 h-5" />
            {(!isCollapsed || isMobile) && (
              <span className="text-sm font-medium">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-obus-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-obus-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="text-sm">
              <p className="font-medium text-white">John Doe</p>
              <p className="text-xs text-obus-text-light">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
