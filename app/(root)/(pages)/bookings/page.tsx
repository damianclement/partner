"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, MapPin } from "lucide-react";
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
import Link from "next/link";

export type Booking = {
  id: string;
  externalBookingId: string;
  customer: {
    name: string;
    phone: string;
  };
  route: {
    name: string;
    busNumber: string;
  };
  departure: {
    date: string;
    time: string;
  };
  seatNumbers: string;
  bookingStatus: "confirmed" | "pending" | "cancelled" | "completed";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  amount: {
    total: string;
    currency: string;
  };
};

export default function BookingsPage() {
  const bookings: Booking[] = [
    {
      id: "BK-001",
      externalBookingId: "EXT-BK-001",
      customer: {
        name: "Amina Mwakyusa",
        phone: "+255-752-123-456",
      },
      route: {
        name: "Dar es Salaam - Dodoma",
        busNumber: "DAR-001-DDM",
      },
      departure: {
        date: "2024-01-15",
        time: "14:30",
      },
      seatNumbers: "12A",
      bookingStatus: "confirmed",
      paymentStatus: "paid",
      amount: {
        total: "45,000",
        currency: "TZS",
      },
    },
    {
      id: "BK-002",
      externalBookingId: "EXT-BK-002",
      customer: {
        name: "Neema Komba",
        phone: "+255-713-987-654",
      },
      route: {
        name: "Dodoma - Mwanza",
        busNumber: "DDM-002-MWZ",
      },
      departure: {
        date: "2024-01-15",
        time: "16:00",
      },
      seatNumbers: "8B",
      bookingStatus: "pending",
      paymentStatus: "pending",
      amount: {
        total: "38,500",
        currency: "TZS",
      },
    },
    {
      id: "BK-003",
      externalBookingId: "EXT-BK-003",
      customer: {
        name: "Hassan Jafari",
        phone: "+255-768-234-567",
      },
      route: {
        name: "Dar es Salaam - Arusha",
        busNumber: "DAR-003-ARU",
      },
      departure: {
        date: "2024-01-16",
        time: "08:00",
      },
      seatNumbers: "15C",
      bookingStatus: "completed",
      paymentStatus: "paid",
      amount: {
        total: "65,000",
        currency: "TZS",
      },
    },
    {
      id: "BK-004",
      externalBookingId: "EXT-BK-004",
      customer: {
        name: "Grace Mushi",
        phone: "+255-789-345-678",
      },
      route: {
        name: "Mwanza - Arusha",
        busNumber: "MWZ-004-ARU",
      },
      departure: {
        date: "2024-01-16",
        time: "10:15",
      },
      seatNumbers: "4D",
      bookingStatus: "cancelled",
      paymentStatus: "refunded",
      amount: {
        total: "42,000",
        currency: "TZS",
      },
    },
  ];

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedBookings, setSelectedBookings] = React.useState<string[]>([]);
  // Filter bookings based on search input
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.externalBookingId
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.customer.phone
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      booking.route.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.route.busNumber.toLowerCase().includes(filterValue.toLowerCase())
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Bookings
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              8,945
            </div>
            <p className="text-xs text-obus-accent mt-1">+23% this month</p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Confirmed
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              7,892
            </div>
            <p className="text-xs text-obus-accent mt-1">
              88.2% confirmation rate
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Pending
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              847
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              Awaiting payment
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Cancelled
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              206
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              2.3% cancellation rate
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
              All Bookings
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter bookings..."
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          <div className="rounded-md border border-obus-primary/10 bg-white overflow-hidden shadow-sm transition-colors dark:border-white/20 dark:bg-white/5 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-obus-primary/20 hover:scrollbar-thumb-obus-primary/30 dark:scrollbar-thumb-white/20 dark:hover:scrollbar-thumb-white/30">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-obus-primary/10 dark:border-white/20">
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Booking #
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Customer
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Route
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Seat
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Payment
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light text-center">
                    Amount
                  </TableHead>
                  <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length ? (
                  filteredBookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={(checked) =>
                            handleBookingSelect(booking.id, !!checked)
                          }
                          aria-label={`Select ${booking.customer.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm font-semibold text-obus-primary dark:text-white">
                          {booking.externalBookingId}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {booking.customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {booking.customer.name}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {booking.customer.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {booking.route.name}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {booking.route.busNumber}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <div>
                            <p className="font-semibold text-obus-primary dark:text-white">
                              {booking.departure.date}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {booking.departure.time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          {booking.seatNumbers}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            booking.bookingStatus === "confirmed"
                              ? "default"
                              : booking.bookingStatus === "completed"
                              ? "default"
                              : booking.bookingStatus === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            booking.bookingStatus === "confirmed"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : booking.bookingStatus === "completed"
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                              : booking.bookingStatus === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                          }
                        >
                          {booking.bookingStatus.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            booking.paymentStatus === "paid"
                              ? "default"
                              : booking.paymentStatus === "pending"
                              ? "secondary"
                              : booking.paymentStatus === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            booking.paymentStatus === "paid"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : booking.paymentStatus === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : booking.paymentStatus === "failed"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {booking.paymentStatus.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          TSh {booking.amount.total}
                        </p>
                        <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                          {booking.amount.currency}
                        </p>
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
                            className="border border-obus-primary/10 bg-white text-obus-text-primary dark:border-white/20 dark:bg-obus-primary dark:text-white"
                          >
                            <Link href={`/bookings/${booking.id}`}>
                              <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white cursor-pointer">
                                View Details
                              </DropdownMenuCheckboxItem>
                            </Link>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Edit Booking
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white">
                              Cancel Booking
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-obus-text-secondary dark:text-obus-text-light"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
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
