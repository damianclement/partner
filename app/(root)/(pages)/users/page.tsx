"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
  Building2,
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
import Link from "next/link";
import { useUsers, type User } from "@/lib/contexts/UsersContext";
import { useEffect } from "react";

export default function UsersPage() {
  const router = useRouter();
  const {
    users,
    stats,
    isLoading,
    isStatsLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    loadUsers,
    setCurrentPage,
    clearError,
  } = useUsers();

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filterValue.trim()) {
        // For now, we'll use client-side filtering
        // In the future, we can implement server-side search
        loadUsers({ page: 0, size: pageSize });
      } else {
        loadUsers({ page: 0, size: pageSize });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filterValue, pageSize]); // Removed loadUsers from dependencies to prevent infinite loops

  // Filter users based on search input
  const filteredUsers = users.filter(
    (user) =>
      (user.displayName?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.firstName?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.lastName?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.username?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.email?.toLowerCase() || "").includes(filterValue.toLowerCase()) ||
      (user.employeeId?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.department?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.position?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.userType?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.partnerName?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (user.partnerCode?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      )
  );

  // Handle individual user selection
  const handleUserSelect = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Check if all filtered users are selected
  const isAllSelected =
    filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;

  // Debug: Log users data
  console.log("Users data:", users, "Loading:", isLoading, "Error:", error);
  console.log("Filtered users:", filteredUsers);
  console.log("Users length:", users.length);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">User Management</h1>
            <p className="text-caption mt-2">
              Manage system users, roles, and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              onClick={() => router.push("/users/new?type=admin")}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Create Admin User
            </Button>
            <Button
              className="bg-obus-accent hover:bg-obus-accent/90"
              onClick={() => router.push("/users/new?type=partner")}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Create Partner User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Users
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.totalUsers || 0
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {stats?.adminUsers || 0} admins, {stats?.partnerUsers || 0}{" "}
              partners
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Users
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.activeUsers || 0
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {stats?.inactiveUsers || 0} inactive
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Administrators
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.adminUsers || 0
              )}
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              System admins
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Pending Invites
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.pendingVerificationUsers || 0
              )}
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              Awaiting verification
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Error loading users</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                ×
              </Button>
            </div>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Users
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter users..."
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          <div className="rounded-md border border-obus-primary/10 bg-white overflow-hidden shadow-sm transition-colors dark:border-white/20 dark:bg-white/5 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-obus-primary/20 hover:scrollbar-thumb-obus-primary/30 dark:scrollbar-thumb-white/20 dark:hover:scrollbar-thumb-white/30">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-obus-primary/10 dark:border-white/20">
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[220px]">
                    User
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[140px]">
                    Type
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[150px]">
                    Username
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[220px]">
                    Email
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[150px]">
                    Employee ID
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[200px]">
                    Department
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[200px]">
                    Position
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[220px]">
                    Partner
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center min-w-[140px]">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center min-w-[150px]">
                    Created
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light min-w-[140px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleUserSelect(user.id, !!checked)
                          }
                          aria-label={`Select ${user.displayName}`}
                        />
                      </TableCell>
                      <TableCell className="min-w-[220px]">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-linear-to-br from-obus-accent to-obus-accent/80 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-obus-accent/20 hover:ring-obus-accent/40 transition-all duration-200">
                              {user.displayName.charAt(0)}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-obus-primary ${
                                user.enabled ? "bg-green-500" : "bg-gray-400"
                              }`}
                            ></div>
                          </div>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {user.displayName}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        <Badge
                          className={
                            user.userType === "ROOT_USER"
                              ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                              : user.userType === "SYSTEM_USER"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                              : user.userType === "PARTNER_USER"
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                              : "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                          }
                        >
                          {user.userType === "ROOT_USER" ? (
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Root Admin
                            </div>
                          ) : user.userType === "SYSTEM_USER" ? (
                            <div className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </div>
                          ) : user.userType === "PARTNER_USER" ? (
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              Partner
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              Agent
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[150px] whitespace-nowrap">
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.username}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[220px] whitespace-nowrap">
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.email}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[150px] whitespace-nowrap">
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.employeeId}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.department}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.position}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[220px]">
                        {user.partnerName ? (
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {user.partnerName}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              Code: {user.partnerCode}
                            </p>
                          </div>
                        ) : (
                          <p className="text-obus-text-secondary dark:text-obus-text-light">
                            -
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-center min-w-[140px]">
                        <Badge
                          variant={user.enabled ? "default" : "secondary"}
                          className={
                            user.enabled
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {user.enabled ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center min-w-[150px]">
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.createdAt}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[140px]">
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
                            <Link href={`/users/${user.uid}`}>
                              <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white flex items-center gap-2 cursor-pointer">
                                <Eye className="w-4 h-4" />
                                View details
                              </DropdownMenuCheckboxItem>
                            </Link>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Edit user
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white flex items-center gap-2">
                              {user.enabled ? (
                                <ToggleLeft className="w-4 h-4" />
                              ) : (
                                <ToggleRight className="w-4 h-4" />
                              )}
                              Toggle Status
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      {filterValue.trim()
                        ? "No users found matching your search."
                        : "No users found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
              {selectedUsers.length > 0
                ? `${selectedUsers.length} of ${filteredUsers.length} users selected`
                : `Showing ${filteredUsers.length} of ${users.length} users`}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0 || isLoading}
                  className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  Previous
                </Button>
                <span className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1 || isLoading}
                  className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
