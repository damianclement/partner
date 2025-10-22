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
  ShieldCheck,
  Building2,
  Mail,
  User2,
  Phone,
  IdCard,
  Briefcase,
} from "lucide-react";

type User = {
  id: number;
  displayName: string;
  fullName: string;
  username: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  userType: "admin" | "partner";
  partner?: {
    name: string;
    code: string;
  };
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
};

// Demo data source (replace with API in real app)
const USERS: User[] = [
  {
    id: 1,
    displayName: "John Doe",
    fullName: "John Michael Doe",
    username: "jdoe",
    email: "john.doe@obus.com",
    employeeId: "EMP001",
    department: "IT Administration",
    position: "System Administrator",
    userType: "admin",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2 hours ago",
  },
  {
    id: 4,
    displayName: "Alice Brown",
    fullName: "Alice Marie Brown",
    username: "abrown",
    email: "alice.brown@obus.com",
    employeeId: "EMP004",
    department: "Partner Relations",
    position: "Partner Manager",
    userType: "partner",
    partner: {
      name: "City Transport Ltd",
      code: "CT001",
    },
    status: "inactive",
    createdAt: "2024-02-10",
    lastLogin: "2 weeks ago",
  },
];

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = Number(params?.id);

  const user = useMemo(() => USERS.find((u) => u.id === userId), [userId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">User Details</h1>
            <p className="text-caption mt-2">
              User profile, role and organization
            </p>
          </div>
          <Link href="/users">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
            </Button>
          </Link>
        </div>

        {!user ? (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            User not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Summary Card */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-obus-accent rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {user.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-obus-primary dark:text-white">
                      {user.displayName}
                    </div>
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {user.fullName}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                  className={
                    user.status === "active"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                      : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                  }
                >
                  {user.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>User Type</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium capitalize">
                    {user.userType}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {user.email}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Username: {user.username}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <IdCard className="w-4 h-4" />
                    <span>Identity</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    Employee ID: {user.employeeId}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Created: {user.createdAt}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Last Login: {user.lastLogin}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Organization</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {user.department}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Position: {user.position}
                  </div>
                </div>

                {user.partner && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0 md:col-span-2">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>Partner</span>
                    </div>
                    <div className="text-obus-primary dark:text-white font-medium">
                      {user.partner.name}
                    </div>
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      Code: {user.partner.code}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Side Actions */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
              <div className="space-y-3">
                <Button className="w-full">Edit User</Button>
                <Button variant="outline" className="w-full">
                  Reset Password
                </Button>
                <Button
                  variant={user.status === "active" ? "destructive" : "outline"}
                  className="w-full"
                >
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
