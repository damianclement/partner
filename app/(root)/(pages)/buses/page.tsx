"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, MapPin, Clock } from "lucide-react";
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

export type Bus = {
  id: number;
  registration: string;
  route: string;
  operator: string;
  status: "active" | "maintenance" | "inactive";
  capacity: number;
  currentLocation: string;
  nextDeparture: string;
};

export default function BusesPage() {
  const buses: Bus[] = [
    {
      id: 1,
      registration: "DAR-001-DDM",
      route: "Dar es Salaam - Dodoma",
      operator: "SafariLink Coaches",
      status: "active",
      capacity: 50,
      currentLocation: "Dar es Salaam Depot",
      nextDeparture: "14:30",
    },
    {
      id: 2,
      registration: "DDM-002-MWZ",
      route: "Dodoma - Mwanza",
      operator: "Coastal Express Ltd",
      status: "active",
      capacity: 45,
      currentLocation: "Dodoma Terminal",
      nextDeparture: "16:00",
    },
    {
      id: 3,
      registration: "DAR-003-ARU",
      route: "Dar es Salaam - Arusha",
      operator: "Highland Transit",
      status: "maintenance",
      capacity: 60,
      currentLocation: "Arusha Workshop",
      nextDeparture: "Tomorrow 08:00",
    },
    {
      id: 4,
      registration: "MWZ-004-ARU",
      route: "Mwanza - Arusha",
      operator: "LakeZone Shuttles",
      status: "inactive",
      capacity: 40,
      currentLocation: "Mwanza Yard",
      nextDeparture: "Maintenance",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedBuses, setSelectedBuses] = React.useState<number[]>([]);
// Filter buses based on search input
  const filteredBuses = buses.filter(
    (bus) =>
      bus.registration.toLowerCase().includes(filterValue.toLowerCase()) ||
      bus.route.toLowerCase().includes(filterValue.toLowerCase()) ||
      bus.operator.toLowerCase().includes(filterValue.toLowerCase()) ||
      bus.currentLocation.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual bus selection
  const handleBusSelect = (busId: number, checked: boolean) => {
    if (checked) {
      setSelectedBuses((prev) => [...prev, busId]);
    } else {
      setSelectedBuses((prev) => prev.filter((id) => id !== busId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBuses(filteredBuses.map((bus) => bus.id));
    } else {
      setSelectedBuses([]);
    }
  };

  // Check if all filtered buses are selected
  const isAllSelected =
    filteredBuses.length > 0 && selectedBuses.length === filteredBuses.length;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Bus Systems</h1>
            <p className="text-caption mt-2">
              Monitor and manage all bus fleets across the network
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Bus
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Buses
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">847</div>
            <p className="text-xs text-obus-accent mt-1">+23 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Buses
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">782</div>
            <p className="text-xs text-obus-accent mt-1">92.3% operational</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              In Maintenance
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">45</div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              Scheduled maintenance
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Routes
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">156</div>
            <p className="text-xs text-obus-accent mt-1">+8 new routes</p>
          </div>
        </div>

        {/* Buses Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">All Buses</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter buses..."
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
                    Bus Registration
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">Route</TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Operator
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Capacity
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Location
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Next Departure
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
                {filteredBuses.length ? (
                  filteredBuses.map((bus) => (
                    <TableRow
                      key={bus.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedBuses.includes(bus.id)}
                          onCheckedChange={(checked) =>
                            handleBusSelect(bus.id, !!checked)
                          }
                          aria-label={`Select ${bus.registration}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {bus.registration.substring(0, 3)}
                          </div>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {bus.registration}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              Bus ID: {bus.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-medium text-obus-primary dark:text-white">{bus.route}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-obus-primary dark:text-white">{bus.operator}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          {bus.capacity}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          {bus.currentLocation}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <p className="font-semibold text-obus-primary dark:text-white">
                            {bus.nextDeparture}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            bus.status === "active"
                              ? "default"
                              : bus.status === "maintenance"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            bus.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : bus.status === "maintenance"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {bus.status.toUpperCase()}
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
                              Edit bus
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
              {selectedBuses.length > 0
                ? `${selectedBuses.length} of ${filteredBuses.length} buses selected`
                : `Showing ${filteredBuses.length} of ${buses.length} buses`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}





