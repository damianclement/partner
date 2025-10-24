"use client";

import * as React from "react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  CreditCard,
  Clock,
} from "lucide-react";

type Booking = {
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

// Demo data source (replace with API in real app)
const BOOKINGS: Booking[] = [
  {
    id: "BK-001",
    externalBookingId: "EXT-BK-001",
    customer: { name: "Amina Mwakyusa", phone: "+255-752-123-456" },
    route: { name: "Dar es Salaam - Dodoma", busNumber: "DAR-001-DDM" },
    departure: { date: "2024-01-15", time: "14:30" },
    seatNumbers: "12A",
    bookingStatus: "confirmed",
    paymentStatus: "paid",
    amount: { total: "45,000", currency: "TZS" },
  },
  {
    id: "BK-002",
    externalBookingId: "EXT-BK-002",
    customer: { name: "Neema Komba", phone: "+255-713-987-654" },
    route: { name: "Dodoma - Mwanza", busNumber: "DDM-002-MWZ" },
    departure: { date: "2024-01-15", time: "16:00" },
    seatNumbers: "8B",
    bookingStatus: "pending",
    paymentStatus: "pending",
    amount: { total: "38,500", currency: "TZS" },
  },
  {
    id: "BK-003",
    externalBookingId: "EXT-BK-003",
    customer: { name: "Hassan Jafari", phone: "+255-768-234-567" },
    route: { name: "Dar es Salaam - Arusha", busNumber: "DAR-003-ARU" },
    departure: { date: "2024-01-16", time: "08:00" },
    seatNumbers: "15C",
    bookingStatus: "completed",
    paymentStatus: "paid",
    amount: { total: "65,000", currency: "TZS" },
  },
  {
    id: "BK-004",
    externalBookingId: "EXT-BK-004",
    customer: { name: "Grace Mushi", phone: "+255-789-345-678" },
    route: { name: "Mwanza - Arusha", busNumber: "MWZ-004-ARU" },
    departure: { date: "2024-01-16", time: "10:15" },
    seatNumbers: "4D",
    bookingStatus: "cancelled",
    paymentStatus: "refunded",
    amount: { total: "42,000", currency: "TZS" },
  },
];

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params?.id;

  const booking = useMemo(
    () => BOOKINGS.find((b) => b.id === bookingId),
    [bookingId]
  );

  // Function to extract seat identifier from full seat code
  const extractSeatIdentifier = (seatCode: string): string => {
    // Extract the last part after the last dash (e.g., "L-0-0-A1" -> "A1")
    const parts = seatCode.split("-");
    return parts[parts.length - 1];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">Booking Details</h1>
            <p className="text-caption mt-2">
              Full booking information and status
            </p>
          </div>
          <Link href="/bookings">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
            </Button>
          </Link>
        </div>

        {!booking ? (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            Booking not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Summary Card */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Booking #
                  </div>
                  <div className="text-2xl font-bold text-obus-primary dark:text-white">
                    {booking.externalBookingId}
                  </div>
                  <div className="mt-2 text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Internal ID: {booking.id}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      booking.bookingStatus === "confirmed" ||
                      booking.bookingStatus === "completed"
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
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <User className="w-4 h-4" />
                    <span>Customer</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {booking.customer.name}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    {booking.customer.phone}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Route</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {booking.route.name}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Bus: {booking.route.busNumber}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Departure</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    {booking.departure.date}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    {booking.departure.time}
                  </div>
                </div>

                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Amount</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium">
                    TSh {booking.amount.total}
                  </div>
                  <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                    Seat: {extractSeatIdentifier(booking.seatNumbers)}
                  </div>
                </div>
              </div>
            </div>

            {/* Side Actions */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
              <div className="space-y-3">
                <Button className="w-full">Edit Booking</Button>
                <Button variant="outline" className="w-full">
                  Resend Confirmation
                </Button>
                <Button variant="destructive" className="w-full">
                  Cancel Booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
