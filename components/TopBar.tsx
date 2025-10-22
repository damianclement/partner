"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser, switchUserRole } from "@/lib/contexts/UserContext";

interface TopBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isMobile?: boolean;
}

export function TopBar({
  sidebarCollapsed,
  onToggleSidebar,
  isMobile = false,
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 bg-white text-obus-text-primary h-16 flex items-center justify-between px-6 shadow-sm transition-all duration-300 ease-in-out border-b border-obus-primary/10 dark:bg-obus-primary dark:text-white dark:border-white/10",
        isMobile ? "left-0" : sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      {/* Left Section - Hamburger Menu */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md transition-colors hover:bg-obus-primary/5 dark:hover:bg-white/10"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search partners, agents, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-obus-bg border-obus-primary/15 text-obus-text-primary placeholder:text-obus-text-secondary focus:bg-white focus:border-obus-accent/70 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-obus-text-light"
          />
          {!isMobile && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-obus-text-secondary dark:text-obus-text-light">
              <Search className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Notifications, Theme & User Menu */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-md transition-colors hover:bg-obus-primary/5 dark:hover:bg-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-obus-accent rounded-full" />
        </button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-obus-primary/5 dark:hover:bg-white/10">
              <div className="w-8 h-8 bg-obus-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user
                  ? user.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </div>
              {!isMobile && (
                <div className="text-sm">
                  <p className="font-medium text-obus-primary dark:text-white">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                    {user?.userType === "admin"
                      ? "Administrator"
                      : "Partner User"}
                  </p>
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border border-obus-primary/10 bg-white text-obus-text-primary shadow-lg dark:border-white/10 dark:bg-obus-primary dark:text-white"
          >
            <div className="px-3 py-2 text-xs text-obus-text-secondary dark:text-obus-text-light">
              Current role:{" "}
              <span className="font-medium">
                {user?.userType === "admin" ? "Administrator" : "Partner"}
              </span>
            </div>
            <DropdownMenuItem
              className="cursor-pointer text-obus-text-secondary hover:bg-obus-primary/5 hover:text-obus-primary focus:bg-obus-primary/5 focus:text-obus-primary dark:text-obus-text-light dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white"
              onClick={() => switchUserRole("admin")}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Switch to Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-obus-text-secondary hover:bg-obus-primary/5 hover:text-obus-primary focus:bg-obus-primary/5 focus:text-obus-primary dark:text-obus-text-light dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white"
              onClick={() => switchUserRole("partner")}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Switch to Partner
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-obus-primary/10 dark:bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-obus-text-secondary hover:bg-obus-primary/5 hover:text-obus-primary focus:bg-obus-primary/5 focus:text-obus-primary dark:text-obus-text-light dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-obus-primary/10 dark:bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-600/10 hover:text-red-600 hover:bg-red-600/10">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
