"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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

export type Partner = {
  id: number;
  businessName: string;
  legalName: string;
  code: string;
  type: "Corporate" | "Individual" | "Agency";
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  status: "active" | "inactive";
  verified: boolean;
  commission: number;
  created: string;
};

export default function PartnersPage() {
  const router = useRouter();

  const partners: Partner[] = [
    {
      id: 1,
      businessName: "SafariLink Coaches",
      legalName: "SafariLink Coaches Limited",
      code: "SFC001",
      type: "Corporate",
      tier: "Gold",
      contact: {
        name: "Juma Mwakyusa",
        email: "juma@safarilink.co.tz",
        phone: "+255-752-123-456",
      },
      location: {
        city: "Dar es Salaam",
        state: "Dar es Salaam Region",
        country: "Tanzania",
      },
      status: "active",
      verified: true,
      commission: 12.5,
      created: "2024-01-15",
    },
    {
      id: 2,
      businessName: "Coastal Express Ltd",
      legalName: "Coastal Express Services Limited",
      code: "CEX002",
      type: "Agency",
      tier: "Silver",
      contact: {
        name: "Neema Mshana",
        email: "neema@coastalexpress.co.tz",
        phone: "+255-713-987-654",
      },
      location: {
        city: "Tanga",
        state: "Tanga Region",
        country: "Tanzania",
      },
      status: "active",
      verified: true,
      commission: 10.0,
      created: "2024-02-20",
    },
    {
      id: 3,
      businessName: "Highland Transit",
      legalName: "Highland Transit Solutions",
      code: "HLT003",
      type: "Individual",
      tier: "Bronze",
      contact: {
        name: "Asha Kileo",
        email: "asha@highlandtransit.co.tz",
        phone: "+255-768-234-567",
      },
      location: {
        city: "Arusha",
        state: "Arusha Region",
        country: "Tanzania",
      },
      status: "inactive",
      verified: false,
      commission: 8.5,
      created: "2024-03-10",
    },
    {
      id: 4,
      businessName: "LakeZone Shuttles",
      legalName: "LakeZone Shuttles Limited",
      code: "LZS004",
      type: "Corporate",
      tier: "Platinum",
      contact: {
        name: "Emmanuel Nnko",
        email: "emmanuel@lakezone.co.tz",
        phone: "+255-789-345-678",
      },
      location: {
        city: "Mwanza",
        state: "Mwanza Region",
        country: "Tanzania",
      },
      status: "active",
      verified: true,
      commission: 14.0,
      created: "2024-04-05",
    },
    {
      id: 5,
      businessName: "Zanzibar Coastal Lines",
      legalName: "Zanzibar Coastal Lines Limited",
      code: "ZCL005",
      type: "Agency",
      tier: "Gold",
      contact: {
        name: "Amina Salum",
        email: "amina@zancoast.co.tz",
        phone: "+255-714-456-890",
      },
      location: {
        city: "Zanzibar City",
        state: "Unguja South Region",
        country: "Tanzania",
      },
      status: "active",
      verified: true,
      commission: 11.5,
      created: "2024-05-12",
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedPartners, setSelectedPartners] = React.useState<number[]>([]);
  // Filter partners based on search input
  const filteredPartners = partners.filter(
    (partner) =>
      partner.businessName.toLowerCase().includes(filterValue.toLowerCase()) ||
      partner.legalName.toLowerCase().includes(filterValue.toLowerCase()) ||
      partner.code.toLowerCase().includes(filterValue.toLowerCase()) ||
      partner.location.city.toLowerCase().includes(filterValue.toLowerCase()) ||
      partner.contact.name.toLowerCase().includes(filterValue.toLowerCase())
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
          <Button
            className="bg-obus-accent hover:bg-obus-accent/90"
            onClick={() => router.push("/partners/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Partner
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Partners
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              247
            </div>
            <p className="text-xs text-obus-accent mt-1">+12 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Partners
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              189
            </div>
            <p className="text-xs text-obus-accent mt-1">76% of total</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Pending Approval
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              23
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              Awaiting review
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              $124.5K
            </div>
            <p className="text-xs text-obus-accent mt-1">+15% this month</p>
          </div>
        </div>

        {/* Partners Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Partners
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter partners..."
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
                    Partner
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Code
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Type
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Tier
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Contact
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Location
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Commission
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Created
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length ? (
                  filteredPartners.map((partner) => (
                    <TableRow
                      key={partner.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedPartners.includes(partner.id)}
                          onCheckedChange={(checked) =>
                            handlePartnerSelect(partner.id, !!checked)
                          }
                          aria-label={`Select ${partner.businessName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-obus-accent rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {partner.businessName.charAt(0)}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                partner.verified
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            >
                              <div
                                className={`w-full h-full rounded-full ${
                                  partner.verified
                                    ? "bg-green-400"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-obus-primary dark:text-white text-base truncate">
                              {partner.businessName}
                            </p>
                            <p className="text-sm text-obus-text-secondary dark:text-obus-text-light truncate">
                              {partner.legalName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm text-obus-primary dark:text-white">
                          {partner.code}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            partner.type === "Corporate"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : partner.type === "Agency"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }
                        >
                          {partner.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            partner.tier === "Platinum"
                              ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              : partner.tier === "Gold"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : partner.tier === "Silver"
                              ? "bg-gray-400/20 text-gray-300 border-gray-400/30"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          }
                        >
                          {partner.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white text-sm">
                            {partner.contact.name}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {partner.contact.email}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {partner.contact.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white text-sm">
                            {partner.location.city}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {partner.location.state}, {partner.location.country}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              partner.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              partner.status === "active"
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                                : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                            }
                          >
                            {partner.status.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              partner.verified
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }
                          >
                            {partner.verified ? "VERIFIED" : "UNVERIFIED"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          {partner.commission}%
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                          {new Date(partner.created).toLocaleDateString(
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
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              View Details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Edit Partner
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              API Keys
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              View Agents
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Toggle Status
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={11}
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
