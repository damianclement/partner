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
  User2,
  Building2,
  RefreshCw,
} from "lucide-react";
import { useAgents } from "@/lib/contexts/AgentsContext";

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const agentUid = params?.id as string;

  const {
    currentAgent,
    isLoading,
    error,
    loadAgentByUid,
    clearError,
    clearCurrentAgent,
  } = useAgents();

  // Load agent data when component mounts or agentUid changes
  useEffect(() => {
    if (agentUid) {
      loadAgentByUid(agentUid);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentAgent();
    };
  }, [agentUid, loadAgentByUid, clearCurrentAgent]);

  const handleRefresh = () => {
    if (agentUid) {
      clearError();
      loadAgentByUid(agentUid);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">Agent Details</h1>
            <p className="text-caption mt-2">
              View full profile and activity for this agent
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
            <Link href="/agents">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Agents
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
                <span className="text-sm font-medium">Error loading agent</span>
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
              Loading agent details...
            </div>
          </div>
        ) : !currentAgent ? (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            Agent not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Summary Card */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Agent Code
                  </div>
                  <div className="text-2xl font-bold text-obus-primary dark:text-white">
                    {currentAgent.code}
                  </div>
                  <div className="mt-2 text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Partner Agent #: {currentAgent.partnerAgentNumber}
                  </div>
                </div>
                <Badge
                  variant={
                    currentAgent.status === "active"
                      ? "default"
                      : currentAgent.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    currentAgent.status === "active"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                      : currentAgent.status === "inactive"
                      ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                      : currentAgent.status === "suspended"
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                      : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                  }
                >
                  {currentAgent.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Business</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentAgent.businessName}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Pass: {currentAgent.passName}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Users className="w-4 h-4" />
                    <span>Partner</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentAgent.partner.businessName}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Code: {currentAgent.partner.code}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <User2 className="w-4 h-4" />
                    <span>Contact Person</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {currentAgent.contactPerson.name}
                  </div>
                  {currentAgent.contactPerson.email && (
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {currentAgent.contactPerson.email}
                    </div>
                  )}
                  {currentAgent.contactPerson.phone && (
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {currentAgent.contactPerson.phone}
                    </div>
                  )}
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Registration</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {new Date(currentAgent.registrationDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Type: {currentAgent.agentType}
                  </div>
                </div>
              </div>
            </div>

            {/* Side Actions */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
              <div className="space-y-3">
                <Button className="w-full">Edit Agent</Button>
                <Button variant="outline" className="w-full">
                  Disable Agent
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Agent
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
