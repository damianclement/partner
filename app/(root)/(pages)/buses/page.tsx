"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Server, Globe } from "lucide-react";
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
import {
  useBusCoreSystems,
  type BusCoreSystem,
} from "@/lib/contexts/BusCoreSystemsContext";

export default function BusesPage() {
  const {
    busCoreSystems,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    searchBusCoreSystems,
    setCurrentPage,
    setPageSize,
    calculateStatsFromBusCoreSystems,
  } = useBusCoreSystems();

  // Calculate statistics from current bus core systems data
  const calculatedStats = React.useMemo(() => {
    return calculateStatsFromBusCoreSystems();
  }, [calculateStatsFromBusCoreSystems]);

  // Debug logging
  React.useEffect(() => {
    console.log("BusesPage - busCoreSystems:", busCoreSystems);
    console.log("BusesPage - isLoading:", isLoading);
    console.log("BusesPage - error:", error);
  }, [busCoreSystems, isLoading, error]);

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedBusCoreSystems, setSelectedBusCoreSystems] = React.useState<
    string[]
  >([]);

  // Filter bus core systems based on search input
  const filteredBusCoreSystems = busCoreSystems.filter(
    (busCoreSystem) =>
      busCoreSystem.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      busCoreSystem.code.toLowerCase().includes(filterValue.toLowerCase()) ||
      busCoreSystem.providerName
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      busCoreSystem.description
        .toLowerCase()
        .includes(filterValue.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setFilterValue(value);
    searchBusCoreSystems(value);
  };

  // Handle individual bus core system selection
  const handleBusCoreSystemSelect = (
    busCoreSystemUid: string,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedBusCoreSystems((prev) => [...prev, busCoreSystemUid]);
    } else {
      setSelectedBusCoreSystems((prev) =>
        prev.filter((uid) => uid !== busCoreSystemUid)
      );
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBusCoreSystems(
        filteredBusCoreSystems.map((busCoreSystem) => busCoreSystem.uid)
      );
    } else {
      setSelectedBusCoreSystems([]);
    }
  };

  // Check if all filtered bus core systems are selected
  const isAllSelected =
    filteredBusCoreSystems.length > 0 &&
    selectedBusCoreSystems.length === filteredBusCoreSystems.length;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Bus Core Systems</h1>
            <p className="text-caption mt-2">
              Monitor and manage all bus core systems and integrations
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New System
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Systems
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.totalBusCoreSystems}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {totalItems > 0
                ? `${totalItems} total in system`
                : "No systems available"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Default Systems
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.defaultBusCoreSystems}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {calculatedStats.totalBusCoreSystems > 0
                ? `${(
                    (calculatedStats.defaultBusCoreSystems /
                      calculatedStats.totalBusCoreSystems) *
                    100
                  ).toFixed(1)}% are default`
                : "No default systems"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Providers
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.providers.length}
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              Unique providers
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Avg per Provider
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading
                ? "..."
                : calculatedStats.averageSystemsPerProvider.toFixed(1)}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              Systems per provider
            </p>
          </div>
        </div>

        {/* Bus Core Systems Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Bus Core Systems
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter systems..."
                value={filterValue}
                onChange={(event) => handleSearchChange(event.target.value)}
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
                    System Name
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Code
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Provider
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Base URL
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Description
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Default
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-obus-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-obus-text-secondary dark:text-obus-text-light">
                          Loading bus core systems...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredBusCoreSystems.length ? (
                  filteredBusCoreSystems.map((busCoreSystem) => (
                    <TableRow
                      key={busCoreSystem.uid}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedBusCoreSystems.includes(
                            busCoreSystem.uid
                          )}
                          onCheckedChange={(checked) =>
                            handleBusCoreSystemSelect(
                              busCoreSystem.uid,
                              !!checked
                            )
                          }
                          aria-label={`Select ${busCoreSystem.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            <Server className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {busCoreSystem.name}
                            </p>
                            {/* <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              UID: {busCoreSystem.uid}
                            </p> */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {busCoreSystem.code}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">
                          {busCoreSystem.providerName}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Globe className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white text-xs">
                            {busCoreSystem.baseUrl}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white text-xs">
                          {busCoreSystem.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            busCoreSystem.isDefault ? "default" : "outline"
                          }
                          className={
                            busCoreSystem.isDefault
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {busCoreSystem.isDefault ? "DEFAULT" : "NORMAL"}
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
                              Edit system
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
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      {filterValue
                        ? "No bus core systems found matching your search."
                        : "No bus core systems available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
              {selectedBusCoreSystems.length > 0
                ? `${selectedBusCoreSystems.length} of ${filteredBusCoreSystems.length} systems selected`
                : `Showing ${filteredBusCoreSystems.length} of ${totalItems} systems`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
