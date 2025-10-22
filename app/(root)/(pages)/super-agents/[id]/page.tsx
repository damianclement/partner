"use client";

import * as React from "react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, User2, Building2, CalendarDays } from "lucide-react";

type SuperAgent = {
  id: number;
  agentNumber: string;
  businessName: string;
  contactPerson: string;
  partner: {
    name: string;
    code: string;
  };
  status: "active" | "inactive" | "suspended" | "pending";
  registrationDate: string;
};

// Demo data source (replace with API in real app)
const SUPER_AGENTS: SuperAgent[] = [
  {
    id: 1,
    agentNumber: "SA-001",
    businessName: "SafariLink Elite Services",
    contactPerson: "Juma Mwakyusa",
    partner: { name: "SafariLink Coaches", code: "SFC001" },
    status: "active",
    registrationDate: "2023-01-15",
  },
  {
    id: 2,
    agentNumber: "SA-002",
    businessName: "Coastal Premium Express",
    contactPerson: "Neema Mshana",
    partner: { name: "Coastal Express Ltd", code: "CEX002" },
    status: "active",
    registrationDate: "2023-03-20",
  },
  {
    id: 3,
    agentNumber: "SA-003",
    businessName: "Highland Summit Agency",
    contactPerson: "Asha Kileo",
    partner: { name: "Highland Transit", code: "HLT003" },
    status: "pending",
    registrationDate: "2023-06-10",
  },
  {
    id: 4,
    agentNumber: "SA-004",
    businessName: "LakeZone Elite Services",
    contactPerson: "Emmanuel Nnko",
    partner: { name: "LakeZone Shuttles", code: "LZS004" },
    status: "suspended",
    registrationDate: "2023-08-05",
  },
  {
    id: 5,
    agentNumber: "SA-005",
    businessName: "Zanzibar Coastal Alliance",
    contactPerson: "Amina Salum",
    partner: { name: "Zanzibar Coastal Lines", code: "ZCL005" },
    status: "active",
    registrationDate: "2023-02-28",
  },
];

export default function SuperAgentDetailPage() {
  const params = useParams<{ id: string }>();
  const superAgentId = Number(params?.id);

  const superAgent = useMemo(
    () => SUPER_AGENTS.find((sa) => sa.id === superAgentId),
    [superAgentId]
  );

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
          <Link href="/super-agents">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Super Agents
            </Button>
          </Link>
        </div>

        {!superAgent ? (
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
                    {superAgent.agentNumber}
                  </div>
                  <div className="mt-2 text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Business: {superAgent.businessName}
                  </div>
                </div>
                <Badge
                  variant={
                    superAgent.status === "active"
                      ? "default"
                      : superAgent.status === "inactive"
                      ? "secondary"
                      : superAgent.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    superAgent.status === "active"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                      : superAgent.status === "inactive"
                      ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                      : superAgent.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                  }
                >
                  {superAgent.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <User2 className="w-4 h-4" />
                    <span>Contact Person</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {superAgent.contactPerson}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Partner</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {superAgent.partner.name}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Code: {superAgent.partner.code}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Registration Date</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {new Date(superAgent.registrationDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
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
