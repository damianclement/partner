"use client";

import * as React from "react";
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

export type GroupAgent = {
  id: number;
  groupName: string;
  leader: string;
  leaderEmail: string;
  partner: string;
  status: "active" | "pending" | "suspended";
  memberCount: number;
  totalBookings: number;
  groupRevenue: string;
  avgRating: number;
  territories: string[];
  specialties: string[];
  formedDate: string;
  performance: "excellent" | "good" | "average" | "needs-improvement";
};

export default function GroupAgentsPage() {
  const groupAgents: GroupAgent[] = [
    {
      id: 1,
      groupName: "Lagos Elite Team",
      leader: "Sarah Johnson",
      leaderEmail: "sarah.johnson@abctransport.com",
      partner: "ABC Transport Co.",
      status: "active",
      memberCount: 8,
      totalBookings: 2340,
      groupRevenue: "$89,500",
      avgRating: 4.7,
      territories: ["Lagos", "Ikeja", "Victoria Island"],
      specialties: ["Corporate Bookings", "VIP Services", "Long Distance"],
      formedDate: "2023-02-15",
      performance: "excellent",
    },
    {
      id: 2,
      groupName: "Abuja Express Group",
      leader: "Michael Chen",
      leaderEmail: "m.chen@cityexpress.com",
      partner: "City Express",
      status: "active",
      memberCount: 6,
      totalBookings: 1890,
      groupRevenue: "$67,200",
      avgRating: 4.5,
      territories: ["Abuja", "Kaduna", "Jos"],
      specialties: ["Government Contracts", "Airport Transfers"],
      formedDate: "2023-03-20",
      performance: "good",
    },
    {
      id: 3,
      groupName: "Port Harcourt Warriors",
      leader: "Amara Okafor",
      leaderEmail: "amara.okafor@metrotransit.com",
      partner: "Metro Transit",
      status: "active",
      memberCount: 5,
      totalBookings: 1245,
      groupRevenue: "$42,100",
      avgRating: 4.3,
      territories: ["Port Harcourt", "Yenagoa", "Warri"],
      specialties: ["Oil & Gas Sector", "Industrial Transport"],
      formedDate: "2023-04-10",
      performance: "good",
    },
    {
      id: 4,
      groupName: "Kano Northern Team",
      leader: "David Williams",
      leaderEmail: "d.williams@highwaykings.com",
      partner: "Highway Kings",
      status: "suspended",
      memberCount: 4,
      totalBookings: 567,
      groupRevenue: "$18,900",
      avgRating: 3.8,
      territories: ["Kano", "Katsina"],
      specialties: ["Regional Routes", "Bulk Transport"],
      formedDate: "2023-05-05",
      performance: "needs-improvement",
    },
    {
      id: 5,
      groupName: "Premium Service Group",
      leader: "Grace Effiong",
      leaderEmail: "grace.effiong@premiumtransport.com",
      partner: "Premium Transport",
      status: "active",
      memberCount: 7,
      totalBookings: 1980,
      groupRevenue: "$76,300",
      avgRating: 4.6,
      territories: ["Lagos", "Ibadan", "Ogun"],
      specialties: ["Luxury Transport", "Event Services", "Wedding Packages"],
      formedDate: "2023-01-28",
      performance: "excellent",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedGroups, setSelectedGroups] = React.useState<number[]>([]);
// Filter group agents based on search input
  const filteredGroups = groupAgents.filter(
    (group) =>
      group.groupName.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.leader.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.partner.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.specialties.some((specialty) =>
        specialty.toLowerCase().includes(filterValue.toLowerCase())
      )
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
  // Get performance badge styling
  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/20";
      case "good":
        return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20";
      case "average":
        return "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20";
      case "needs-improvement":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/20";
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
            <h1 className="text-h1">Group Agent Management</h1>
            <p className="text-caption mt-2">
              Manage agent groups, team performance, and collaborative
              operations
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
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
            <div className="text-2xl font-bold text-obus-primary dark:text-white">5</div>
            <p className="text-xs text-obus-accent mt-1">+1 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Members
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">30</div>
            <p className="text-xs text-obus-accent mt-1">Across all groups</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Group Revenue
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">$294K</div>
            <p className="text-xs text-obus-accent mt-1">+22% this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Avg. Performance
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">4.4</div>
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
                    Group Name
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">Leader</TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Partner
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Members
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Bookings
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Revenue
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Performance
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
                          aria-label={`Select ${group.groupName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white">
                            {group.groupName}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            Formed: {group.formedDate}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white">
                            {group.leader}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {group.leaderEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {group.partner}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <UserPlus className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white">
                            {group.memberCount}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Target className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white">
                            {group.totalBookings}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          {group.groupRevenue}
                        </p>
                        <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                          Avg: {group.avgRating}★
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={getPerformanceBadge(group.performance)}
                        >
                          {group.performance.toUpperCase().replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            group.status === "active"
                              ? "default"
                              : group.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            group.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : group.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                          }
                        >
                          {group.status.toUpperCase()}
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
                              Edit group
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Manage members
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              View performance
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Manage territories
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





