import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  BusCoreSystemResponseDto,
  CreateBusCoreSystemRequestDto,
  UpdateBusCoreSystemRequestDto,
  BusCoreSystemFilters,
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

export const busCoreSystemsService = {
  // Get all bus core systems
  async getBusCoreSystems(
    params: PageRequest & BusCoreSystemFilters = {}
  ): Promise<PaginatedResponse<BusCoreSystemResponseDto>> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.LIST,
        params
      );

      const queryParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );

      const response = await apiClient.get<any>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.LIST,
        queryParams
      );

      console.log("Bus Core Systems API Response:", response);

      // The API response structure has data as an array directly
      // Transform the response to match our expected format
      const responseData = response.data || response;
      const systemsArray = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];

      return {
        data: systemsArray,
        pageNumber: 0,
        pageSize: systemsArray.length,
        totalElements: systemsArray.length,
        totalPages: 1,
        last: true,
      };
    } catch (error) {
      console.error("Error fetching bus core systems:", error);
      // Return empty paginated response on error
      return {
        data: [],
        pageNumber: params.page || 0,
        pageSize: params.size || 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
      };
    }
  },

  // Get bus core system by ID
  async getBusCoreSystemById(
    id: number
  ): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_ID.replace("{id}", String(id))
      );

      const response = await apiClient.get<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_ID.replace("{id}", String(id))
      );

      console.log("Bus Core System Detail API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching bus core system details:", error);
      return null;
    }
  },

  // Get bus core system by UID
  async getBusCoreSystemByUid(
    uid: string
  ): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_UID.replace("{uid}", uid)
      );

      const response = await apiClient.get<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_UID.replace("{uid}", uid)
      );

      console.log("Bus Core System Detail API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching bus core system details:", error);
      return null;
    }
  },

  // Get bus core system by name
  async getBusCoreSystemByName(
    name: string
  ): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_NAME.replace("{name}", name)
      );

      const response = await apiClient.get<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_NAME.replace("{name}", name)
      );

      console.log("Bus Core System Detail API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching bus core system details:", error);
      return null;
    }
  },

  // Get bus core system by code
  async getBusCoreSystemByCode(
    code: string
  ): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_CODE.replace("{code}", code)
      );

      const response = await apiClient.get<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_BY_CODE.replace("{code}", code)
      );

      console.log("Bus Core System Detail API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching bus core system details:", error);
      return null;
    }
  },

  // Get default bus core system
  async getDefaultBusCoreSystem(): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_DEFAULT
      );

      const response = await apiClient.get<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.GET_DEFAULT
      );

      console.log("Default Bus Core System API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching default bus core system:", error);
      return null;
    }
  },

  // Create bus core system
  async createBusCoreSystem(
    data: CreateBusCoreSystemRequestDto
  ): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.CREATE,
        data
      );

      const response = await apiClient.post<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.CREATE,
        data
      );

      console.log("Create Bus Core System API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error creating bus core system:", error);
      return null;
    }
  },

  // Update bus core system
  async updateBusCoreSystem(
    uid: string,
    data: UpdateBusCoreSystemRequestDto
  ): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.UPDATE.replace("{uid}", uid),
        data
      );

      const response = await apiClient.put<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.UPDATE.replace("{uid}", uid),
        data
      );

      console.log("Update Bus Core System API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error updating bus core system:", error);
      return null;
    }
  },

  // Delete bus core system
  async deleteBusCoreSystem(uid: string): Promise<boolean> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.DELETE.replace("{uid}", uid)
      );

      await apiClient.delete(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.DELETE.replace("{uid}", uid)
      );

      console.log("Delete Bus Core System API Response: Success");
      return true;
    } catch (error) {
      console.error("Error deleting bus core system:", error);
      return false;
    }
  },

  // Set default bus core system
  async setDefaultBusCoreSystem(
    uid: string
  ): Promise<BusCoreSystemResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.BUS_CORE_SYSTEMS.SET_DEFAULT.replace("{uid}", uid)
      );

      const response = await apiClient.put<BusCoreSystemResponseDto>(
        API_ENDPOINTS.BUS_CORE_SYSTEMS.SET_DEFAULT.replace("{uid}", uid)
      );

      console.log("Set Default Bus Core System API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error setting default bus core system:", error);
      return null;
    }
  },
};
