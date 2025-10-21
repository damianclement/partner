import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, BarChart3, Settings } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-h1">Dashboard Overview</h1>
          <p className="text-caption mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your partners
            and agents.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Partners
            </div>
            <div className="text-2xl font-bold text-white">247</div>
            <p className="text-xs text-obus-accent mt-1">
              +12% from last month
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Active Agents
            </div>
            <div className="text-2xl font-bold text-white">1,423</div>
            <p className="text-xs text-obus-accent mt-1">+8% from last month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Bookings
            </div>
            <div className="text-2xl font-bold text-white">8,945</div>
            <p className="text-xs text-obus-accent mt-1">
              +23% from last month
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Revenue
            </div>
            <div className="text-2xl font-bold text-white">$124.5K</div>
            <p className="text-xs text-obus-accent mt-1">
              +15% from last month
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  action: "New partner registered",
                  entity: "ABC Transport Co.",
                  time: "2 hours ago",
                  status: "success",
                },
                {
                  action: "Agent profile updated",
                  entity: "Sarah Johnson",
                  time: "4 hours ago",
                  status: "info",
                },
                {
                  action: "Booking completed",
                  entity: "Route #1234",
                  time: "6 hours ago",
                  status: "success",
                },
                {
                  action: "Payment processed",
                  entity: "$2,450.00",
                  time: "8 hours ago",
                  status: "success",
                },
                {
                  action: "System maintenance",
                  entity: "Database backup",
                  time: "12 hours ago",
                  status: "warning",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-obus-accent"></div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-obus-text-light">
                        {activity.entity}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-obus-text-light">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-obus-accent/10 hover:bg-obus-accent/20 text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-obus-accent/20 flex items-center justify-center group-hover:bg-obus-accent/30 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-medium">Add New Partner</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium">Manage Agents</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="font-medium">View Reports</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="font-medium">System Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Status Overview */}
      <div className="p-6 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Partner Status Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">189</div>
            <Badge variant="success" className="mb-2">
              ACTIVE
            </Badge>
            <p className="text-sm text-obus-text-light">
              Partners currently active
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-obus-accent mb-2">23</div>
            <Badge variant="warning" className="mb-2">
              PENDING
            </Badge>
            <p className="text-sm text-obus-text-light">Awaiting approval</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-obus-text-light mb-2">
              35
            </div>
            <Badge variant="destructive" className="mb-2">
              SUSPENDED
            </Badge>
            <p className="text-sm text-obus-text-light">
              Temporarily suspended
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
