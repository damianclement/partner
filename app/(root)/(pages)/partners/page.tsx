"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Key,
  Users,
  Shield,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { usePartners } from "@/lib/contexts/PartnersContext";

export default function PartnersPage() {
  const router = useRouter();

  const {
    partners,
    stats,
    isLoading,
    isStatsLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    filters,
    loadPartners,
    searchPartners,
    setFilters,
    setCurrentPage,
    setPageSize,
    clearError,
    verifyPartner,
    unverifyPartner,
    activatePartner,
    deactivatePartner,
    setPartnerStatus,
    setPartnerTier,
    setPartnerCommission,
    softDeletePartner,
  } = usePartners();

  // Local state for UI interactions
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedPartners, setSelectedPartners] = React.useState<number[]>([]);
  const [searchTimeout, setSearchTimeout] =
    React.useState<NodeJS.Timeout | null>(null);

  // Dialog states
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant: "default" | "destructive";
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    variant: "default",
  });

  const [actionLoading, setActionLoading] = React.useState<number | null>(null);

  // Handle search with debouncing
  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (value.trim()) {
        searchPartners({
          searchTerm: value.trim(),
          page: 0,
          size: pageSize,
        });
      } else {
        loadPartners();
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  // Handle refresh
  const handleRefresh = () => {
    clearError();
    loadPartners();
  };

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
      setSelectedPartners(partners.map((partner) => partner.id));
    } else {
      setSelectedPartners([]);
    }
  };

  // Check if all partners are selected
  const isAllSelected =
    partners.length > 0 && selectedPartners.length === partners.length;

  // Action handlers
  const handleAction = async (
    action: () => Promise<void>,
    partnerId: number
  ) => {
    setActionLoading(partnerId);
    try {
      await action();
      await loadPartners(); // Refresh the list
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const showConfirmDialog = (
    title: string,
    description: string,
    action: () => void,
    variant: "default" | "destructive" = "default"
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      action,
      variant,
    });
  };

  const handleVerifyPartner = (partnerId: number, partnerName: string) => {
    showConfirmDialog(
      "Verify Partner",
      `Are you sure you want to verify ${partnerName}? This will mark them as verified.`,
      () => handleAction(() => verifyPartner(partnerId), partnerId)
    );
  };

  const handleUnverifyPartner = (partnerId: number, partnerName: string) => {
    showConfirmDialog(
      "Unverify Partner",
      `Are you sure you want to unverify ${partnerName}? This will remove their verified status.`,
      () => handleAction(() => unverifyPartner(partnerId), partnerId)
    );
  };

  const handleActivatePartner = (partnerId: number, partnerName: string) => {
    showConfirmDialog(
      "Activate Partner",
      `Are you sure you want to activate ${partnerName}?`,
      () => handleAction(() => activatePartner(partnerId), partnerId)
    );
  };

  const handleDeactivatePartner = (partnerId: number, partnerName: string) => {
    showConfirmDialog(
      "Deactivate Partner",
      `Are you sure you want to deactivate ${partnerName}?`,
      () => handleAction(() => deactivatePartner(partnerId), partnerId)
    );
  };

  const handleSuspendPartner = (partnerId: number, partnerName: string) => {
    showConfirmDialog(
      "Suspend Partner",
      `Are you sure you want to suspend ${partnerName}? This will prevent them from accessing the system.`,
      () =>
        handleAction(() => setPartnerStatus(partnerId, "SUSPENDED"), partnerId),
      "destructive"
    );
  };

  const handleDeletePartner = (partnerId: number, partnerName: string) => {
    showConfirmDialog(
      "Delete Partner",
      `Are you sure you want to delete ${partnerName}? This action cannot be undone.`,
      () => handleAction(() => softDeletePartner(partnerId), partnerId),
      "destructive"
    );
  };

  const handleViewAgents = (partnerUid: string) => {
    router.push(`/agents?partner=${partnerUid}`);
  };

  const handleManageApiKeys = (partnerUid: string) => {
    router.push(`/partners/${partnerUid}/api-keys`);
  };

  const handleEditPartner = (partnerUid: string) => {
    router.push(`/partners/${partnerUid}/edit`);
  };

  // Bulk actions
  const handleBulkVerify = () => {
    showConfirmDialog(
      "Verify Selected Partners",
      `Are you sure you want to verify ${selectedPartners.length} selected partners?`,
      () => handleBulkAction("verify")
    );
  };

  const handleBulkUnverify = () => {
    showConfirmDialog(
      "Unverify Selected Partners",
      `Are you sure you want to unverify ${selectedPartners.length} selected partners?`,
      () => handleBulkAction("unverify")
    );
  };

  const handleBulkActivate = () => {
    showConfirmDialog(
      "Activate Selected Partners",
      `Are you sure you want to activate ${selectedPartners.length} selected partners?`,
      () => handleBulkAction("activate")
    );
  };

  const handleBulkDeactivate = () => {
    showConfirmDialog(
      "Deactivate Selected Partners",
      `Are you sure you want to deactivate ${selectedPartners.length} selected partners?`,
      () => handleBulkAction("deactivate")
    );
  };

  const handleBulkDelete = () => {
    showConfirmDialog(
      "Delete Selected Partners",
      `Are you sure you want to delete ${selectedPartners.length} selected partners? This action cannot be undone.`,
      () => handleBulkAction("delete"),
      "destructive"
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPartners.length === 0) return;

    setActionLoading(-1); // Use -1 to indicate bulk action
    try {
      const promises = selectedPartners.map(async (partnerId) => {
        switch (action) {
          case "verify":
            return verifyPartner(partnerId);
          case "unverify":
            return unverifyPartner(partnerId);
          case "activate":
            return activatePartner(partnerId);
          case "deactivate":
            return deactivatePartner(partnerId);
          case "delete":
            return softDeletePartner(partnerId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      setSelectedPartners([]);
      await loadPartners();
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

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
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.totalPartners?.toLocaleString() || "0"
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">+12 this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Active Partners
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.activePartners?.toLocaleString() || "0"
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {stats
                ? `${(
                    (stats.activePartners / stats.totalPartners) *
                    100
                  ).toFixed(1)}% active rate`
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
              Awaiting review
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Verified Partners
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isStatsLoading ? (
                <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              ) : (
                stats?.verifiedPartners?.toLocaleString() || "0"
              )}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {stats
                ? `${(
                    (stats.verifiedPartners / stats.totalPartners) *
                    100
                  ).toFixed(1)}% verified`
                : "0% verified"}
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
                  Error loading partners
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

        {/* Partners Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Partners
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-obus-text-secondary dark:text-obus-text-light w-4 h-4" />
                <Input
                  placeholder="Search partners..."
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

          {/* Bulk Actions Bar */}
          {selectedPartners.length > 0 && (
            <div className="rounded-lg border border-obus-primary/10 bg-obus-accent/5 p-4 dark:border-white/20 dark:bg-obus-accent/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-obus-primary dark:text-white">
                    {selectedPartners.length} partner
                    {selectedPartners.length > 1 ? "s" : ""} selected
                  </span>
                  {actionLoading === -1 && (
                    <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkVerify}
                    disabled={actionLoading === -1}
                    className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkUnverify}
                    disabled={actionLoading === -1}
                    className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Unverify
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkActivate}
                    disabled={actionLoading === -1}
                    className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDeactivate}
                    disabled={actionLoading === -1}
                    className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={actionLoading === -1}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPartners([])}
                    className="text-obus-text-secondary hover:text-obus-text-primary dark:text-obus-text-light dark:hover:text-white"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
                        Loading partners...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : partners.length ? (
                  partners.map((partner) => (
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
                            partner.type === "COMPANY"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
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
                            partner.tier === "PLATINUM"
                              ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              : partner.tier === "GOLD"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : partner.tier === "SILVER"
                              ? "bg-gray-400/20 text-gray-300 border-gray-400/30"
                              : partner.tier === "BRONZE"
                              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                              : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          }
                        >
                          {partner.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-obus-primary dark:text-white text-sm">
                            {partner.contactPerson.name}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {partner.contactPerson.email}
                          </p>
                          <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                            {partner.contactPerson.phone}
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
                              partner.status === "ACTIVE"
                                ? "default"
                                : partner.status === "INACTIVE"
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              partner.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                                : partner.status === "INACTIVE"
                                ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                                : partner.status === "SUSPENDED"
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                                : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                            }
                          >
                            {partner.status}
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
                          {partner.commissionRate}%
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                          {new Date(partner.createdAt).toLocaleDateString(
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
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              disabled={actionLoading === partner.id}
                            >
                              <span className="sr-only">Open menu</span>
                              {actionLoading === partner.id ? (
                                <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
                              ) : (
                                <MoreHorizontal />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border border-obus-primary/10 bg-white text-obus-text-primary dark:border-white/20 dark:bg-obus-primary dark:text-white min-w-[200px]"
                          >
                            <Link href={`/partners/${partner.uid}`}>
                              <DropdownMenuItem className="text-obus-text-primary dark:text-white cursor-pointer">
                                <Users className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem
                              className="text-obus-text-primary dark:text-white cursor-pointer"
                              onClick={() => handleEditPartner(partner.uid)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Partner
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-obus-text-primary dark:text-white cursor-pointer"
                              onClick={() => handleManageApiKeys(partner.uid)}
                            >
                              <Key className="w-4 h-4 mr-2" />
                              API Keys
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-obus-text-primary dark:text-white cursor-pointer"
                              onClick={() => handleViewAgents(partner.uid)}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              View Agents
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Verification Actions */}
                            {partner.verified ? (
                              <DropdownMenuItem
                                className="text-obus-text-primary dark:text-white cursor-pointer"
                                onClick={() =>
                                  handleUnverifyPartner(
                                    partner.id,
                                    partner.businessName
                                  )
                                }
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Unverify Partner
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-obus-text-primary dark:text-white cursor-pointer"
                                onClick={() =>
                                  handleVerifyPartner(
                                    partner.id,
                                    partner.businessName
                                  )
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify Partner
                              </DropdownMenuItem>
                            )}

                            {/* Status Actions */}
                            {partner.status === "ACTIVE" ? (
                              <DropdownMenuItem
                                className="text-obus-text-primary dark:text-white cursor-pointer"
                                onClick={() =>
                                  handleDeactivatePartner(
                                    partner.id,
                                    partner.businessName
                                  )
                                }
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : partner.status === "INACTIVE" ? (
                              <DropdownMenuItem
                                className="text-obus-text-primary dark:text-white cursor-pointer"
                                onClick={() =>
                                  handleActivatePartner(
                                    partner.id,
                                    partner.businessName
                                  )
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            ) : partner.status === "SUSPENDED" ? (
                              <DropdownMenuItem
                                className="text-obus-text-primary dark:text-white cursor-pointer"
                                onClick={() =>
                                  handleActivatePartner(
                                    partner.id,
                                    partner.businessName
                                  )
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Reactivate
                              </DropdownMenuItem>
                            ) : null}

                            {partner.status !== "SUSPENDED" && (
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400 cursor-pointer"
                                onClick={() =>
                                  handleSuspendPartner(
                                    partner.id,
                                    partner.businessName
                                  )
                                }
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400 cursor-pointer"
                              onClick={() =>
                                handleDeletePartner(
                                  partner.id,
                                  partner.businessName
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Partner
                            </DropdownMenuItem>
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
                      {searchValue
                        ? "No partners found matching your search."
                        : "No partners available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
              {selectedPartners.length > 0
                ? `${selectedPartners.length} of ${partners.length} partners selected`
                : `Showing ${partners.length} of ${totalItems} partners`}
            </div>

            {/* Pagination */}
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

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="border border-obus-primary/10 bg-white dark:border-white/20 dark:bg-obus-primary">
            <DialogHeader>
              <DialogTitle className="text-obus-primary dark:text-white">
                {confirmDialog.title}
              </DialogTitle>
              <DialogDescription className="text-obus-text-secondary dark:text-obus-text-light">
                {confirmDialog.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                variant={
                  confirmDialog.variant === "destructive"
                    ? "destructive"
                    : "default"
                }
                onClick={() => {
                  confirmDialog.action();
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }}
                className={
                  confirmDialog.variant === "destructive"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-obus-accent hover:bg-obus-accent/90 text-white"
                }
              >
                {confirmDialog.variant === "destructive" ? "Delete" : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
