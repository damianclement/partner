import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  SystemUserResponseDto,
  CreateAdminUserRequestDto,
  CreatePartnerUserRequestDto,
  UpdateSystemUserRequestDto,
  PageRequest,
  UserStatistics,
} from "../types";
import type { PaginatedResponse, ApiResponse } from "../client";

export const usersService = {
  // Get all system users with pagination
  async getUsers(
    params?: PageRequest
  ): Promise<PaginatedResponse<SystemUserResponseDto>> {
    try {
      console.log("Making API call to:", API_ENDPOINTS.USERS.LIST);
      console.log("With params:", params);

      const response = await apiClient.get<
        PaginatedResponse<SystemUserResponseDto>
      >(
        API_ENDPOINTS.USERS.LIST,
        params
          ? {
              page: params.page?.toString() || "0",
              size: params.size?.toString() || "10",
              sortBy: params.sortBy || "id",
              sortDir: params.sortDir || "asc",
            }
          : undefined
      );
      console.log("Users API Response:", response);
      return response as unknown as PaginatedResponse<SystemUserResponseDto>;
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });

      // Return a default response structure to prevent crashes
      return {
        status: false,
        statusCode: 500,
        message:
          error instanceof Error ? error.message : "Failed to fetch users",
        data: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
      };
    }
  },

  // Get system user by UID
  async getUserByUid(uid: string): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.get<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.GET_BY_UID.replace("{uid}", uid)
    );
    return response.data;
  },

  // Create admin user
  async createAdminUser(
    userData: CreateAdminUserRequestDto
  ): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.post<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.CREATE_ADMIN,
      userData
    );
    return response.data;
  },

  // Create partner user
  async createPartnerUser(
    userData: CreatePartnerUserRequestDto
  ): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.post<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.CREATE_PARTNER,
      userData
    );
    return response.data;
  },

  // Update system user
  async updateUser(
    uid: string,
    userData: UpdateSystemUserRequestDto
  ): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.put<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.UPDATE.replace("{uid}", uid),
      userData
    );
    return response.data;
  },

  // Delete system user
  async deleteUser(uid: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE.replace("{uid}", uid));
  },

  // Get users by type
  async getUsersByType(
    userType: string,
    params?: PageRequest
  ): Promise<SystemUserResponseDto[]> {
    const response = await apiClient.get<SystemUserResponseDto[]>(
      `${API_ENDPOINTS.USERS.SEARCH_BY_TYPE}?userType=${userType}`,
      params
        ? {
            page: params.page?.toString() || "0",
            size: params.size?.toString() || "10",
            sortBy: params.sortBy || "id",
            sortDir: params.sortDir || "asc",
          }
        : undefined
    );
    return response.data;
  },

  // Get users by status
  async getUsersByStatus(
    status: string,
    params?: PageRequest
  ): Promise<SystemUserResponseDto[]> {
    const response = await apiClient.get<SystemUserResponseDto[]>(
      `${API_ENDPOINTS.USERS.SEARCH_BY_STATUS}?status=${status}`,
      params
        ? {
            page: params.page?.toString() || "0",
            size: params.size?.toString() || "10",
            sortBy: params.sortBy || "id",
            sortDir: params.sortDir || "asc",
          }
        : undefined
    );
    return response.data;
  },

  // Get users by department
  async getUsersByDepartment(
    department: string,
    params?: PageRequest
  ): Promise<SystemUserResponseDto[]> {
    const response = await apiClient.get<SystemUserResponseDto[]>(
      `${API_ENDPOINTS.USERS.SEARCH_BY_DEPARTMENT}?department=${department}`,
      params
        ? {
            page: params.page?.toString() || "0",
            size: params.size?.toString() || "10",
            sortBy: params.sortBy || "id",
            sortDir: params.sortDir || "asc",
          }
        : undefined
    );
    return response.data;
  },

  // Get user statistics
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      // Since the API doesn't have a single statistics endpoint, we'll aggregate from multiple calls
      const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        pendingUsers,
        lockedUsers,
        adminUsers,
        partnerUsers,
        partnerAgents,
      ] = await Promise.all([
        this.getUsersCountByType("SYSTEM_USER"),
        this.getUsersCountByStatus("ACTIVE"),
        this.getUsersCountByStatus("INACTIVE"),
        this.getUsersCountByStatus("SUSPENDED"),
        this.getUsersCountByStatus("PENDING_VERIFICATION"),
        this.getUsersCountByStatus("LOCKED"),
        this.getUsersCountByType("SYSTEM_USER"),
        this.getUsersCountByType("PARTNER_USER"),
        this.getUsersCountByType("PARTNER_AGENT"),
      ]);

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        pendingVerificationUsers: pendingUsers,
        lockedUsers,
        adminUsers,
        partnerUsers,
        partnerAgents,
        totalDepartments: 0, // This would need a separate API call
        averageUsersPerDepartment: 0, // This would need calculation
      };
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      // Return default statistics on error
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        suspendedUsers: 0,
        pendingVerificationUsers: 0,
        lockedUsers: 0,
        adminUsers: 0,
        partnerUsers: 0,
        partnerAgents: 0,
        totalDepartments: 0,
        averageUsersPerDepartment: 0,
      };
    }
  },

  // Get users count by type
  async getUsersCountByType(userType: string): Promise<number> {
    try {
      const response = await apiClient.get<number>(
        `${API_ENDPOINTS.USERS.STATS_COUNT_BY_TYPE}?userType=${userType}`
      );
      return response.data || 0;
    } catch (error) {
      console.error(`Error fetching users count by type ${userType}:`, error);
      return 0;
    }
  },

  // Get users count by status
  async getUsersCountByStatus(status: string): Promise<number> {
    try {
      const response = await apiClient.get<number>(
        `${API_ENDPOINTS.USERS.STATS_COUNT_BY_STATUS}?status=${status}`
      );
      return response.data || 0;
    } catch (error) {
      console.error(`Error fetching users count by status ${status}:`, error);
      return 0;
    }
  },

  // Get users count by department
  async getUsersCountByDepartment(department: string): Promise<number> {
    try {
      const response = await apiClient.get<number>(
        `${API_ENDPOINTS.USERS.STATS_COUNT_BY_DEPARTMENT}?department=${department}`
      );
      return response.data || 0;
    } catch (error) {
      console.error(
        `Error fetching users count by department ${department}:`,
        error
      );
      return 0;
    }
  },

  // Verify user phone
  async verifyUserPhone(
    uid: string
  ): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.patch<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.VERIFY_PHONE.replace("{uid}", uid)
    );
    return response.data;
  },

  // Verify user email
  async verifyUserEmail(
    uid: string
  ): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.patch<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.VERIFY_EMAIL.replace("{uid}", uid)
    );
    return response.data;
  },

  // Suspend user
  async suspendUser(uid: string): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.patch<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.SUSPEND.replace("{uid}", uid)
    );
    return response.data;
  },

  // Deactivate user
  async deactivateUser(
    uid: string
  ): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.patch<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.DEACTIVATE.replace("{uid}", uid)
    );
    return response.data;
  },

  // Activate user
  async activateUser(uid: string): Promise<ApiResponse<SystemUserResponseDto>> {
    const response = await apiClient.patch<ApiResponse<SystemUserResponseDto>>(
      API_ENDPOINTS.USERS.ACTIVATE.replace("{uid}", uid)
    );
    return response.data;
  },
};
