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
  UserX,
  BarChart3,
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

export type Agent = {
  id: number;
  name: string;
  email: string;
  partner: string;
  status: "active" | "pending" | "suspended";
  role: string;
  bookings: number;
  rating: number;
};

export default function AgentsPage() {
  const agents: Agent[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@abctransport.com",
      partner: "ABC Transport Co.",
      status: "active",
      role: "Senior Agent",
      bookings: 145,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@cityexpress.com",
      partner: "City Express",
      status: "active",
      role: "Agent",
      bookings: 98,
      rating: 4.6,
    },
    {
      id: 3,
      name: "Amara Okafor",
      email: "amara.okafor@metrotransit.com",
      partner: "Metro Transit",
      status: "pending",
      role: "Junior Agent",
      bookings: 0,
      rating: 0,
    },
    {
      id: 4,
      name: "David Williams",
      email: "d.williams@highwaykings.com",
      partner: "Highway Kings",
      status: "suspended",
      role: "Senior Agent",
      bookings: 234,
      rating: 3.2,
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedAgents, setSelectedAgents] = React.useState<number[]>([]);
  const [selectAll, setSelectAll] = React.useState(false);

  // Filter agents based on search input
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.partner.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual agent selection
  const handleAgentSelect = (agentId: number, checked: boolean) => {
    if (checked) {
      setSelectedAgents((prev) => [...prev, agentId]);
    } else {
      setSelectedAgents((prev) => prev.filter((id) => id !== agentId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedAgents(filteredAgents.map((agent) => agent.id));
    } else {
      setSelectedAgents([]);
    }
  };

  // Check if all filtered agents are selected
  const isAllSelected =
    filteredAgents.length > 0 &&
    selectedAgents.length === filteredAgents.length;
  const isIndeterminate =
    selectedAgents.length > 0 && selectedAgents.length < filteredAgents.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Agent Management</h1>
            <p className="text-caption mt-2">
              Manage and monitor all agents across your partner network
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Agent
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Agents
            </div>
            <div className="text-2xl font-bold text-white">1,423</div>
            <p className="text-xs text-obus-accent mt-1">+8% this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Active Agents
            </div>
            <div className="text-2xl font-bold text-white">1,289</div>
            <p className="text-xs text-obus-accent mt-1">90.5% active rate</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Pending Approval
            </div>
            <div className="text-2xl font-bold text-white">87</div>
            <p className="text-xs text-obus-text-light mt-1">
              Awaiting verification
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Avg. Rating
            </div>
            <div className="text-2xl font-bold text-white">4.6</div>
            <p className="text-xs text-obus-accent mt-1">+0.2 this month</p>
          </div>
        </div>

        {/* Agents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">All Agents</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter agents..."
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
                    Agent Name
                  </TableHead>
                  <TableHead className="text-obus-text-light">
                    Partner
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Role
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Bookings
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
                {filteredAgents.length ? (
                  filteredAgents.map((agent) => (
                    <TableRow
                      key={agent.id}
                      className="border-white/10 hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedAgents.includes(agent.id)}
                          onCheckedChange={(checked) =>
                            handleAgentSelect(agent.id, !!checked)
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
                        <p className="font-semibold text-white">{agent.role}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {agent.bookings}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {agent.rating > 0 ? agent.rating : "N/A"}
                        </p>
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
                              Edit agent
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
              {selectedAgents.length > 0
                ? `${selectedAgents.length} of ${filteredAgents.length} agents selected`
                : `Showing ${filteredAgents.length} of ${agents.length} agents`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
