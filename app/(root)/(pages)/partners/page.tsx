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

export type Partner = {
  id: number;
  name: string;
  status: "active" | "pending" | "suspended";
  location: string;
  agents: number;
  bookings: number;
  revenue: string;
};

export default function PartnersPage() {
  const partners: Partner[] = [
    {
      id: 1,
      name: "ABC Transport Co.",
      status: "active",
      location: "Lagos, Nigeria",
      agents: 45,
      bookings: 234,
      revenue: "$12,450",
    },
    {
      id: 2,
      name: "City Express",
      status: "active",
      location: "Abuja, Nigeria",
      agents: 32,
      bookings: 189,
      revenue: "$8,900",
    },
    {
      id: 3,
      name: "Metro Transit",
      status: "pending",
      location: "Port Harcourt, Nigeria",
      agents: 18,
      bookings: 0,
      revenue: "$0",
    },
    {
      id: 4,
      name: "Highway Kings",
      status: "suspended",
      location: "Kano, Nigeria",
      agents: 67,
      bookings: 445,
      revenue: "$18,750",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedPartners, setSelectedPartners] = React.useState<number[]>([]);
  const [selectAll, setSelectAll] = React.useState(false);

  // Filter partners based on search input
  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      partner.location.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual partner selection
  const handlePartnerSelect = (partnerId: number, checked: boolean) => {
    if (checked) {
      setSelectedPartners((prev) => [...prev, partnerId]);
    } else {
      setSelectedPartners((prev) => prev.filter((id) => id !== partnerId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedPartners(filteredPartners.map((partner) => partner.id));
    } else {
      setSelectedPartners([]);
    }
  };

  // Check if all filtered partners are selected
  const isAllSelected =
    filteredPartners.length > 0 &&
    selectedPartners.length === filteredPartners.length;
  const isIndeterminate =
    selectedPartners.length > 0 &&
    selectedPartners.length < filteredPartners.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Partner Management</h1>
            <p className="text-caption mt-2">
              Manage and monitor all transportation partners in your network
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Partner
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Partners
            </div>
            <div className="text-2xl font-bold text-white">247</div>
            <p className="text-xs text-obus-accent mt-1">+12 this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Active Partners
            </div>
            <div className="text-2xl font-bold text-white">189</div>
            <p className="text-xs text-obus-accent mt-1">76% of total</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Pending Approval
            </div>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-obus-text-light mt-1">Awaiting review</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-white">$124.5K</div>
            <p className="text-xs text-obus-accent mt-1">+15% this month</p>
          </div>
        </div>

        {/* Partners Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">All Partners</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter partners..."
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="max-w-sm bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="rounded-md border border-white/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-obus-text-light w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-obus-text-light">
                    Partner Name
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Agents
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Bookings
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Revenue
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
                {filteredPartners.length ? (
                  filteredPartners.map((partner) => (
                    <TableRow
                      key={partner.id}
                      className="border-white/20 hover:bg-white/5"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedPartners.includes(partner.id)}
                          onCheckedChange={(checked) =>
                            handlePartnerSelect(partner.id, !!checked)
                          }
                          aria-label={`Select ${partner.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {partner.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {partner.name}
                            </p>
                            <p className="text-xs text-obus-text-light">
                              {partner.location}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {partner.agents}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {partner.bookings}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {partner.revenue}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            partner.status === "active"
                              ? "default"
                              : partner.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            partner.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : partner.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }
                        >
                          {partner.status.toUpperCase()}
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
                          <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem>
                              View details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                              Edit partner
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
              {selectedPartners.length > 0
                ? `${selectedPartners.length} of ${filteredPartners.length} partners selected`
                : `Showing ${filteredPartners.length} of ${partners.length} partners`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
