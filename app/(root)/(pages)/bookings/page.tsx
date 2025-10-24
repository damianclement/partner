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
import { useBookings, type Booking } from "@/lib/contexts/BookingsContext";

export default function BookingsPage() {
  const {
    bookings,
    stats,
    isLoading,
    isStatsLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    searchBookings,
    setCurrentPage,
    setPageSize,
    calculateStatsFromBookings,
  } = useBookings();

  // Calculate statistics from current bookings data
  const calculatedStats = React.useMemo(() => {
    return calculateStatsFromBookings();
  }, [calculateStatsFromBookings]);

  // Simple state management for filtering and selection
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedBookings, setSelectedBookings] = React.useState<string[]>([]);
  // Filter bookings based on search input
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.uid.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.customer.phone
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      booking.route.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      booking.bus.busNumber.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setFilterValue(value);
    searchBookings(value);
  };

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
      setSelectedBookings(filteredBookings.map((booking) => booking.uid));
    } else {
      setSelectedBookings([]);
    }
  };

  // Check if all filtered bookings are selected
  const isAllSelected =
    filteredBookings.length > 0 &&
    selectedBookings.length === filteredBookings.length;

  // Function to extract seat identifier from full seat code
  const extractSeatIdentifier = (seatCode: string): string => {
    // Extract the last part after the last dash (e.g., "L-0-0-A1" -> "A1")
    const parts = seatCode.split("-");
    return parts[parts.length - 1];
  };

  // Function to format seat numbers for display
  const formatSeatNumbers = (seatNumbers: string[]): string => {
    return seatNumbers.map((seat) => extractSeatIdentifier(seat)).join(", ");
  };
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Bookings
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.totalBookings}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {totalItems > 0
                ? `${totalItems} total in system`
                : "No bookings available"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Confirmed
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.confirmedBookings}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              {calculatedStats.totalBookings > 0
                ? `${(
                    (calculatedStats.confirmedBookings /
                      calculatedStats.totalBookings) *
                    100
                  ).toFixed(1)}% confirmation rate`
                : "0% confirmation rate"}
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Pending
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading ? "..." : calculatedStats.pendingBookings}
            </div>
            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
              {calculatedStats.totalBookings > 0
                ? `${(
                    (calculatedStats.pendingBookings /
                      calculatedStats.totalBookings) *
                    100
                  ).toFixed(1)}% pending rate`
                : "No pending bookings"}
            </p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading
                ? "..."
                : `${
                    calculatedStats.currency
                  } ${calculatedStats.totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-obus-accent mt-1">
              From current page bookings
            </p>
          </div>

          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <div className="text-sm font-medium text-obus-text-secondary dark:text-obus-text-light mb-2">
              Average Value
            </div>
            <div className="text-2xl font-bold text-obus-primary dark:text-white">
              {isLoading
                ? "..."
                : `${
                    calculatedStats.currency
                  } ${calculatedStats.averageBookingValue.toLocaleString()}`}
            </div>
            <p className="text-xs text-obus-accent mt-1">Per booking</p>
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
                onChange={(event) => handleSearchChange(event.target.value)}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-obus-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-obus-text-secondary dark:text-obus-text-light">
                          Loading bookings...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length ? (
                  filteredBookings.map((booking) => (
                    <TableRow
                      key={booking.uid}
                      className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.uid)}
                          onCheckedChange={(checked) =>
                            handleBookingSelect(booking.uid, !!checked)
                          }
                          aria-label={`Select ${booking.customer.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm font-semibold text-obus-primary dark:text-white">
                          {booking.uid}
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
                              {booking.bus.busNumber}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4 text-obus-text-secondary dark:text-obus-text-light" />
                          <div>
                            <p className="font-semibold text-obus-primary dark:text-white">
                              {booking.departureDate}
                            </p>
                            <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                              {booking.departureTime}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          {formatSeatNumbers(booking.seatNumbers)}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            booking.bookingStatus === "CONFIRMED"
                              ? "default"
                              : booking.bookingStatus === "COMPLETED"
                              ? "default"
                              : booking.bookingStatus === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            booking.bookingStatus === "CONFIRMED"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : booking.bookingStatus === "COMPLETED"
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                              : booking.bookingStatus === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                          }
                        >
                          {booking.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            booking.paymentStatus === "PAID"
                              ? "default"
                              : booking.paymentStatus === "PENDING"
                              ? "secondary"
                              : booking.paymentStatus === "FAILED"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            booking.paymentStatus === "PAID"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : booking.paymentStatus === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                              : booking.paymentStatus === "FAILED"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-semibold text-obus-primary dark:text-white">
                          {booking.currency}{" "}
                          {booking.totalAmount.toLocaleString()}
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
                            <Link href={`/bookings/${booking.uid}`}>
                              <DropdownMenuCheckboxItem className="text-obus-text-primary dark:text-white cursor-pointer">
                                View Details
                              </DropdownMenuCheckboxItem>
                            </Link>
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
                      {filterValue
                        ? "No bookings found matching your search."
                        : "No bookings available."}
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
                : `Showing ${filteredBookings.length} of ${totalItems} bookings`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
