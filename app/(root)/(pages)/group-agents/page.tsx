"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, UserPlus, Target } from "lucide-react";
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
import {
  useGroupAgents,
  type GroupAgent,
} from "@/lib/contexts/GroupAgentsContext";

export default function GroupAgentsPage() {
  const router = useRouter();

  const {
    groupAgents,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    searchGroupAgents,
    setCurrentPage,
    setPageSize,
    calculateStatsFromGroupAgents,
  } = useGroupAgents();

  // Calculate statistics from current group agents data
  const calculatedStats = React.useMemo(() => {
    return calculateStatsFromGroupAgents();
  }, [calculateStatsFromGroupAgents]);

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setFilterValue(value);
    searchGroupAgents(value);
  };

  // Filter group agents based on search input
  const filteredGroups = groupAgents.filter(
    (group) =>
      group.code.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.externalSystemIdentifier
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      group.partnerBusinessName
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      group.type.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual group selection
  const handleGroupSelect = (groupUid: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, groupUid]);
    } else {
      setSelectedGroups((prev) => prev.filter((uid) => uid !== groupUid));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGroups(filteredGroups.map((group) => group.uid));
    } else {
      setSelectedGroups([]);
    }
  };

  // Check if all filtered groups are selected
  const isAllSelected =
    filteredGroups.length > 0 &&
    selectedGroups.length === filteredGroups.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Group Agent Management</h1>
            <p className="text-caption mt-2">
              Manage agent groups, team performance, and collaborative
              operations
            </p>
          </div>
          <Button
            className="bg-obus-accent hover:bg-obus-accent/90"
            onClick={() => router.push("/group-agents/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Group
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Groups
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.totalGroupAgents}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {totalItems > 0
                ? `${totalItems} total in system`
                : "No groups available"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Groups
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.activeGroupAgents}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {calculatedStats.totalGroupAgents > 0
                ? `${(
                    (calculatedStats.activeGroupAgents /
                      calculatedStats.totalGroupAgents) *
                    100
                  ).toFixed(1)}% active`
                : "No active groups"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Agents
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.totalAgents}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {calculatedStats.averageAgentsPerGroup > 0
                ? `Avg ${calculatedStats.averageAgentsPerGroup.toFixed(
                    1
                  )} per group`
                : "No agents"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Bus Systems
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.totalBusCoreSystems}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {calculatedStats.averageBusCoreSystemsPerGroup > 0
                ? `Avg ${calculatedStats.averageBusCoreSystemsPerGroup.toFixed(
                    1
                  )} per group`
                : "No bus systems"}
            </p>
          </div>
        </div>

        {/* Group Agents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Agent Groups
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter groups..."
                value={filterValue}
                onChange={(event) => handleSearchChange(event.target.value)}
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
                    Code
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Name
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Partner
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Type
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Agents
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Bus Systems
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Created
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-obus-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-obus-text-secondary dark:text-obus-text-light">
                          Loading group agents...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredGroups.length ? (
                  filteredGroups.map((group) => (
                    <TableRow
                      key={group.uid}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedGroups.includes(group.uid)}
                          onCheckedChange={(checked) =>
                            handleGroupSelect(group.uid, !!checked)
                          }
                          aria-label={`Select ${group.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm font-semibold text-obus-primary dark:text-white">
                          {group.code}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white">
                            {group.name}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            ID: {group.externalSystemIdentifier}
                          </p>
                        </div>
                      </TableCell>
                      {/* Partner */}
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {group.partnerBusinessName}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            group.type === "CORPORATE"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : group.type === "AGENCY"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : group.type === "FRANCHISE"
                              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                              : group.type === "INDIVIDUAL"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }
                        >
                          {group.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            group.status === "ACTIVE"
                              ? "default"
                              : group.status === "INACTIVE"
                              ? "secondary"
                              : group.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            group.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : group.status === "INACTIVE"
                              ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                              : group.status === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                          }
                        >
                          {group.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <UserPlus className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white">
                            {group.agentCount}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Target className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white">
                            {group.busCoreSystemCount}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                          {new Date(group.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
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
                            <Link href={`/group-agents/${group.id}`}>
                              <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white cursor-pointer">
                                View Details
                              </DropdownMenuCheckboxItem>
                            </Link>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Edit Group
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Manage Bus Systems
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Manage Agents
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Status Actions
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Delete Group
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      {filterValue
                        ? "No group agents found matching your search."
                        : "No group agents available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
              {selectedGroups.length > 0
                ? `${selectedGroups.length} of ${filteredGroups.length} groups selected`
                : `Showing ${filteredGroups.length} of ${totalItems} groups`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
