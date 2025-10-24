"use client";

import * as React from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  CalendarDays,
  Building2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Shield,
  Key,
} from "lucide-react";
import { usePartners } from "@/lib/contexts/PartnersContext";

export default function PartnerDetailPage() {
  const params = useParams<{ id: string }>();
  const partnerUid = params?.id as string;

  const {
    currentPartner,
    isLoading,
    error,
    loadPartnerByUid,
    clearError,
    clearCurrentPartner,
  } = usePartners();

  // Load partner data when component mounts or partnerUid changes
  useEffect(() => {
    if (partnerUid) {
      loadPartnerByUid(partnerUid);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentPartner();
    };
  }, [partnerUid, loadPartnerByUid, clearCurrentPartner]);

  const handleRefresh = () => {
    if (partnerUid) {
      clearError();
      loadPartnerByUid(partnerUid);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">Partner Details</h1>
            <p className="text-caption mt-2">
              View full profile and activity for this partner
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link href="/partners">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Partners
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error loading partner
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

        {isLoading ? (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
            <div className="flex items-center justify-center gap-2 text-obus-text-secondary dark:text-obus-text-light">
              <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              Loading partner details...
            </div>
          </div>
        ) : !currentPartner ? (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            Partner not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Summary Card */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Partner Code
                  </div>
                  <div className="text-2xl font-bold text-obus-primary dark:text-white">
                    {currentPartner.code}
                  </div>
                  <div className="mt-2 text-sm text-obus-text-secondary dark:text-obus-text-light">
                    UID: {currentPartner.uid}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge
                    variant={
                      currentPartner.status === "ACTIVE"
                        ? "default"
                        : currentPartner.status === "INACTIVE"
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      currentPartner.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                        : currentPartner.status === "INACTIVE"
                        ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                        : currentPartner.status === "SUSPENDED"
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                        : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                    }
                  >
                    {currentPartner.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      currentPartner.verified
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {currentPartner.verified ? "VERIFIED" : "UNVERIFIED"}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Business</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentPartner.businessName}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Legal: {currentPartner.legalName}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Type: {currentPartner.type}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Tier & Commission</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentPartner.tier}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Commission: {currentPartner.commissionRate}%
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Users className="w-4 h-4" />
                    <span>Contact Person</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentPartner.contactPerson.name}
                  </div>
                  {currentPartner.contactPerson.email && (
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {currentPartner.contactPerson.email}
                    </div>
                  )}
                  {currentPartner.contactPerson.phone && (
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {currentPartner.contactPerson.phone}
                    </div>
                  )}
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentPartner.location.city}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    {currentPartner.location.state},{" "}
                    {currentPartner.location.country}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(currentPartner.description || currentPartner.notes) && (
                <div className="mt-6 space-y-4">
                  {currentPartner.description && (
                    <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                      <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
                        Description
                      </div>
                      <div className="text-obus-primary dark:text-white">
                        {currentPartner.description}
                      </div>
                    </div>
                  )}
                  {currentPartner.notes && (
                    <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                      <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
                        Notes
                      </div>
                      <div className="text-obus-primary dark:text-white">
                        {currentPartner.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Business Details */}
              <div className="mt-6 rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-4">
                  Business Details
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                      Business Registration Number
                    </div>
                    <div className="text-sm text-obus-primary dark:text-white">
                      {currentPartner.businessRegistrationNumber ||
                        "Not provided"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                      Tax Identification Number
                    </div>
                    <div className="text-sm text-obus-primary dark:text-white">
                      {currentPartner.taxIdentificationNumber || "Not provided"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                      Business Address
                    </div>
                    <div className="text-sm text-obus-primary dark:text-white">
                      {currentPartner.businessAddress || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6 rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-4">
                  Contact Information
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                    <div>
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        Email
                      </div>
                      <div className="text-sm text-obus-primary dark:text-white">
                        {currentPartner.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                    <div>
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        Phone
                      </div>
                      <div className="text-sm text-obus-primary dark:text-white">
                        {currentPartner.phoneNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div className="mt-6 rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-4">
                  Registration Information
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                    <div>
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        Created
                      </div>
                      <div className="text-sm text-obus-primary dark:text-white">
                        {new Date(currentPartner.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                    <div>
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        Last Updated
                      </div>
                      <div className="text-sm text-obus-primary dark:text-white">
                        {new Date(currentPartner.updatedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Actions */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
              <div className="space-y-3">
                <Button className="w-full">Edit Partner</Button>
                <Button variant="outline" className="w-full">
                  {currentPartner.status === "ACTIVE"
                    ? "Deactivate"
                    : "Activate"}{" "}
                  Partner
                </Button>
                <Button variant="outline" className="w-full">
                  {currentPartner.verified ? "Unverify" : "Verify"} Partner
                </Button>
                <Button variant="outline" className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Manage API Keys
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  View Agents
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Partner
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
