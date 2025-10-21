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
  ChevronDown,
  UserCheck,
  Users2,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  mobileSidebarOpen?: boolean;
  onMobileSidebarClose?: () => void;
}

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
};

const navigationItems: NavigationItem[] = [
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
    name: "Group Agent Management",
    href: "/group-agents",
    icon: Users2,
  },
  {
    name: "Super Agent Management",
    href: "/super-agents",
    icon: UserCheck,
  },
  {
    name: "User Management",
    href: "/users",
    icon: User,
    hasDropdown: true,
    dropdownItems: [
      { name: "All Users", href: "/users" },
      { name: "User Roles", href: "/users/roles" },
    ],
  },
  {
    name: "Bus Systems",
    href: "/buses",
    icon: Bus,
  },
  {
    name: "Booking Management",
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
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  React.useEffect(() => {
    const dropdownWithActiveChild = navigationItems.find(
      (item) =>
        item.hasDropdown &&
        item.dropdownItems?.some((dropdownItem) =>
          pathname.startsWith(dropdownItem.href)
        )
    );

    if (dropdownWithActiveChild) {
      setOpenDropdowns((prev) =>
        prev.includes(dropdownWithActiveChild.name)
          ? prev
          : [dropdownWithActiveChild.name]
      );
    }
  }, [pathname]);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(itemName) ? [] : [itemName]
    );
  };

  const isRouteActive = (item: NavigationItem) => {
    const isExactMatch = pathname === item.href;
    const isSectionMatch =
      pathname.startsWith(`${item.href}/`) && item.href !== "/";
    const isDropdownMatch = item.dropdownItems?.some(
      (dropdownItem) =>
        pathname === dropdownItem.href ||
        pathname.startsWith(`${dropdownItem.href}/`)
    );

    return isExactMatch || isSectionMatch || Boolean(isDropdownMatch);
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-50 bg-white text-obus-text-primary transition-all duration-300 ease-in-out flex flex-col border-r border-obus-primary/10 dark:bg-obus-primary dark:text-white dark:border-white/10",
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
      <div className="p-4 border-b border-obus-primary/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
            O
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-obus-primary dark:text-white">OBUS</h1>
              <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                PARTNER
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = isRouteActive(item);
          const isDropdownOpen = openDropdowns.includes(item.name);

          return (
            <div key={item.name}>
              {item.hasDropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={cn(
                      "sidebar-item w-full group",
                      isActive && "sidebar-item-active",
                      isCollapsed && !isMobile && "justify-center px-2",
                      "focus:outline-none focus:ring-2 focus:ring-obus-primary/20 dark:focus:ring-white/20",
                      !isActive && "hover:bg-obus-primary/5 dark:hover:bg-white/10"
                    )}
                    title={isCollapsed && !isMobile ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {(!isCollapsed || isMobile) && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">
                          {item.name}
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-300 ease-in-out text-obus-text-secondary dark:text-obus-text-light",
                            (isDropdownOpen || isActive) && "rotate-180"
                          )}
                        />
                      </>
                    )}
                  </button>
                  {(isDropdownOpen || isActive) && (!isCollapsed || isMobile) && (
                    <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {item.dropdownItems?.map((dropdownItem) => {
                        const isChildActive =
                          pathname === dropdownItem.href ||
                          pathname.startsWith(`${dropdownItem.href}/`);

                        return (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            onClick={() => {
                              if (isMobile && onMobileSidebarClose) {
                                onMobileSidebarClose();
                              }
                            }}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200",
                              "text-obus-text-secondary hover:text-obus-primary hover:bg-obus-primary/5 focus:outline-none focus:ring-2 focus:ring-obus-primary/20",
                              "dark:text-obus-text-light dark:hover:text-white dark:hover:bg-white/10 dark:focus:ring-white/20",
                              isChildActive && "text-obus-primary font-medium dark:text-white"
                            )}
                          >
                            <span className="flex-1">{dropdownItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => {
                    if (isMobile && onMobileSidebarClose) {
                      onMobileSidebarClose();
                    }
                  }}
                  className={cn(
                    "sidebar-item group",
                    isActive && "sidebar-item-active",
                    isCollapsed && !isMobile && "justify-center px-2",
                    "focus:outline-none focus:ring-2 focus:ring-obus-primary/20 dark:focus:ring-white/20",
                    !isActive && "hover:bg-obus-primary/5 dark:hover:bg-white/10"
                  )}
                  title={isCollapsed && !isMobile ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {(!isCollapsed || isMobile) && (
                    <span className="text-sm font-medium flex-1">
                      {item.name}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-obus-primary/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-obus-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="text-sm">
              <p className="font-medium text-obus-primary dark:text-white">John Doe</p>
              <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
