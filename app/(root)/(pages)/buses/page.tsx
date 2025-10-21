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
  MapPin,
  Clock,
  BarChart3,
} from "lucide-react";

export default function BusesPage() {
  const buses = [
    {
      id: 1,
      registration: "LAG-001-ABJ",
      route: "Lagos - Abuja",
      operator: "ABC Transport Co.",
      status: "active",
      capacity: 50,
      currentLocation: "Lagos Terminal",
      nextDeparture: "14:30",
    },
    {
      id: 2,
      registration: "ABJ-002-PH",
      route: "Abuja - Port Harcourt",
      operator: "City Express",
      status: "active",
      capacity: 45,
      currentLocation: "Abuja Terminal",
      nextDeparture: "16:00",
    },
    {
      id: 3,
      registration: "LAG-003-KN",
      route: "Lagos - Kano",
      operator: "Metro Transit",
      status: "maintenance",
      capacity: 60,
      currentLocation: "Lagos Depot",
      nextDeparture: "Tomorrow 08:00",
    },
    {
      id: 4,
      registration: "PH-004-ABJ",
      route: "Port Harcourt - Abuja",
      operator: "Highway Kings",
      status: "inactive",
      capacity: 40,
      currentLocation: "Port Harcourt Terminal",
      nextDeparture: "Maintenance",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Bus Systems</h1>
            <p className="text-caption mt-2">
              Monitor and manage all bus fleets across the network
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Bus
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Buses
            </div>
            <div className="text-2xl font-bold text-white">847</div>
            <p className="text-xs text-obus-accent mt-1">+23 this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Active Buses
            </div>
            <div className="text-2xl font-bold text-white">782</div>
            <p className="text-xs text-obus-accent mt-1">92.3% operational</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              In Maintenance
            </div>
            <div className="text-2xl font-bold text-white">45</div>
            <p className="text-xs text-obus-text-light mt-1">
              Scheduled maintenance
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Routes
            </div>
            <div className="text-2xl font-bold text-white">156</div>
            <p className="text-xs text-obus-accent mt-1">+8 new routes</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Buses */}
          <div className="lg:col-span-2 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Buses
            </h3>
            <div className="space-y-4">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {bus.registration.substring(0, 3)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {bus.registration}
                      </p>
                      <p className="text-xs text-obus-text-light">
                        {bus.route} • {bus.operator}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">Capacity</p>
                      <p className="text-sm font-semibold text-white">
                        {bus.capacity}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-obus-text-light" />
                        <p className="text-xs text-obus-text-light">Location</p>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {bus.currentLocation}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-obus-text-light" />
                        <p className="text-xs text-obus-text-light">Next</p>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {bus.nextDeparture}
                      </p>
                    </div>
                    <Badge
                      variant={
                        bus.status === "active"
                          ? "default"
                          : bus.status === "maintenance"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        bus.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : bus.status === "maintenance"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }
                    >
                      {bus.status.toUpperCase()}
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
                <span className="font-medium">Add New Bus</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <span className="font-medium">Search Buses</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Filter className="w-4 h-4" />
                </div>
                <span className="font-medium">Filter Buses</span>
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

        {/* Bus Status Overview */}
        <div className="p-6 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Bus Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">782</div>
              <Badge variant="success" className="mb-2">
                ACTIVE
              </Badge>
              <p className="text-sm text-obus-text-light">
                Buses currently operational
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-accent mb-2">45</div>
              <Badge variant="warning" className="mb-2">
                MAINTENANCE
              </Badge>
              <p className="text-sm text-obus-text-light">Under maintenance</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-text-light mb-2">
                20
              </div>
              <Badge variant="outline" className="mb-2">
                INACTIVE
              </Badge>
              <p className="text-sm text-obus-text-light">
                Temporarily out of service
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
