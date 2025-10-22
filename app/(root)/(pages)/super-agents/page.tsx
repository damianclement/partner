"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Star, TrendingUp } from "lucide-react";
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

export type SuperAgent = {
  id: number;
  agentNumber: string;
  businessName: string;
  contactPerson: string;
  partner: {
    name: string;
    code: string;
  };
  status: "active" | "inactive" | "suspended" | "pending";
  registrationDate: string;
};

export default function SuperAgentsPage() {
  const superAgents: SuperAgent[] = [
    {
      id: 1,
      agentNumber: "SA-001",
      businessName: "SafariLink Elite Services",
      contactPerson: "Juma Mwakyusa",
      partner: {
        name: "SafariLink Coaches",
        code: "SFC001",
      },
      status: "active",
      registrationDate: "2023-01-15",
    },
    {
      id: 2,
      agentNumber: "SA-002",
      businessName: "Coastal Premium Express",
      contactPerson: "Neema Mshana",
      partner: {
        name: "Coastal Express Ltd",
        code: "CEX002",
      },
      status: "active",
      registrationDate: "2023-03-20",
    },
    {
      id: 3,
      agentNumber: "SA-003",
      businessName: "Highland Summit Agency",
      contactPerson: "Asha Kileo",
      partner: {
        name: "Highland Transit",
        code: "HLT003",
      },
      status: "pending",
      registrationDate: "2023-06-10",
    },
    {
      id: 4,
      agentNumber: "SA-004",
      businessName: "LakeZone Elite Services",
      contactPerson: "Emmanuel Nnko",
      partner: {
        name: "LakeZone Shuttles",
        code: "LZS004",
      },
      status: "suspended",
      registrationDate: "2023-08-05",
    },
    {
      id: 5,
      agentNumber: "SA-005",
      businessName: "Zanzibar Coastal Alliance",
      contactPerson: "Amina Salum",
      partner: {
        name: "Zanzibar Coastal Lines",
        code: "ZCL005",
      },
      status: "active",
      registrationDate: "2023-02-28",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedSuperAgents, setSelectedSuperAgents] = React.useState<
    number[]
  >([]);
  // Filter super agents based on search input
  const filteredSuperAgents = superAgents.filter(
    (agent) =>
      agent.agentNumber.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.businessName.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.contactPerson.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.partner.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.partner.code.toLowerCase().includes(filterValue.toLowerCase())
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
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Super Agents
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              5
            </div>
            <p className="text-xs text-obus-accent mt-1">+2 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Platinum Tier
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              1
            </div>
            <p className="text-xs text-obus-accent mt-1">Top performers</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              $133.1K
            </div>
            <p className="text-xs text-obus-accent mt-1">+18% this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Avg. Rating
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              4.5
            </div>
            <p className="text-xs text-obus-accent mt-1">+0.3 this month</p>
          </div>
        </div>

        {/* Super Agents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Super Agents
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter super agents..."
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
                    Agent #
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Business Name
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Contact Person
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Partner Info
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Registration Date
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuperAgents.length ? (
                  filteredSuperAgents.map((agent) => (
                    <TableRow
                      key={agent.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedSuperAgents.includes(agent.id)}
                          onCheckedChange={(checked) =>
                            handleSuperAgentSelect(agent.id, !!checked)
                          }
                          aria-label={`Select ${agent.businessName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm font-semibold text-obus-primary dark:text-white">
                          {agent.agentNumber}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {agent.businessName}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {agent.contactPerson}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white text-sm">
                            {agent.partner.name}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            Code: {agent.partner.code}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            agent.status === "active"
                              ? "default"
                              : agent.status === "inactive"
                              ? "secondary"
                              : agent.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : agent.status === "inactive"
                              ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                              : agent.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                          }
                        >
                          {agent.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                          {new Date(agent.registrationDate).toLocaleDateString(
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
                            <Link href={`/super-agents/${agent.id}`}>
                              <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white cursor-pointer">
                                View Details
                              </DropdownMenuCheckboxItem>
                            </Link>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Edit Super Agent
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              View Agents
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
