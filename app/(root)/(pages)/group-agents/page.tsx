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

export type GroupAgent = {
  id: number;
  code: string;
  name: string;
  externalSystemId: string;
  partner: string;
  type: "Corporate" | "Agency" | "Individual" | "Franchise";
  status: "active" | "inactive" | "suspended" | "pending";
  agentCount: number;
  busSystemCount: number;
  created: string;
};

export default function GroupAgentsPage() {
  const router = useRouter();

  const groupAgents: GroupAgent[] = [
    {
      id: 1,
      code: "GAG001",
      name: "Dar Corridor Elite",
      externalSystemId: "EXT-DAR-001",
      partner: "SafariLink Coaches",
      type: "Corporate",
      status: "active",
      agentCount: 8,
      busSystemCount: 12,
      created: "2023-02-15",
    },
    {
      id: 2,
      code: "GAG002",
      name: "Dodoma Express Network",
      externalSystemId: "EXT-DDM-002",
      partner: "Coastal Express Ltd",
      type: "Agency",
      status: "active",
      agentCount: 6,
      busSystemCount: 8,
      created: "2023-03-20",
    },
    {
      id: 3,
      code: "GAG003",
      name: "Kilimanjaro Summit Group",
      externalSystemId: "EXT-ARU-003",
      partner: "Highland Transit",
      type: "Franchise",
      status: "pending",
      agentCount: 5,
      busSystemCount: 6,
      created: "2023-04-10",
    },
    {
      id: 4,
      code: "GAG004",
      name: "Lake Victoria Collective",
      externalSystemId: "EXT-MWZ-004",
      partner: "LakeZone Shuttles",
      type: "Individual",
      status: "suspended",
      agentCount: 4,
      busSystemCount: 3,
      created: "2023-05-05",
    },
    {
      id: 5,
      code: "GAG005",
      name: "Zanzibar Premium Alliance",
      externalSystemId: "EXT-ZNZ-005",
      partner: "Zanzibar Coastal Lines",
      type: "Corporate",
      status: "active",
      agentCount: 7,
      busSystemCount: 10,
      created: "2023-01-28",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedGroups, setSelectedGroups] = React.useState<number[]>([]);
  // Filter group agents based on search input
  const filteredGroups = groupAgents.filter(
    (group) =>
      group.code.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.externalSystemId
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      group.partner.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.type.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual group selection
  const handleGroupSelect = (groupId: number, checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, groupId]);
    } else {
      setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGroups(filteredGroups.map((group) => group.id));
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
              5
            </div>
            <p className="text-xs text-obus-accent mt-1">+1 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Members
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              30
            </div>
            <p className="text-xs text-obus-accent mt-1">Across all groups</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Group Revenue
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              $294K
            </div>
            <p className="text-xs text-obus-accent mt-1">+22% this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Avg. Performance
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              4.4
            </div>
            <p className="text-xs text-obus-accent mt-1">+0.2 this month</p>
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
                {filteredGroups.length ? (
                  filteredGroups.map((group) => (
                    <TableRow
                      key={group.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedGroups.includes(group.id)}
                          onCheckedChange={(checked) =>
                            handleGroupSelect(group.id, !!checked)
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
                            ID: {group.externalSystemId}
                          </p>
                        </div>
                      </TableCell>
                      {/* Partner */}
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {group.partner}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            group.type === "Corporate"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : group.type === "Agency"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : group.type === "Franchise"
                              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }
                        >
                          {group.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            group.status === "active"
                              ? "default"
                              : group.status === "inactive"
                              ? "secondary"
                              : group.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            group.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : group.status === "inactive"
                              ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                              : group.status === "pending"
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
                            {group.busSystemCount}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                          {new Date(group.created).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
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
                      No results.
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
                : `Showing ${filteredGroups.length} of ${groupAgents.length} groups`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
