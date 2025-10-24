/**
 * Bookings API Service
 * Handles all booking-related API calls
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  AdminBookingDetailDto,
  BookingStatistics,
  BookingFilters,
  PageRequest,
} from "../types";

// Define missing types locally
export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export const bookingsService = {
  // Get all bookings with pagination
  async getBookings(
    params: PageRequest & BookingFilters = {}
  ): Promise<PaginatedResponse<AdminBookingDetailDto>> {
    try {
      console.log("Making API call to:", API_ENDPOINTS.BOOKINGS.LIST);
      console.log("Bookings API Parameters:", params);

      const queryParams = {
        page: params.page?.toString() || "0",
        size: params.size?.toString() || "20",
        sortBy: params.sortBy || "createdAt",
        sortDir: params.sortDir || "desc",
        ...(params.status && { status: params.status }),
        ...(params.paymentStatus && { paymentStatus: params.paymentStatus }),
        ...(params.partnerUid && { partnerUid: params.partnerUid }),
        ...(params.dateFrom && { dateFrom: params.dateFrom }),
        ...(params.dateTo && { dateTo: params.dateTo }),
        ...(params.search && { search: params.search }),
      };

      const response = await apiClient.get<any>(
        API_ENDPOINTS.BOOKINGS.LIST,
        queryParams
      );

      console.log("Bookings API Response:", response);

      // Transform the response to match our expected format
      return {
        data: response.data || [],
        pageNumber: response.data.pageNumber || 0,
        pageSize: response.data.pageSize || 20,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        last: response.data.last || true,
      };
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Return empty paginated response on error
      return {
        data: [],
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
        last: true,
      };
    }
  },

  // Get booking by UID
  async getBookingByUid(uid: string): Promise<AdminBookingDetailDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BOOKINGS.GET_BY_UID.replace("{uid}", uid)
      );

      const response = await apiClient.get<any>(
        API_ENDPOINTS.BOOKINGS.GET_BY_UID.replace("{uid}", uid)
      );

      console.log("Booking Detail API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return null;
    }
  },
};
