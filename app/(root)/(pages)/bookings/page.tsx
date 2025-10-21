"use client";

import * as React from "react";
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
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
// Simple table implementation without external dependencies
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Booking = {
  id: string;
  passenger: string;
  route: string;
  bus: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  seat: string;
  amount: string;
  agent: string;
};

export default function BookingsPage() {
  const bookings: Booking[] = [
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

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedBookings, setSelectedBookings] = React.useState<string[]>([]);
  const [selectAll, setSelectAll] = React.useState(false);

  // Filter bookings based on search input
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.passenger.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.id.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.route.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.bus.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle individual booking selection
  const handleBookingSelect = (bookingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings((prev) => [...prev, bookingId]);
    } else {
      setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedBookings(filteredBookings.map((booking) => booking.id));
    } else {
      setSelectedBookings([]);
    }
  };

  // Check if all filtered bookings are selected
  const isAllSelected =
    filteredBookings.length > 0 &&
    selectedBookings.length === filteredBookings.length;
  const isIndeterminate =
    selectedBookings.length > 0 &&
    selectedBookings.length < filteredBookings.length;

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

        {/* Bookings Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">All Bookings</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter bookings..."
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="max-w-sm bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="rounded-md border border-white/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-obus-text-light w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-obus-text-light">
                    Passenger
                  </TableHead>
                  <TableHead className="text-obus-text-light">Route</TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Seat
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Amount
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Agent
                  </TableHead>
                  <TableHead className="text-obus-text-light text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length ? (
                  filteredBookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="border-white/10 hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={(checked) =>
                            handleBookingSelect(booking.id, !!checked)
                          }
                          aria-label={`Select ${booking.passenger}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {booking.passenger.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {booking.passenger}
                            </p>
                            <p className="text-xs text-obus-text-light">
                              {booking.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-obus-text-light" />
                          <div>
                            <p className="font-medium text-white">
                              {booking.route}
                            </p>
                            <p className="text-xs text-obus-text-light">
                              {booking.bus}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4 text-obus-text-light" />
                          <div>
                            <p className="font-semibold text-white">
                              {booking.date}
                            </p>
                            <p className="text-xs text-obus-text-light">
                              {booking.time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {booking.seat}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {booking.amount}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-white">
                          {booking.agent}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
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
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-obus-primary border-white/20 text-white"
                          >
                            <DropdownMenuCheckboxItem className="text-white">
                              View details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-white">
                              Edit booking
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-obus-text-light"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-light">
              {selectedBookings.length > 0
                ? `${selectedBookings.length} of ${filteredBookings.length} bookings selected`
                : `Showing ${filteredBookings.length} of ${bookings.length} bookings`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
