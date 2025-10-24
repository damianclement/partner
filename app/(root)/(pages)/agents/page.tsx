"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Search, Filter, RefreshCw } from "lucide-react";
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
import { useAgents } from "@/lib/contexts/AgentsContext";
import { useUser } from "@/lib/contexts/UserContext";

export default function AgentsPage() {
  const {
    agents,
    stats,
    isLoading,
    isStatsLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    filters,
    loadAgents,
    searchAgents,
    setFilters,
    setPage,
    setPageSize,
    clearError,
  } = useAgents();

  const { isPartner } = useUser();

  // Local state for UI interactions
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedAgents, setSelectedAgents] = React.useState<number[]>([]);
  const [searchTimeout, setSearchTimeout] =
    React.useState<NodeJS.Timeout | null>(null);

  // Handle search with debouncing
  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (value.trim()) {
        searchAgents(value.trim());
      } else {
        loadAgents();
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  // Handle refresh
  const handleRefresh = () => {
    clearError();
    loadAgents();
  };

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
      setSelectedAgents(agents.map((agent) => agent.id));
    } else {
      setSelectedAgents([]);
    }
  };

  // Check if all agents are selected
  const isAllSelected =
    agents.length > 0 && selectedAgents.length === agents.length;

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);
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
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.totalAgents?.toLocaleString() || "0"
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">+8% this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Agents
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.activeAgents?.toLocaleString() || "0"
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {stats
                ? `${((stats.activeAgents / stats.totalAgents) * 100).toFixed(
                    1
                  )}% active rate`
                : "0% active rate"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Pending Approval
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.pendingApproval?.toLocaleString() || "0"
              )}
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
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.averageRating?.toFixed(1) || "0.0"
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">+0.2 this month</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error loading agents
                </span>
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

        {/* Agents Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Agents
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-obus-text-secondary dark:text-obus-text-light w-4 h-4" />
                <Input
                  placeholder="Search agents..."
                  value={searchValue}
                  onChange={(event) => handleSearch(event.target.value)}
                  className="max-w-sm pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
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
                  {!isPartner() && (
                    <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                      Partner
                    </TableHead>
                  )}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={isPartner() ? 8 : 9}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
                        Loading agents...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : agents.length ? (
                  agents.map((agent) => (
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
                            {agent.code}
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
                          {agent.contactPerson.email && (
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {agent.contactPerson.email}
                            </p>
                          )}
                          {agent.contactPerson.phone && (
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {agent.contactPerson.phone}
                            </p>
                          )}
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
                      {!isPartner() && (
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
                      )}
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
                              : agent.status === "suspended"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                              : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
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
                            <Link href={`/agents/${agent.uid}`}>
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
                      colSpan={isPartner() ? 8 : 9}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      {searchValue
                        ? "No agents found matching your search."
                        : "No agents available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
              {selectedAgents.length > 0
                ? `${selectedAgents.length} of ${agents.length} agents selected`
                : `Showing ${agents.length} of ${totalItems} agents`}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
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
                  onClick={() => setPage(currentPage + 1)}
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
