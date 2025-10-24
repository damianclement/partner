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
  Star,
  User2,
  Building2,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { useSuperAgents } from "@/lib/contexts/SuperAgentsContext";

export default function SuperAgentDetailPage() {
  const params = useParams<{ id: string }>();
  const superAgentUid = params?.id as string;

  const {
    currentSuperAgent,
    isLoading,
    error,
    loadSuperAgentByUid,
    clearError,
    clearCurrentSuperAgent,
  } = useSuperAgents();

  // Load super agent data when component mounts or superAgentUid changes
  useEffect(() => {
    if (superAgentUid) {
      loadSuperAgentByUid(superAgentUid);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentSuperAgent();
    };
  }, [superAgentUid, loadSuperAgentByUid, clearCurrentSuperAgent]);

  const handleRefresh = () => {
    if (superAgentUid) {
      clearError();
      loadSuperAgentByUid(superAgentUid);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">Super Agent Details</h1>
            <p className="text-caption mt-2">
              Full profile and partner linkage
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
            <Link href="/super-agents">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Super Agents
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
                  Error loading super agent
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
              Loading super agent details...
            </div>
          </div>
        ) : !currentSuperAgent ? (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            Super agent not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Summary Card */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Agent #
                  </div>
                  <div className="text-2xl font-bold text-obus-primary dark:text-white">
                    {currentSuperAgent.agentNumber}
                  </div>
                  <div className="mt-2 text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Business: {currentSuperAgent.businessName}
                  </div>
                </div>
                <Badge
                  variant={
                    currentSuperAgent.status === "ACTIVE"
                      ? "default"
                      : currentSuperAgent.status === "INACTIVE"
                      ? "secondary"
                      : currentSuperAgent.status === "PENDING_VERIFICATION"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    currentSuperAgent.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                      : currentSuperAgent.status === "INACTIVE"
                      ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                      : currentSuperAgent.status === "PENDING_VERIFICATION"
                      ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                  }
                >
                  {currentSuperAgent.status}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <User2 className="w-4 h-4" />
                    <span>Contact Person</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentSuperAgent.contactPersonName}
                  </div>
                  {currentSuperAgent.contactPersonEmail && (
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {currentSuperAgent.contactPersonEmail}
                    </div>
                  )}
                  {currentSuperAgent.contactPersonPhone && (
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {currentSuperAgent.contactPersonPhone}
                    </div>
                  )}
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Partner</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentSuperAgent.partnerName || "N/A"}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Code: {currentSuperAgent.partnerCode || "N/A"}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Registration Date</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {new Date(
                      currentSuperAgent.registrationDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Side Actions */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
              <div className="space-y-3">
                <Button className="w-full">
                  <Star className="w-4 h-4 mr-2" /> Promote/Demote Tier
                </Button>
                <Button variant="outline" className="w-full">
                  Assign Agents
                </Button>
                <Button variant="destructive" className="w-full">
                  Deactivate
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
