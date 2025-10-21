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
  Shield,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@obus.com",
      role: "Administrator",
      status: "active",
      lastLogin: "2 hours ago",
      permissions: ["all"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@obus.com",
      role: "Manager",
      status: "active",
      lastLogin: "1 day ago",
      permissions: ["partners", "agents", "reports"],
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@obus.com",
      role: "Support Staff",
      status: "active",
      lastLogin: "3 days ago",
      permissions: ["bookings", "customers"],
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice.brown@obus.com",
      role: "Manager",
      status: "inactive",
      lastLogin: "2 weeks ago",
      permissions: ["partners", "agents"],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">User Management</h1>
            <p className="text-caption mt-2">
              Manage system users, roles, and permissions
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Users
            </div>
            <div className="text-2xl font-bold text-white">156</div>
            <p className="text-xs text-obus-accent mt-1">+5 this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Active Users
            </div>
            <div className="text-2xl font-bold text-white">142</div>
            <p className="text-xs text-obus-accent mt-1">91% active rate</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Administrators
            </div>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-obus-text-light mt-1">System admins</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Pending Invites
            </div>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-obus-text-light mt-1">
              Awaiting acceptance
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="lg:col-span-2 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Users
            </h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-obus-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-obus-text-light">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">Role</p>
                      <div className="flex items-center gap-1">
                        {user.role === "Administrator" ? (
                          <ShieldCheck className="w-4 h-4 text-obus-accent" />
                        ) : (
                          <Shield className="w-4 h-4 text-obus-text-light" />
                        )}
                        <p className="text-sm font-semibold text-white">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">
                        Permissions
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {user.permissions.length}
                      </p>
                    </div>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                      className={
                        user.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }
                    >
                      {user.status.toUpperCase()}
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
                <span className="font-medium">Add New User</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <span className="font-medium">Search Users</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Filter className="w-4 h-4" />
                </div>
                <span className="font-medium">Filter Users</span>
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

        {/* User Status Overview */}
        <div className="p-6 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            User Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">142</div>
              <Badge variant="success" className="mb-2">
                ACTIVE
              </Badge>
              <p className="text-sm text-obus-text-light">
                Users currently active
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-accent mb-2">3</div>
              <Badge className="mb-2 bg-purple-500/20 text-purple-400">
                ADMINS
              </Badge>
              <p className="text-sm text-obus-text-light">
                System administrators
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-text-light mb-2">
                8
              </div>
              <Badge variant="warning" className="mb-2">
                PENDING
              </Badge>
              <p className="text-sm text-obus-text-light">
                Awaiting activation
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
