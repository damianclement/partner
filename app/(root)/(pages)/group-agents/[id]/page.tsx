"use client";

import * as React from "react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Target,
  CalendarDays,
  Building2,
} from "lucide-react";

type GroupAgent = {
  id: number;
  code: string;
  name: string;
  externalSystemId: string;
  partner: string;
  type: "Corporate" | "Agency" | "Individual" | "Franchise";
  status: "active" | "inactive" | "suspended" | "pending";
  agentCount: number;
  busSystemCount: number;
  created: string;
};

// Demo data source (replace with API in real app)
const GROUPS: GroupAgent[] = [
  {
    id: 1,
    code: "GAG001",
    name: "Dar Corridor Elite",
    externalSystemId: "EXT-DAR-001",
    partner: "SafariLink Coaches",
    type: "Corporate",
    status: "active",
    agentCount: 8,
    busSystemCount: 12,
    created: "2023-02-15",
  },
  {
    id: 2,
    code: "GAG002",
    name: "Dodoma Express Network",
    externalSystemId: "EXT-DDM-002",
    partner: "Coastal Express Ltd",
    type: "Agency",
    status: "active",
    agentCount: 6,
    busSystemCount: 8,
    created: "2023-03-20",
  },
  {
    id: 3,
    code: "GAG003",
    name: "Kilimanjaro Summit Group",
    externalSystemId: "EXT-ARU-003",
    partner: "Highland Transit",
    type: "Franchise",
    status: "pending",
    agentCount: 5,
    busSystemCount: 6,
    created: "2023-04-10",
  },
  {
    id: 4,
    code: "GAG004",
    name: "Lake Victoria Collective",
    externalSystemId: "EXT-MWZ-004",
    partner: "LakeZone Shuttles",
    type: "Individual",
    status: "suspended",
    agentCount: 4,
    busSystemCount: 3,
    created: "2023-05-05",
  },
  {
    id: 5,
    code: "GAG005",
    name: "Zanzibar Premium Alliance",
    externalSystemId: "EXT-ZNZ-005",
    partner: "Zanzibar Coastal Lines",
    type: "Corporate",
    status: "active",
    agentCount: 7,
    busSystemCount: 10,
    created: "2023-01-28",
  },
];

export default function GroupAgentDetailPage() {
  const params = useParams<{ id: string }>();
  const groupId = Number(params?.id);

  const group = useMemo(() => GROUPS.find((g) => g.id === groupId), [groupId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">Group Agent Details</h1>
            <p className="text-caption mt-2">
              View full details for this group agent
            </p>
          </div>
          <Link href="/group-agents">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Groups
            </Button>
          </Link>
        </div>

        {!group ? (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            Group agent not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Summary Card */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Group Code
                  </div>
                  <div className="text-2xl font-bold text-obus-primary dark:text-white">
                    {group.code}
                  </div>
                  <div className="mt-2 text-sm text-obus-text-secondary dark:text-obus-text-light">
                    External ID: {group.externalSystemId}
                  </div>
                </div>
                <Badge
                  variant={
                    group.status === "active"
                      ? "default"
                      : group.status === "inactive"
                      ? "secondary"
                      : group.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    group.status === "active"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                      : group.status === "inactive"
                      ? "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                      : group.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                  }
                >
                  {group.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Group</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {group.name}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Type: {group.type}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Users className="w-4 h-4" />
                    <span>Partner</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {group.partner}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Users className="w-4 h-4" />
                    <span>Members</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    Agents: {group.agentCount}
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    Bus Systems: {group.busSystemCount}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Created</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {new Date(group.created).toLocaleDateString("en-US", {
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
                <Button className="w-full">Edit Group</Button>
                <Button variant="outline" className="w-full">
                  Manage Agents
                </Button>
                <Button variant="outline" className="w-full">
                  Manage Bus Systems
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Group
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
