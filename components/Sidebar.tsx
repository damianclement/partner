"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/contexts/UserContext";
import type { UserType, UserRole } from "@/lib/api/types";
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
  Shield,
  Database,
  Key,
  FileText,
  TrendingUp,
  DollarSign,
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
  dropdownItems?: {
    name: string;
    href: string;
    allowedUserTypes?: UserType[];
    allowedUserRoles?: UserRole[];
    allowedRoles?: ("admin" | "partner")[]; // Legacy support
  }[];
  allowedUserTypes?: UserType[];
  allowedUserRoles?: UserRole[];
  allowedRoles?: ("admin" | "partner")[]; // Legacy support
};

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
    allowedUserTypes: [
      "ROOT_USER",
      "SYSTEM_USER",
      "PARTNER_USER",
      "PARTNER_AGENT",
    ],
  },
  {
    name: "Partner Management",
    href: "/partners",
    icon: Handshake,
    allowedUserTypes: ["ROOT_USER", "SYSTEM_USER"],
    allowedUserRoles: ["ROOT_ADMIN", "SYSTEM_ADMIN", "SYSTEM_SUPPORT"],
  },
  {
    name: "Agent Management",
    href: "/agents",
    icon: Users,
    allowedUserTypes: [
      "ROOT_USER",
      "SYSTEM_USER",
      "PARTNER_USER",
      "PARTNER_AGENT",
    ],
    allowedUserRoles: [
      "ROOT_ADMIN",
      "SYSTEM_ADMIN",
      "SYSTEM_SUPPORT",
      "PARTNER_ADMIN",
      "PARTNER_AGENT",
    ],
  },
  {
    name: "Group Agent Management",
    href: "/group-agents",
    icon: Users2,
    allowedUserTypes: ["ROOT_USER", "SYSTEM_USER", "PARTNER_USER"],
    allowedUserRoles: [
      "ROOT_ADMIN",
      "SYSTEM_ADMIN",
      "SYSTEM_SUPPORT",
      "PARTNER_ADMIN",
    ],
  },
  {
    name: "Super Agent Management",
    href: "/super-agents",
    icon: UserCheck,
    allowedUserTypes: [
      "ROOT_USER",
      "SYSTEM_USER",
      "PARTNER_USER",
      "PARTNER_AGENT",
    ],
    allowedUserRoles: [
      "ROOT_ADMIN",
      "SYSTEM_ADMIN",
      "SYSTEM_SUPPORT",
      "PARTNER_ADMIN",
      "PARTNER_AGENT",
    ],
  },
  {
    name: "User Management",
    href: "/users",
    icon: User,
    hasDropdown: true,
    allowedUserTypes: ["ROOT_USER", "SYSTEM_USER", "PARTNER_USER"],
    allowedUserRoles: [
      "ROOT_ADMIN",
      "SYSTEM_ADMIN",
      "SYSTEM_SUPPORT",
      "PARTNER_ADMIN",
    ],
    dropdownItems: [
      {
        name: "All Users",
        href: "/users",
        allowedUserTypes: ["ROOT_USER", "SYSTEM_USER", "PARTNER_USER"],
        allowedUserRoles: [
          "ROOT_ADMIN",
          "SYSTEM_ADMIN",
          "SYSTEM_SUPPORT",
          "PARTNER_ADMIN",
        ],
      },
      {
        name: "User Roles",
        href: "/users/roles",
        allowedUserTypes: ["ROOT_USER", "SYSTEM_USER"],
        allowedUserRoles: ["ROOT_ADMIN", "SYSTEM_ADMIN"],
      },
    ],
  },
  {
    name: "Bus Systems",
    href: "/buses",
    icon: Bus,
    allowedUserTypes: ["ROOT_USER", "SYSTEM_USER"],
    allowedUserRoles: ["ROOT_ADMIN", "SYSTEM_ADMIN", "SYSTEM_SUPPORT"],
  },
  {
    name: "Booking Management",
    href: "/bookings",
    icon: Calendar,
    allowedUserTypes: [
      "ROOT_USER",
      "SYSTEM_USER",
      "PARTNER_USER",
      "PARTNER_AGENT",
    ],
    allowedUserRoles: [
      "ROOT_ADMIN",
      "SYSTEM_ADMIN",
      "SYSTEM_SUPPORT",
      "PARTNER_ADMIN",
      "PARTNER_ONBOARDING_STAFF",
      "PARTNER_CUSTOMER_SUPPORT",
      "PARTNER_AGENT",
    ],
  },
  {
    name: "Reports & Analytics",
    href: "/reports",
    icon: TrendingUp,
    hasDropdown: true,
    allowedUserTypes: ["ROOT_USER", "SYSTEM_USER", "PARTNER_USER"],
    allowedUserRoles: [
      "ROOT_ADMIN",
      "SYSTEM_ADMIN",
      "SYSTEM_SUPPORT",
      "PARTNER_ADMIN",
    ],
    dropdownItems: [
      // {
      //   name: "System Reports",
      //   href: "/reports/system",
      //   allowedUserTypes: ["ROOT_USER", "SYSTEM_USER"],
      //   allowedUserRoles: ["ROOT_ADMIN", "SYSTEM_ADMIN", "SYSTEM_SUPPORT"],
      // },
      {
        name: "Partner Reports",
        href: "/reports/partners",
        allowedUserTypes: ["ROOT_USER", "SYSTEM_USER", "PARTNER_USER"],
        allowedUserRoles: [
          "ROOT_ADMIN",
          "SYSTEM_ADMIN",
          "SYSTEM_SUPPORT",
          "PARTNER_ADMIN",
        ],
      },
      {
        name: "Booking Analytics",
        href: "/reports/bookings",
        allowedUserTypes: ["ROOT_USER", "SYSTEM_USER", "PARTNER_USER"],
        allowedUserRoles: [
          "ROOT_ADMIN",
          "SYSTEM_ADMIN",
          "SYSTEM_SUPPORT",
          "PARTNER_ADMIN",
        ],
      },
      // {
      //   name: "Financial Reports",
      //   href: "/reports/financial",
      //   allowedUserTypes: ["ROOT_USER", "SYSTEM_USER"],
      //   allowedUserRoles: ["ROOT_ADMIN", "SYSTEM_ADMIN"],
      // },
    ],
  },
];

export function Sidebar({
  isCollapsed,
  isMobile = false,
  mobileSidebarOpen = false,
  onMobileSidebarClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, hasAnyRole, hasAnyUserType, hasAnyUserRole } = useUser();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Enhanced filtering logic for navigation items
  const filteredNavigationItems = navigationItems.filter((item) => {
    if (!user) {
      return false;
    }

    // Check userType access first
    if (
      item.allowedUserTypes &&
      !item.allowedUserTypes.includes(user.userType)
    ) {
      return false;
    }

    // Check userRole access
    if (
      item.allowedUserRoles &&
      !item.allowedUserRoles.includes(user.userRole)
    ) {
      return false;
    }

    // Legacy role-based filtering for backward compatibility
    if (item.allowedRoles && !hasAnyRole(item.allowedRoles)) {
      return false;
    }

    return true;
  });

  // Enhanced filtering logic for dropdown items
  const getFilteredDropdownItems = (
    dropdownItems: NavigationItem["dropdownItems"]
  ) => {
    if (!dropdownItems || !user) return [];

    return dropdownItems.filter((item) => {
      // Check userType access first
      if (
        item.allowedUserTypes &&
        !item.allowedUserTypes.includes(user.userType)
      ) {
        return false;
      }

      // Check userRole access
      if (
        item.allowedUserRoles &&
        !item.allowedUserRoles.includes(user.userRole)
      ) {
        return false;
      }

      // Legacy role-based filtering for backward compatibility
      if (item.allowedRoles && !hasAnyRole(item.allowedRoles)) {
        return false;
      }

      return true;
    });
  };

  React.useEffect(() => {
    const dropdownWithActiveChild = filteredNavigationItems.find(
      (item) =>
        item.hasDropdown &&
        getFilteredDropdownItems(item.dropdownItems)?.some((dropdownItem) =>
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
  }, [pathname, filteredNavigationItems]);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns((prev) => (prev.includes(itemName) ? [] : [itemName]));
  };

  const isRouteActive = (item: NavigationItem) => {
    const isExactMatch = pathname === item.href;
    const isSectionMatch =
      pathname.startsWith(`${item.href}/`) && item.href !== "/";
    const filteredDropdownItems = getFilteredDropdownItems(item.dropdownItems);
    const isDropdownMatch = filteredDropdownItems?.some(
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
              <h1 className="text-lg font-bold text-obus-primary dark:text-white">
                OBUS
              </h1>
              <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                {user?.userType === "ROOT_USER"
                  ? "ROOT USER"
                  : user?.userType === "SYSTEM_USER"
                  ? "SYSTEM USER"
                  : user?.userType === "PARTNER_USER"
                  ? "PARTNER USER"
                  : user?.userType === "PARTNER_AGENT"
                  ? "PARTNER AGENT"
                  : "USER"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigationItems.length === 0 && user && (
          <div className="text-sm text-obus-text-secondary dark:text-obus-text-light p-2">
            No navigation items available for your role.
          </div>
        )}
        {filteredNavigationItems.length === 0 && !user && (
          <div className="text-sm text-obus-text-secondary dark:text-obus-text-light p-2">
            Loading navigation...
          </div>
        )}
        {filteredNavigationItems.map((item) => {
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
                      !isActive &&
                        "hover:bg-obus-primary/5 dark:hover:bg-white/10"
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
                  {(isDropdownOpen || isActive) &&
                    (!isCollapsed || isMobile) && (
                      <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {getFilteredDropdownItems(item.dropdownItems)?.map(
                          (dropdownItem) => {
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
                                  isChildActive &&
                                    "text-obus-primary font-medium dark:text-white"
                                )}
                              >
                                <span className="flex-1">
                                  {dropdownItem.name}
                                </span>
                              </Link>
                            );
                          }
                        )}
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
                    !isActive &&
                      "hover:bg-obus-primary/5 dark:hover:bg-white/10"
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
            {user
              ? user.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="text-sm">
              <p className="font-medium text-obus-primary dark:text-white">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                {user?.userType === "ROOT_USER"
                  ? "ROOT USER"
                  : user?.userType === "SYSTEM_USER"
                  ? "SYSTEM USER"
                  : user?.userType === "PARTNER_USER"
                  ? "PARTNER USER"
                  : user?.userType === "PARTNER_AGENT"
                  ? "PARTNER AGENT"
                  : "USER"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
