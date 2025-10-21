"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  Star,
  TrendingUp,
  Award,
  ArrowUpDown,
  ChevronDown,
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

export type SuperAgent = {
  id: number;
  name: string;
  email: string;
  partner: string;
  status: "active" | "pending" | "suspended";
  tier: "bronze" | "silver" | "gold" | "platinum";
  bookings: number;
  revenue: string;
  rating: number;
  commission: string;
  territories: string[];
  achievements: string[];
  joinedDate: string;
};

export default function SuperAgentsPage() {
  const superAgents: SuperAgent[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@abctransport.com",
      partner: "ABC Transport Co.",
      status: "active",
      tier: "platinum",
      bookings: 1245,
      revenue: "$45,200",
      rating: 4.9,
      commission: "$4,520",
      territories: ["Lagos", "Abuja", "Port Harcourt"],
      achievements: ["Top Performer", "Customer Excellence", "Revenue Leader"],
      joinedDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@cityexpress.com",
      partner: "City Express",
      status: "active",
      tier: "gold",
      bookings: 892,
      revenue: "$32,100",
      rating: 4.7,
      commission: "$3,210",
      territories: ["Abuja", "Kano"],
      achievements: ["Rising Star", "Customer Excellence"],
      joinedDate: "2023-03-20",
    },
    {
      id: 3,
      name: "Amara Okafor",
      email: "amara.okafor@metrotransit.com",
      partner: "Metro Transit",
      status: "active",
      tier: "silver",
      bookings: 567,
      revenue: "$18,900",
      rating: 4.5,
      commission: "$1,890",
      territories: ["Port Harcourt", "Enugu"],
      achievements: ["Rising Star"],
      joinedDate: "2023-06-10",
    },
    {
      id: 4,
      name: "David Williams",
      email: "d.williams@highwaykings.com",
      partner: "Highway Kings",
      status: "suspended",
      tier: "bronze",
      bookings: 234,
      revenue: "$8,500",
      rating: 3.8,
      commission: "$850",
      territories: ["Kano"],
      achievements: [],
      joinedDate: "2023-08-05",
    },
    {
      id: 5,
      name: "Grace Effiong",
      email: "grace.effiong@premiumtransport.com",
      partner: "Premium Transport",
      status: "active",
      tier: "gold",
      bookings: 756,
      revenue: "$28,400",
      rating: 4.8,
      commission: "$2,840",
      territories: ["Lagos", "Ibadan"],
      achievements: ["Customer Excellence", "Revenue Leader"],
      joinedDate: "2023-02-28",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedSuperAgents, setSelectedSuperAgents] = React.useState<
    number[]
  >([]);
  const [selectAll, setSelectAll] = React.useState(false);

  // Filter super agents based on search input
  const filteredSuperAgents = superAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.partner.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.tier.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual super agent selection
  const handleSuperAgentSelect = (agentId: number, checked: boolean) => {
    if (checked) {
      setSelectedSuperAgents((prev) => [...prev, agentId]);
    } else {
      setSelectedSuperAgents((prev) => prev.filter((id) => id !== agentId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedSuperAgents(filteredSuperAgents.map((agent) => agent.id));
    } else {
      setSelectedSuperAgents([]);
    }
  };

  // Check if all filtered super agents are selected
  const isAllSelected =
    filteredSuperAgents.length > 0 &&
    selectedSuperAgents.length === filteredSuperAgents.length;
  const isIndeterminate =
    selectedSuperAgents.length > 0 &&
    selectedSuperAgents.length < filteredSuperAgents.length;

  // Get tier badge styling
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-500/20 text-purple-400";
      case "gold":
        return "bg-yellow-500/20 text-yellow-400";
      case "silver":
        return "bg-gray-400/20 text-gray-300";
      case "bronze":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Super Agent Management</h1>
            <p className="text-caption mt-2">
              Manage and monitor elite agents with enhanced capabilities and
              performance metrics
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Promote to Super Agent
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Super Agents
            </div>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-obus-accent mt-1">+2 this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Platinum Tier
            </div>
            <div className="text-2xl font-bold text-white">1</div>
            <p className="text-xs text-obus-accent mt-1">Top performers</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-white">$133.1K</div>
            <p className="text-xs text-obus-accent mt-1">+18% this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Avg. Rating
            </div>
            <div className="text-2xl font-bold text-white">4.5</div>
            <p className="text-xs text-obus-accent mt-1">+0.3 this month</p>
          </div>
        </div>

        {/* Super Agents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              All Super Agents
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter super agents..."
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="max-w-sm bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="rounded-md border border-white/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-obus-text-light w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-obus-text-light">
                    Super Agent
                  </TableHead>
                  <TableHead className="text-obus-text-light">
                    Partner
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Tier
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Bookings
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Revenue
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Rating
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuperAgents.length ? (
                  filteredSuperAgents.map((agent) => (
                    <TableRow
                      key={agent.id}
                      className="border-white/10 hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedSuperAgents.includes(agent.id)}
                          onCheckedChange={(checked) =>
                            handleSuperAgentSelect(agent.id, !!checked)
                          }
                          aria-label={`Select ${agent.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {agent.name}
                            </p>
                            <p className="text-xs text-obus-text-light">
                              {agent.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-white">
                          {agent.partner}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Star className="w-4 h-4 text-obus-accent" />
                          <Badge className={getTierBadge(agent.tier)}>
                            {agent.tier.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="w-4 h-4 text-obus-text-light" />
                          <p className="font-semibold text-white">
                            {agent.bookings}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {agent.revenue}
                        </p>
                        <p className="text-xs text-obus-text-light">
                          Comm: {agent.commission}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <p className="font-semibold text-white">
                            {agent.rating}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            agent.status === "active"
                              ? "default"
                              : agent.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : agent.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }
                        >
                          {agent.status.toUpperCase()}
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
                            className="bg-obus-primary border-white/20 text-white"
                          >
                            <DropdownMenuCheckboxItem className="text-white">
                              View details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-white">
                              Edit super agent
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-white">
                              View achievements
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-white">
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
                      colSpan={9}
                      className="h-24 text-center text-obus-text-light"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-light">
              {selectedSuperAgents.length > 0
                ? `${selectedSuperAgents.length} of ${filteredSuperAgents.length} super agents selected`
                : `Showing ${filteredSuperAgents.length} of ${superAgents.length} super agents`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
