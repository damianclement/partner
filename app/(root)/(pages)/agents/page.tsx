import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  BarChart3,
} from "lucide-react";

export default function AgentsPage() {
  const agents = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@abctransport.com",
      partner: "ABC Transport Co.",
      status: "active",
      role: "Senior Agent",
      bookings: 145,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@cityexpress.com",
      partner: "City Express",
      status: "active",
      role: "Agent",
      bookings: 98,
      rating: 4.6,
    },
    {
      id: 3,
      name: "Amara Okafor",
      email: "amara.okafor@metrotransit.com",
      partner: "Metro Transit",
      status: "pending",
      role: "Junior Agent",
      bookings: 0,
      rating: 0,
    },
    {
      id: 4,
      name: "David Williams",
      email: "d.williams@highwaykings.com",
      partner: "Highway Kings",
      status: "suspended",
      role: "Senior Agent",
      bookings: 234,
      rating: 3.2,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Agent Management</h1>
            <p className="text-caption mt-2">
              Manage and monitor all agents across your partner network
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Agent
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Agents
            </div>
            <div className="text-2xl font-bold text-white">1,423</div>
            <p className="text-xs text-obus-accent mt-1">+8% this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Active Agents
            </div>
            <div className="text-2xl font-bold text-white">1,289</div>
            <p className="text-xs text-obus-accent mt-1">90.5% active rate</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Pending Approval
            </div>
            <div className="text-2xl font-bold text-white">87</div>
            <p className="text-xs text-obus-text-light mt-1">
              Awaiting verification
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Avg. Rating
            </div>
            <div className="text-2xl font-bold text-white">4.6</div>
            <p className="text-xs text-obus-accent mt-1">+0.2 this month</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Agents */}
          <div className="lg:col-span-2 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Agents
            </h3>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-obus-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {agent.name}
                      </p>
                      <p className="text-xs text-obus-text-light">
                        {agent.partner}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">Role</p>
                      <p className="text-sm font-semibold text-white">
                        {agent.role}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">Bookings</p>
                      <p className="text-sm font-semibold text-white">
                        {agent.bookings}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">Rating</p>
                      <p className="text-sm font-semibold text-white">
                        {agent.rating > 0 ? agent.rating : "N/A"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        agent.status === "active"
                          ? "default"
                          : agent.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        agent.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : agent.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    >
                      {agent.status.toUpperCase()}
                    </Badge>
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
                <span className="font-medium">Add New Agent</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <span className="font-medium">Search Agents</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Filter className="w-4 h-4" />
                </div>
                <span className="font-medium">Filter Agents</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="font-medium">View Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* Agent Status Overview */}
        <div className="p-6 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Agent Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1,289</div>
              <Badge variant="success" className="mb-2">
                ACTIVE
              </Badge>
              <p className="text-sm text-obus-text-light">
                Agents currently active
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-accent mb-2">87</div>
              <Badge variant="warning" className="mb-2">
                PENDING
              </Badge>
              <p className="text-sm text-obus-text-light">Awaiting approval</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-text-light mb-2">
                47
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
      </div>
    </DashboardLayout>
  );
}
