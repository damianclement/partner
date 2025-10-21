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

export type User = {
  id: number;
  displayName: string;
  fullName: string;
  username: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  userType: "admin" | "partner";
  partner?: {
    name: string;
    code: string;
  };
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
};

export default function UsersPage() {
  const users: User[] = [
    {
      id: 1,
      displayName: "John Doe",
      fullName: "John Michael Doe",
      username: "jdoe",
      email: "john.doe@obus.com",
      employeeId: "EMP001",
      department: "IT Administration",
      position: "System Administrator",
      userType: "admin",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2 hours ago",
    },
    {
      id: 2,
      displayName: "Jane Smith",
      fullName: "Jane Elizabeth Smith",
      username: "jsmith",
      email: "jane.smith@obus.com",
      employeeId: "EMP002",
      department: "Operations",
      position: "Operations Manager",
      userType: "admin",
      status: "active",
      createdAt: "2024-01-20",
      lastLogin: "1 day ago",
    },
    {
      id: 3,
      displayName: "Bob Johnson",
      fullName: "Robert Johnson",
      username: "bjohnson",
      email: "bob.johnson@obus.com",
      employeeId: "EMP003",
      department: "Customer Support",
      position: "Support Specialist",
      userType: "admin",
      status: "active",
      createdAt: "2024-02-01",
      lastLogin: "3 days ago",
    },
    {
      id: 4,
      displayName: "Alice Brown",
      fullName: "Alice Marie Brown",
      username: "abrown",
      email: "alice.brown@obus.com",
      employeeId: "EMP004",
      department: "Partner Relations",
      position: "Partner Manager",
      userType: "partner",
      partner: {
        name: "City Transport Ltd",
        code: "CT001",
      },
      status: "inactive",
      createdAt: "2024-02-10",
      lastLogin: "2 weeks ago",
    },
    {
      id: 5,
      displayName: "Mike Wilson",
      fullName: "Michael James Wilson",
      username: "mwilson",
      email: "mike.wilson@citytransport.com",
      employeeId: "CT002",
      department: "Operations",
      position: "Fleet Manager",
      userType: "partner",
      partner: {
        name: "City Transport Ltd",
        code: "CT001",
      },
      status: "active",
      createdAt: "2024-02-15",
      lastLogin: "1 hour ago",
    },
    {
      id: 6,
      displayName: "Sarah Davis",
      fullName: "Sarah Anne Davis",
      username: "sdavis",
      email: "sarah.davis@metrotransit.com",
      employeeId: "MT001",
      department: "Customer Service",
      position: "Customer Service Lead",
      userType: "partner",
      partner: {
        name: "Metro Transit Co",
        code: "MT001",
      },
      status: "active",
      createdAt: "2024-02-20",
      lastLogin: "30 minutes ago",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);
  // Filter users based on search input
  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.fullName.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.username.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.department.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.position.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.userType.toLowerCase().includes(filterValue.toLowerCase()) ||
      (user.partner &&
        user.partner.name.toLowerCase().includes(filterValue.toLowerCase())) ||
      (user.partner &&
        user.partner.code.toLowerCase().includes(filterValue.toLowerCase()))
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
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Users
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              156
            </div>
            <p className="text-xs text-obus-accent mt-1">+5 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Users
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              142
            </div>
            <p className="text-xs text-obus-accent mt-1">91% active rate</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Administrators
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              3
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
              8
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              Awaiting acceptance
            </p>
          </div>
        </div>

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

          <div className="rounded-md border border-obus-primary/10 bg-white overflow-hidden shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
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
                    User
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Type
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Username
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Email
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Employee ID
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Department
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Position
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Partner
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Created
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleUserSelect(user.id, !!checked)
                          }
                          aria-label={`Select ${user.displayName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-obus-accent to-obus-accent/80 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-obus-accent/20 hover:ring-obus-accent/40 transition-all duration-200">
                              {user.displayName.charAt(0)}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-obus-primary ${
                                user.status === "active"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                          </div>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {user.displayName}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {user.fullName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.userType === "admin"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                              : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                          }
                        >
                          {user.userType === "admin" ? (
                            <div className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              Partner
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.username}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.employeeId}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.department}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.position}
                        </p>
                      </TableCell>
                      <TableCell>
                        {user.partner ? (
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {user.partner.name}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              Code: {user.partner.code}
                            </p>
                          </div>
                        ) : (
                          <p className="text-obus-text-secondary dark:text-obus-text-light">
                            -
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                          className={
                            user.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {user.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-medium text-obus-primary dark:text-white">
                          {user.createdAt}
                        </p>
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
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Edit user
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white flex items-center gap-2">
                              {user.status === "active" ? (
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
                      No results.
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
