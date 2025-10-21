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
  Calendar,
  MapPin,
  User,
  BarChart3,
} from "lucide-react";

export default function BookingsPage() {
  const bookings = [
    {
      id: "BK-001",
      passenger: "Emmanuel Adebayo",
      route: "Lagos - Abuja",
      bus: "LAG-001-ABJ",
      date: "2024-01-15",
      time: "14:30",
      status: "confirmed",
      seat: "12A",
      amount: "₦25,000",
      agent: "Sarah Johnson",
    },
    {
      id: "BK-002",
      passenger: "Chioma Okwu",
      route: "Abuja - Port Harcourt",
      bus: "ABJ-002-PH",
      date: "2024-01-15",
      time: "16:00",
      status: "pending",
      seat: "8B",
      amount: "₦18,500",
      agent: "Michael Chen",
    },
    {
      id: "BK-003",
      passenger: "Ahmed Hassan",
      route: "Lagos - Kano",
      bus: "LAG-003-KN",
      date: "2024-01-16",
      time: "08:00",
      status: "confirmed",
      seat: "15C",
      amount: "₦35,000",
      agent: "Amara Okafor",
    },
    {
      id: "BK-004",
      passenger: "Grace Effiong",
      route: "Port Harcourt - Abuja",
      bus: "PH-004-ABJ",
      date: "2024-01-15",
      time: "19:30",
      status: "cancelled",
      seat: "3A",
      amount: "₦22,000",
      agent: "David Williams",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Bookings</h1>
            <p className="text-caption mt-2">
              Manage and track all passenger bookings across the network
            </p>
          </div>
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Total Bookings
            </div>
            <div className="text-2xl font-bold text-white">8,945</div>
            <p className="text-xs text-obus-accent mt-1">+23% this month</p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Confirmed
            </div>
            <div className="text-2xl font-bold text-white">7,892</div>
            <p className="text-xs text-obus-accent mt-1">
              88.2% confirmation rate
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Pending
            </div>
            <div className="text-2xl font-bold text-white">847</div>
            <p className="text-xs text-obus-text-light mt-1">
              Awaiting payment
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/20">
            <div className="text-sm font-medium text-obus-text-light mb-2">
              Cancelled
            </div>
            <div className="text-2xl font-bold text-white">206</div>
            <p className="text-xs text-obus-text-light mt-1">
              2.3% cancellation rate
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Bookings
            </h3>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {booking.passenger.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {booking.passenger}
                      </p>
                      <p className="text-xs text-obus-text-light">
                        {booking.id} • {booking.bus}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-obus-text-light" />
                        <p className="text-xs text-obus-text-light">Route</p>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {booking.route}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-obus-text-light" />
                        <p className="text-xs text-obus-text-light">Date</p>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {booking.date}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">Seat</p>
                      <p className="text-sm font-semibold text-white">
                        {booking.seat}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-obus-text-light">Amount</p>
                      <p className="text-sm font-semibold text-white">
                        {booking.amount}
                      </p>
                    </div>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        booking.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : booking.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    >
                      {booking.status.toUpperCase()}
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
                <span className="font-medium">New Booking</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <span className="font-medium">Search Bookings</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-obus-text-light hover:text-white transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Filter className="w-4 h-4" />
                </div>
                <span className="font-medium">Filter Bookings</span>
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

        {/* Booking Status Overview */}
        <div className="p-6 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Booking Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">7,892</div>
              <Badge variant="success" className="mb-2">
                CONFIRMED
              </Badge>
              <p className="text-sm text-obus-text-light">Bookings confirmed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-accent mb-2">
                847
              </div>
              <Badge variant="warning" className="mb-2">
                PENDING
              </Badge>
              <p className="text-sm text-obus-text-light">Awaiting payment</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-obus-text-light mb-2">
                206
              </div>
              <Badge variant="destructive" className="mb-2">
                CANCELLED
              </Badge>
              <p className="text-sm text-obus-text-light">Bookings cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
