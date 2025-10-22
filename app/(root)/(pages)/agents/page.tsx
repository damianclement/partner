"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
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

export type Agent = {
  id: number;
  agentCode: string;
  partnerAgentNumber: string;
  businessName: string;
  passName: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  agentType: "Individual" | "Corporate" | "Agency";
  partner: {
    code: string;
    businessName: string;
  };
  status: "active" | "inactive" | "suspended";
  registrationDate: string;
};

export default function AgentsPage() {
  const agents: Agent[] = [
    {
      id: 1,
      agentCode: "AGT001",
      partnerAgentNumber: "SFC-AG-01",
      businessName: "Nyota Travel Services",
      passName: "Nyota Travel",
      contactPerson: {
        name: "Neema Mwenda",
        email: "neema.mwenda@nyotatravel.co.tz",
        phone: "+255-715-200-345",
      },
      agentType: "Individual",
      partner: {
        code: "SFC001",
        businessName: "SafariLink Coaches",
      },
      status: "active",
      registrationDate: "2024-01-15",
    },
    {
      id: 2,
      agentCode: "AGT002",
      partnerAgentNumber: "CEX-AG-02",
      businessName: "Swahili Coastal Agency",
      passName: "Swahili Coastal",
      contactPerson: {
        name: "Abdallah Said",
        email: "abdallah.said@swahilicostal.co.tz",
        phone: "+255-718-456-210",
      },
      agentType: "Agency",
      partner: {
        code: "CEX002",
        businessName: "Coastal Express Ltd",
      },
      status: "active",
      registrationDate: "2024-02-20",
    },
    {
      id: 3,
      agentCode: "AGT003",
      partnerAgentNumber: "HLT-AG-03",
      businessName: "Kilimanjaro Transport Solutions",
      passName: "Kilimanjaro Transport",
      contactPerson: {
        name: "Asha Kileo",
        email: "asha.kileo@kilimanjaro.co.tz",
        phone: "+255-767-654-320",
      },
      agentType: "Corporate",
      partner: {
        code: "HLT003",
        businessName: "Highland Transit",
      },
      status: "inactive",
      registrationDate: "2024-03-10",
    },
    {
      id: 4,
      agentCode: "AGT004",
      partnerAgentNumber: "LZS-AG-04",
      businessName: "Victoria Fleet Managers",
      passName: "Victoria Fleet",
      contactPerson: {
        name: "Emmanuel Nnko",
        email: "emmanuel.nnko@victoriafleet.co.tz",
        phone: "+255-789-876-540",
      },
      agentType: "Individual",
      partner: {
        code: "LZS004",
        businessName: "LakeZone Shuttles",
      },
      status: "suspended",
      registrationDate: "2023-12-05",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedAgents, setSelectedAgents] = React.useState<number[]>([]);
  // Filter agents based on search input
  const filteredAgents = agents.filter(
    (agent) =>
      agent.agentCode.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.partnerAgentNumber
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      agent.businessName.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.passName.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.contactPerson.name
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      agent.contactPerson.email
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      agent.partner.code.toLowerCase().includes(filterValue.toLowerCase()) ||
      agent.partner.businessName
        .toLowerCase()
        .includes(filterValue.toLowerCase())
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
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Agents
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              1,423
            </div>
            <p className="text-xs text-obus-accent mt-1">+8% this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Agents
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              1,289
            </div>
            <p className="text-xs text-obus-accent mt-1">90.5% active rate</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Pending Approval
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              87
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              Awaiting verification
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Avg. Rating
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              4.6
            </div>
            <p className="text-xs text-obus-accent mt-1">+0.2 this month</p>
          </div>
        </div>

        {/* Agents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Agents
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter agents..."
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
                    Agent Code
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Business Name
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Contact Person
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Agent Type
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Partner
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
                {filteredAgents.length ? (
                  filteredAgents.map((agent) => (
                    <TableRow
                      key={agent.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedAgents.includes(agent.id)}
                          onCheckedChange={(checked) =>
                            handleAgentSelect(agent.id, !!checked)
                          }
                          aria-label={`Select ${agent.businessName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm font-semibold text-obus-primary dark:text-white">
                            {agent.agentCode}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            Partner: {agent.partnerAgentNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white">
                            {agent.businessName}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            Pass: {agent.passName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white text-sm">
                            {agent.contactPerson.name}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {agent.contactPerson.email}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {agent.contactPerson.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            agent.agentType === "Corporate"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : agent.agentType === "Agency"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }
                        >
                          {agent.agentType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white text-sm">
                            {agent.partner.code}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {agent.partner.businessName}
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
                              : "destructive"
                          }
                          className={
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : agent.status === "inactive"
                              ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
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
                            <Link href={`/agents/${agent.id}`}>
                              <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white cursor-pointer">
                                View Details
                              </DropdownMenuCheckboxItem>
                            </Link>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Edit Agent
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Delete Agent
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
