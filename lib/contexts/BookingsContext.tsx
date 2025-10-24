"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "./UserContext";
import { bookingsService } from "@/lib/api/services";
import type {
  AdminBookingDetailDto,
  BookingStatistics,
  BookingFilters,
  BookingStatus,
  BookingSource,
  PaymentStatus,
  PageRequest,
} from "@/lib/api/types";

// Booking interface for UI
export interface Booking {
  uid: string;
  partnerUid: string;
  partnerName: string;
  partnerCode: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  route: {
    name: string;
    fromLocation: string;
    toLocation: string;
  };
  bus: {
    id: number;
    busNumber: string;
    capacity: number;
  };
  departureDate: string;
  departureTime: string;
  arrivalDate?: string;
  arrivalTime?: string;
  seatNumbers: string[];
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  totalAmount: number;
  currency: string;
  notes?: string;
  bookingSource: string;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsContextType {
  // Data
  bookings: Booking[];
  currentBooking: Booking | null;
  stats: BookingStatistics | null;

  // Loading states
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Filters
  filters: BookingFilters;

  // Actions
  loadBookings: (params?: PageRequest & BookingFilters) => Promise<void>;
  loadBookingDetails: (uid: string) => Promise<void>;
  loadBookingStatistics: () => Promise<void>;
  setFilters: (filters: BookingFilters) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  searchBookings: (searchTerm: string) => void;
  clearError: () => void;

  // Statistics calculation
  calculateStatsFromBookings: () => BookingStatistics;
}

const BookingsContext = createContext<BookingsContextType | undefined>(
  undefined
);

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error("useBookings must be used within a BookingsProvider");
  }
  return context;
}

// Transform API response to UI-friendly format
const transformBookingResponse = (response: AdminBookingDetailDto): Booking => {
  return {
    uid: response.uid,
    partnerUid: response.partnerUid,
    partnerName: response.partnerName,
    partnerCode: response.companyCode,
    customer: {
      name:
        response.passengers.length > 0
          ? response.passengers[0].fullName
          : response.agentFullName || "Unknown",
      phone:
        response.passengers.length > 0
          ? response.passengers[0].phoneNumber
          : response.agentUsername,
      email: response.passengers.length > 0 ? response.passengers[0].email : "",
    },
    route: {
      name: response.routeName,
      fromLocation: response.departureStation,
      toLocation: response.arrivalStation,
    },
    bus: {
      id: 0,
      busNumber: response.busNumber,
      capacity: response.busCapacity,
    },
    departureDate: response.departureDate,
    departureTime: response.departureTime.toString(),
    arrivalDate: response.departureDate, // Use departure date as fallback
    arrivalTime: response.arrivalTime?.toString(),
    seatNumbers: response.passengers.map((passenger) => passenger.seatId || ""),
    bookingStatus: response.status,
    paymentStatus: response.paymentStatus,
    paymentMethod: response.paymentMethod,
    totalAmount: response.totalBookingFare,
    currency: response.currency,
    notes: response.notes,
    bookingSource: response.bookingSource,
    promoCode: response.promoCode,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
};

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUser();

  // State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<BookingFilters>({});

  // Load bookings
  const loadBookings = useCallback(
    async (params?: PageRequest & BookingFilters) => {
      if (!isAuthenticated) {
        console.log(
          "BookingsContext - User not authenticated, skipping API call"
        );
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const requestParams = {
          page: currentPage,
          size: pageSize,
          ...filters,
          ...params,
        };

        console.log(
          "BookingsContext - Loading bookings with params:",
          requestParams
        );

        const response = await bookingsService.getBookings(requestParams);

        console.log("BookingsContext - Bookings loaded:", response);

        if (response.data) {
          const transformedBookings = response.data.map(
            (booking: AdminBookingDetailDto) =>
              transformBookingResponse(booking)
          );
          setBookings(transformedBookings);
          setTotalPages(response.totalPages);
          setTotalItems(response.totalElements);
        }
      } catch (err) {
        console.error("BookingsContext - Error loading bookings:", err);
        setError("Failed to load bookings");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, currentPage, pageSize, filters]
  );

  // Load booking details
  const loadBookingDetails = useCallback(
    async (uid: string) => {
      if (!isAuthenticated) {
        console.log(
          "BookingsContext - User not authenticated, skipping API call"
        );
        return;
      }

      try {
        setError(null);
        console.log("BookingsContext - Loading booking details for:", uid);

        const response = await bookingsService.getBookingByUid(uid);

        console.log("BookingsContext - Booking details loaded:", response);

        if (response) {
          setCurrentBooking(transformBookingResponse(response));
        }
      } catch (err) {
        console.error("BookingsContext - Error loading booking details:", err);
        setError("Failed to load booking details");
        setCurrentBooking(null);
      }
    },
    [isAuthenticated]
  );

  // Load booking statistics - removed since endpoint doesn't exist
  const loadBookingStatistics = useCallback(async () => {
    // No-op since the statistics endpoint doesn't exist
    console.log("BookingsContext - Statistics endpoint not available");
  }, []);

  // Search bookings
  const searchBookings = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setCurrentPage(0); // Reset to first page when searching
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calculate statistics from current bookings data
  const calculateStatsFromBookings = useCallback((): BookingStatistics => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.bookingStatus === "CONFIRMED"
    ).length;
    const pendingBookings = bookings.filter(
      (b) => b.bookingStatus === "PENDING"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.bookingStatus === "CANCELLED"
    ).length;
    const completedBookings = bookings.filter(
      (b) => b.bookingStatus === "COMPLETED"
    ).length;

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );
    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Count by status
    const bookingsByStatus = bookings.reduce((acc, booking) => {
      acc[booking.bookingStatus] = (acc[booking.bookingStatus] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>);

    // Count by source
    const bookingsBySource = bookings.reduce((acc, booking) => {
      acc[booking.bookingSource as BookingSource] =
        (acc[booking.bookingSource as BookingSource] || 0) + 1;
      return acc;
    }, {} as Record<BookingSource, number>);

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      completedBookings,
      totalRevenue,
      currency: bookings.length > 0 ? bookings[0].currency : "TZS",
      bookingsByStatus,
      bookingsBySource,
      averageBookingValue,
    };
  }, [bookings]);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      console.log("BookingsContext - Loading initial data");
      loadBookings({ page: 0, size: 20 });
    }
  }, [isAuthenticated]); // Run when authentication status changes

  // Reload data when filters or pagination change
  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated, loadBookings]);

  const value: BookingsContextType = {
    // Data
    bookings,
    currentBooking,
    stats,

    // Loading states
    isLoading,
    isStatsLoading,
    error,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    totalItems,

    // Filters
    filters,

    // Actions
    loadBookings,
    loadBookingDetails,
    loadBookingStatistics,
    setFilters,
    setCurrentPage,
    setPageSize,
    searchBookings,
    clearError,

    // Statistics calculation
    calculateStatsFromBookings,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}
