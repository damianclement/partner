import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Users, BarChart3, Settings } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
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
              value: "$124.5K",
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
                  entity: "ABC Transport Co.",
                  time: "2 hours ago",
                },
                {
                  action: "Agent profile updated",
                  entity: "Sarah Johnson",
                  time: "4 hours ago",
                },
                {
                  action: "Booking completed",
                  entity: "Route #1234",
                  time: "6 hours ago",
                },
                {
                  action: "Payment processed",
                  entity: "$2,450.00",
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
    </DashboardLayout>
  );
}
