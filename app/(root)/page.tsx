"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Plus,
  Users,
  BarChart3,
  Settings,
  Calendar,
  UserCheck,
  Clock,
  Rocket,
} from "lucide-react";
import { useUser } from "@/lib/contexts/UserContext";
import { AuthGuard } from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiKeyManager } from "@/lib/api/client";

export default function Home() {
  const { user, hasRole, isAuthenticated } = useUser();
  const router = useRouter();

  // Check if admin user needs API credentials
  useEffect(() => {
    if (
      isAuthenticated &&
      hasRole("admin") &&
      !apiKeyManager.hasApiCredentials()
    ) {
      router.push("/setup");
    }
  }, [isAuthenticated, hasRole, router]);

  // Show setup page for admin users without API credentials
  if (
    isAuthenticated &&
    hasRole("admin") &&
    !apiKeyManager.hasApiCredentials()
  ) {
    return null; // Will redirect to setup
  }

  // Live time state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Partner Dashboard Component
  const PartnerDashboard = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-obus-accent">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-obus-primary dark:text-white">
                Welcome, {user?.partner?.name || "Partner"}
              </h1>
              <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                Partner Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-obus-text-secondary dark:text-obus-text-light">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: "1,423",
            change: "+0%",
            icon: Users,
            href: "/users",
            color: "blue",
          },
          {
            label: "Total Bookings",
            value: "8,945",
            change: "+0%",
            icon: Calendar,
            href: "/bookings",
            color: "green",
          },
          {
            label: "Total Agents",
            value: "247",
            change: "+0%",
            icon: UserCheck,
            href: "/agents",
            color: "purple",
          },
          {
            label: "Total Super Agents",
            value: "89",
            change: "+0%",
            icon: UserCheck,
            href: "/super-agents",
            color: "blue",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer dark:border-white/20 dark:bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light">
                  {stat.label}
                </div>
                <stat.icon className="h-5 w-5 text-obus-primary dark:text-white" />
              </div>
              <div className="text-2xl font-bold text-obus-primary dark:text-white">
                {stat.value}
              </div>
              <p className="mt-1 text-xs font-medium text-obus-accent">
                {stat.change}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
        <h3 className="mb-4 text-lg font-semibold text-obus-primary dark:text-white">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Users,
              label: "Manage Users",
              href: "/users",
              color: "blue",
            },
            {
              icon: Calendar,
              label: "View Bookings",
              href: "/bookings",
              color: "green",
            },
            {
              icon: UserCheck,
              label: "Manage Agents",
              href: "/agents",
              color: "purple",
            },
            {
              icon: UserCheck,
              label: "Super Agents",
              href: "/super-agents",
              color: "blue",
            },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <button className="group flex w-full items-center gap-3 rounded-lg bg-obus-primary/5 p-4 text-left font-medium text-obus-text-secondary transition-colors hover:bg-obus-primary/10 hover:text-obus-primary dark:bg-white/5 dark:text-obus-text-light dark:hover:bg-white/10 dark:hover:text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-obus-primary transition-colors group-hover:bg-obus-primary group-hover:text-white dark:bg-white/10 dark:text-white dark:group-hover:bg-white/20">
                  <action.icon className="h-5 w-5" />
                </div>
                <span>{action.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  // Admin Dashboard Component (existing content)
  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1">Dashboard Overview</h1>
        <p className="text-caption mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your partners and
          agents.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Partners",
            value: "247",
            change: "+12% from last month",
          },
          {
            label: "Active Agents",
            value: "1,423",
            change: "+8% from last month",
          },
          {
            label: "Total Bookings",
            value: "8,945",
            change: "+23% from last month",
          },
          {
            label: "Revenue",
            value: "TZS 289M",
            change: "+15% from last month",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5"
          >
            <div className="mb-2 text-sm font-medium text-obus-text-secondary dark:text-obus-text-light">
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {stat.value}
            </div>
            <p className="mt-1 text-xs font-medium text-obus-accent">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-obus-primary dark:text-white">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              {
                action: "New partner registered",
                entity: "SafariLink Coaches",
                time: "2 hours ago",
              },
              {
                action: "Agent profile updated",
                entity: "Neema Mwenda",
                time: "4 hours ago",
              },
              {
                action: "Booking completed",
                entity: "Route DAR-001-DDM",
                time: "6 hours ago",
              },
              {
                action: "Payment processed",
                entity: "TSh 2,450,000",
                time: "8 hours ago",
              },
              {
                action: "System maintenance",
                entity: "Database backup",
                time: "12 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-obus-primary/10 pb-3 last:border-b-0 last:pb-0 dark:border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-obus-accent" />
                  <div>
                    <p className="text-sm font-medium text-obus-primary dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                      {activity.entity}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-semibold text-obus-primary dark:text-white">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              {
                icon: Plus,
                label: "Add New Partner",
              },
              {
                icon: Users,
                label: "Manage Agents",
              },
              {
                icon: BarChart3,
                label: "View Reports",
              },
              {
                icon: Settings,
                label: "System Settings",
              },
            ].map((action) => (
              <button
                key={action.label}
                className="group flex w-full items-center gap-3 rounded-lg bg-obus-primary/5 p-3 text-left font-medium text-obus-text-secondary transition-colors hover:bg-obus-primary/10 hover:text-obus-primary dark:bg-white/5 dark:text-obus-text-light dark:hover:bg-white/10 dark:hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-obus-primary transition-colors group-hover:bg-obus-primary group-hover:text-white dark:bg-white/10 dark:text-white dark:group-hover:bg-white/20">
                  <action.icon className="h-4 w-4" />
                </div>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <DashboardLayout>
        {user?.userType === "partner" ? (
          <PartnerDashboard />
        ) : (
          <AdminDashboard />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
