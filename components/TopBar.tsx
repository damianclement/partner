"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Bell, ChevronDown, Menu, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 bg-obus-primary text-white h-16 flex items-center justify-between px-6 shadow-sm transition-all duration-300 ease-in-out border-b border-white/10",
        isMobile ? "left-0" : sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      {/* Left Section - Hamburger Menu */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-obus-primary/80 rounded-md transition-colors"
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
            className="bg-white/10 border-white/20 text-white placeholder:text-obus-text-light focus:bg-white/20 focus:border-obus-accent"
          />
          {!isMobile && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-obus-text-light">
              <Search className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Notifications & User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-obus-primary/80 rounded-md transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-obus-accent rounded-full"></span>
        </button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-obus-primary/80 rounded-md p-2 transition-colors">
              <div className="w-8 h-8 bg-obus-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
              {!isMobile && (
                <div className="text-sm">
                  <p className="font-medium text-white">John Doe</p>
                  <p className="text-xs text-obus-text-light">Administrator</p>
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-obus-text-light" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
