"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Key,
  Users,
} from "lucide-react";
// Simple table implementation without external dependencies
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Role = {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: "active" | "inactive";
  createdAt: string;
  accessLevel: "admin" | "manager" | "staff" | "viewer";
};

export default function UserRolesPage() {
  const roles: Role[] = [
    {
      id: 1,
      name: "Super Administrator",
      description: "Full system access with all permissions",
      permissions: ["all"],
      userCount: 2,
      status: "active",
      createdAt: "2024-01-01",
      accessLevel: "admin",
    },
    {
      id: 2,
      name: "Partner Manager",
      description: "Manage partners, agents, and bookings",
      permissions: ["partners", "agents", "bookings", "reports"],
      userCount: 8,
      status: "active",
      createdAt: "2024-01-02",
      accessLevel: "manager",
    },
    {
      id: 3,
      name: "Support Staff",
      description: "Handle customer support and basic operations",
      permissions: ["bookings", "customers", "tickets"],
      userCount: 15,
      status: "active",
      createdAt: "2024-01-03",
      accessLevel: "staff",
    },
    {
      id: 4,
      name: "Finance Manager",
      description: "Manage financial operations and reports",
      permissions: ["finance", "reports", "transactions"],
      userCount: 3,
      status: "active",
      createdAt: "2024-01-04",
      accessLevel: "manager",
    },
    {
      id: 5,
      name: "Read Only Viewer",
      description: "View-only access to reports and data",
      permissions: ["reports", "dashboard"],
      userCount: 12,
      status: "active",
      createdAt: "2024-01-05",
      accessLevel: "viewer",
    },
    {
      id: 6,
      name: "Legacy Role",
      description: "Deprecated role for migration purposes",
      permissions: ["basic"],
      userCount: 0,
      status: "inactive",
      createdAt: "2023-12-15",
      accessLevel: "staff",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedRoles, setSelectedRoles] = React.useState<number[]>([]);
  // Filter roles based on search input
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      role.description.toLowerCase().includes(filterValue.toLowerCase()) ||
      role.accessLevel.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual role selection
  const handleRoleSelect = (roleId: number, checked: boolean) => {
    if (checked) {
      setSelectedRoles((prev) => [...prev, roleId]);
    } else {
      setSelectedRoles((prev) => prev.filter((id) => id !== roleId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRoles(filteredRoles.map((role) => role.id));
    } else {
      setSelectedRoles([]);
    }
  };

  // Check if all filtered roles are selected
  const isAllSelected =
    filteredRoles.length > 0 && selectedRoles.length === filteredRoles.length;
  // Get access level badge styling
  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/20";
      case "manager":
        return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20";
      case "staff":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/20";
      case "viewer":
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20";
      default:
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">User Roles Management</h1>
            <p className="text-caption mt-2">
              Manage user roles, permissions, and access levels across the
              system
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Role
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Roles
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              6
            </div>
            <p className="text-xs text-obus-accent mt-1">+1 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Roles
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              5
            </div>
            <p className="text-xs text-obus-accent mt-1">83% active</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Admin Roles
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              1
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              System admins
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Users
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              40
            </div>
            <p className="text-xs text-obus-accent mt-1">Across all roles</p>
          </div>
        </div>

        {/* Roles Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Roles
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter roles..."
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          <div className="rounded-md border border-obus-primary/10 bg-white overflow-hidden shadow-sm transition-colors dark:border-white/20 dark:bg-white/5 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-obus-primary/20 hover:scrollbar-thumb-obus-primary/30 dark:scrollbar-thumb-white/20 dark:hover:scrollbar-thumb-white/30">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-obus-primary/10 dark:border-white/20">
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Role Name
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Description
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Access Level
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Permissions
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Users
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length ? (
                  filteredRoles.map((role) => (
                    <TableRow
                      key={role.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRoles.includes(role.id)}
                          onCheckedChange={(checked) =>
                            handleRoleSelect(role.id, !!checked)
                          }
                          aria-label={`Select ${role.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {role.accessLevel === "admin" ? (
                              <ShieldCheck className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {role.name}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              Created: {role.createdAt}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {role.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={getAccessLevelBadge(role.accessLevel)}
                        >
                          {role.accessLevel.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Key className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white">
                            {role.permissions.length}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white">
                            {role.userCount}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            role.status === "active" ? "default" : "secondary"
                          }
                          className={
                            role.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {role.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border border-obus-primary/10 bg-white text-obus-text-primary dark:border-white/20 dark:bg-obus-primary dark:text-white"
                          >
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              View details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Edit role
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Manage permissions
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
              {selectedRoles.length > 0
                ? `${selectedRoles.length} of ${filteredRoles.length} roles selected`
                : `Showing ${filteredRoles.length} of ${roles.length} roles`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
