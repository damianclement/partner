"use client";

import * as React from "react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, CalendarDays, User2, Building2 } from "lucide-react";

type Agent = {
  id: number;
  agentCode: string;
  partnerAgentNumber: string;
  businessName: string;
  passName: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  agentType: "Individual" | "Corporate" | "Agency";
  partner: {
    code: string;
    businessName: string;
  };
  status: "active" | "inactive" | "suspended";
  registrationDate: string;
};

// Demo data source (should be replaced by API in real app)
const AGENTS: Agent[] = [
  {
    id: 1,
    agentCode: "AGT001",
    partnerAgentNumber: "SFC-AG-01",
    businessName: "Nyota Travel Services",
    passName: "Nyota Travel",
    contactPerson: {
      name: "Neema Mwenda",
      email: "neema.mwenda@nyotatravel.co.tz",
      phone: "+255-715-200-345",
    },
    agentType: "Individual",
    partner: {
      code: "SFC001",
      businessName: "SafariLink Coaches",
    },
    status: "active",
    registrationDate: "2024-01-15",
  },
  {
    id: 2,
    agentCode: "AGT002",
    partnerAgentNumber: "CEX-AG-02",
    businessName: "Swahili Coastal Agency",
    passName: "Swahili Coastal",
    contactPerson: {
      name: "Abdallah Said",
      email: "abdallah.said@swahilicostal.co.tz",
      phone: "+255-718-456-210",
    },
    agentType: "Agency",
    partner: {
      code: "CEX002",
      businessName: "Coastal Express Ltd",
    },
    status: "active",
    registrationDate: "2024-02-20",
  },
  {
    id: 3,
    agentCode: "AGT003",
    partnerAgentNumber: "HLT-AG-03",
    businessName: "Kilimanjaro Transport Solutions",
    passName: "Kilimanjaro Transport",
    contactPerson: {
      name: "Asha Kileo",
      email: "asha.kileo@kilimanjaro.co.tz",
      phone: "+255-767-654-320",
    },
    agentType: "Corporate",
    partner: {
      code: "HLT003",
      businessName: "Highland Transit",
    },
    status: "inactive",
    registrationDate: "2024-03-10",
  },
  {
    id: 4,
    agentCode: "AGT004",
    partnerAgentNumber: "LZS-AG-04",
    businessName: "Victoria Fleet Managers",
    passName: "Victoria Fleet",
    contactPerson: {
      name: "Emmanuel Nnko",
      email: "emmanuel.nnko@victoriafleet.co.tz",
      phone: "+255-789-876-540",
    },
    agentType: "Individual",
    partner: {
      code: "LZS004",
      businessName: "LakeZone Shuttles",
    },
    status: "suspended",
    registrationDate: "2023-12-05",
  },
];

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const agentId = Number(params?.id);

  const agent = useMemo(() => AGENTS.find((a) => a.id === agentId), [agentId]);

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
          <Link href="/agents">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Agents
            </Button>
          </Link>
        </div>

        {!agent ? (
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
                    {agent.agentCode}
                  </div>
                  <div className="mt-2 text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Partner Agent #: {agent.partnerAgentNumber}
                  </div>
                </div>
                <Badge
                  variant={
                    agent.status === "active"
                      ? "default"
                      : agent.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    agent.status === "active"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                      : agent.status === "inactive"
                      ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                  }
                >
                  {agent.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Business</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {agent.businessName}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Pass: {agent.passName}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Users className="w-4 h-4" />
                    <span>Partner</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {agent.partner.businessName}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Code: {agent.partner.code}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <User2 className="w-4 h-4" />
                    <span>Contact Person</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {agent.contactPerson.name}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    {agent.contactPerson.email}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    {agent.contactPerson.phone}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Registration</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {new Date(agent.registrationDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Type: {agent.agentType}
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
