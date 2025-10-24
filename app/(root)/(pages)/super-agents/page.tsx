"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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
import { useSuperAgents } from "@/lib/contexts/SuperAgentsContext";
import { useUser } from "@/lib/contexts/UserContext";

export default function SuperAgentsPage() {
  const {
    superAgents,
    stats,
    isLoading,
    isStatsLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    loadSuperAgents,
    searchSuperAgents,
    setCurrentPage,
    clearError,
  } = useSuperAgents();

  const { isPartner } = useUser();

  // Local state for UI interactions
  const [filterValue, setFilterValue] = useState("");
  const [selectedSuperAgents, setSelectedSuperAgents] = useState<number[]>([]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filterValue.trim()) {
        searchSuperAgents({
          businessName: filterValue,
          page: 0,
          size: pageSize,
        });
      } else {
        loadSuperAgents({ page: 0, size: pageSize });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filterValue, searchSuperAgents, loadSuperAgents, pageSize]);

  // Filter super agents based on search input (client-side filtering for display)
  const filteredSuperAgents = superAgents.filter(
    (agent) =>
      (agent.agentNumber?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (agent.businessName?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (agent.contactPersonName?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (agent.partnerName?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      ) ||
      (agent.partnerCode?.toLowerCase() || "").includes(
        filterValue.toLowerCase()
      )
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
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.totalSuperAgents || 0
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {stats?.activeSuperAgents || 0} active
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Super Agents
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.activeSuperAgents || 0
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {stats?.pendingSuperAgents || 0} pending
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Sub-Agents
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.totalSubAgents || 0
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              Avg: {stats?.averageSubAgentsPerSuperAgent || 0} per super agent
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Top Performers
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.topPerformingSuperAgents || 0
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              High performance tier
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error loading super agents
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
                  {!isPartner() && (
                    <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                      Partner Info
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
                      colSpan={isPartner() ? 7 : 8}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
                        Loading super agents...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSuperAgents.length ? (
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
                          {agent.contactPersonName}
                        </p>
                      </TableCell>
                      {!isPartner() && (
                        <TableCell>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white text-sm">
                              {agent.partnerName || "N/A"}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              Code: {agent.partnerCode || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            agent.status === "ACTIVE"
                              ? "default"
                              : agent.status === "INACTIVE"
                              ? "secondary"
                              : agent.status === "PENDING_VERIFICATION"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            agent.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : agent.status === "INACTIVE"
                              ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                              : agent.status === "PENDING_VERIFICATION"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                          }
                        >
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                          {agent.registrationDate
                            ? new Date(
                                agent.registrationDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
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
                            <Link href={`/super-agents/${agent.uid}`}>
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
                      colSpan={isPartner() ? 7 : 8}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      No super agents found.
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
                : `Showing ${filteredSuperAgents.length} of ${totalItems} super agents`}
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
