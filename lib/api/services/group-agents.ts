import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  GroupAgentResponseDto,
  CreateGroupAgentRequestDto,
  UpdateGroupAgentRequestDto,
  GroupAgentSearchRequestDto,
  GroupAgentFilters,
  GroupAgentStatsDto,
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

export const groupAgentsService = {
  // Get all group agents
  async getGroupAgents(
    params: PageRequest & GroupAgentFilters = {}
  ): Promise<PaginatedResponse<GroupAgentResponseDto>> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.LIST,
        params
      );

      const queryParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );

      const response = await apiClient.get<any>(
        API_ENDPOINTS.GROUP_AGENTS.LIST,
        queryParams
      );

      console.log("Group Agents API Response:", response);

      // The API response structure has data as an array directly
      // Transform the response to match our expected format
      const responseData = response.data || response;
      const groupAgentsArray = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];

      return {
        data: groupAgentsArray,
        pageNumber: responseData.pageNumber || 0,
        pageSize: responseData.pageSize || 20,
        totalElements: responseData.totalElements || groupAgentsArray.length,
        totalPages: responseData.totalPages || 1,
        last: responseData.last || true,
      };
    } catch (error) {
      console.error("Error fetching group agents:", error);
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

  // Get group agent by UID
  async getGroupAgentByUid(uid: string): Promise<GroupAgentResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.GET_BY_UID.replace("{uid}", uid)
      );

      const response = await apiClient.get<GroupAgentResponseDto>(
        API_ENDPOINTS.GROUP_AGENTS.GET_BY_UID.replace("{uid}", uid)
      );

      console.log("Group Agent Detail API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching group agent details:", error);
      return null;
    }
  },

  // Create group agent
  async createGroupAgent(
    data: CreateGroupAgentRequestDto
  ): Promise<GroupAgentResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.CREATE,
        data
      );

      const response = await apiClient.post<GroupAgentResponseDto>(
        API_ENDPOINTS.GROUP_AGENTS.CREATE,
        data
      );

      console.log("Create Group Agent API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error creating group agent:", error);
      return null;
    }
  },

  // Update group agent
  async updateGroupAgent(
    uid: string,
    data: UpdateGroupAgentRequestDto
  ): Promise<GroupAgentResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.UPDATE.replace("{uid}", uid),
        data
      );

      const response = await apiClient.put<GroupAgentResponseDto>(
        API_ENDPOINTS.GROUP_AGENTS.UPDATE.replace("{uid}", uid),
        data
      );

      console.log("Update Group Agent API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error updating group agent:", error);
      return null;
    }
  },

  // Delete group agent
  async deleteGroupAgent(uid: string): Promise<boolean> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.DELETE.replace("{uid}", uid)
      );

      await apiClient.delete(
        API_ENDPOINTS.GROUP_AGENTS.DELETE.replace("{uid}", uid)
      );

      console.log("Delete Group Agent API Response: Success");
      return true;
    } catch (error) {
      console.error("Error deleting group agent:", error);
      return false;
    }
  },

  // Suspend group agent
  async suspendGroupAgent(uid: string): Promise<GroupAgentResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.SUSPEND.replace("{uid}", uid)
      );

      const response = await apiClient.post<GroupAgentResponseDto>(
        API_ENDPOINTS.GROUP_AGENTS.SUSPEND.replace("{uid}", uid)
      );

      console.log("Suspend Group Agent API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error suspending group agent:", error);
      return null;
    }
  },

  // Deactivate group agent
  async deactivateGroupAgent(
    uid: string
  ): Promise<GroupAgentResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.DEACTIVATE.replace("{uid}", uid)
      );

      const response = await apiClient.post<GroupAgentResponseDto>(
        API_ENDPOINTS.GROUP_AGENTS.DEACTIVATE.replace("{uid}", uid)
      );

      console.log("Deactivate Group Agent API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error deactivating group agent:", error);
      return null;
    }
  },

  // Activate group agent
  async activateGroupAgent(uid: string): Promise<GroupAgentResponseDto | null> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.ACTIVATE.replace("{uid}", uid)
      );

      const response = await apiClient.post<GroupAgentResponseDto>(
        API_ENDPOINTS.GROUP_AGENTS.ACTIVATE.replace("{uid}", uid)
      );

      console.log("Activate Group Agent API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error activating group agent:", error);
      return null;
    }
  },

  // Search group agents
  async searchGroupAgents(
    searchData: GroupAgentSearchRequestDto
  ): Promise<PaginatedResponse<GroupAgentResponseDto>> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.SEARCH,
        searchData
      );

      const response = await apiClient.post<any>(
        API_ENDPOINTS.GROUP_AGENTS.SEARCH,
        searchData
      );

      console.log("Search Group Agents API Response:", response);

      const responseData = response.data || response;
      const groupAgentsArray = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];

      return {
        data: groupAgentsArray,
        pageNumber: responseData.pageNumber || 0,
        pageSize: responseData.pageSize || 20,
        totalElements: responseData.totalElements || groupAgentsArray.length,
        totalPages: responseData.totalPages || 1,
        last: responseData.last || true,
      };
    } catch (error) {
      console.error("Error searching group agents:", error);
      return {
        data: [],
        pageNumber: searchData.page || 0,
        pageSize: searchData.size || 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
      };
    }
  },

  // Get group agent statistics
  async getGroupAgentStats(): Promise<GroupAgentStatsDto | null> {
    try {
      console.log("Making API call to:", API_ENDPOINTS.GROUP_AGENTS.STATS);

      const response = await apiClient.get<GroupAgentStatsDto>(
        API_ENDPOINTS.GROUP_AGENTS.STATS
      );

      console.log("Group Agent Stats API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching group agent statistics:", error);
      return null;
    }
  },

  // Get group agents by partner
  async getGroupAgentsByPartner(
    partnerId: number,
    params: PageRequest = {}
  ): Promise<PaginatedResponse<GroupAgentResponseDto>> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.GET_BY_PARTNER.replace(
          "{partnerId}",
          String(partnerId)
        ),
        params
      );

      const queryParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );

      const response = await apiClient.get<any>(
        API_ENDPOINTS.GROUP_AGENTS.GET_BY_PARTNER.replace(
          "{partnerId}",
          String(partnerId)
        ),
        queryParams
      );

      console.log("Group Agents by Partner API Response:", response);

      const responseData = response.data || response;
      const groupAgentsArray = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];

      return {
        data: groupAgentsArray,
        pageNumber: responseData.pageNumber || 0,
        pageSize: responseData.pageSize || 20,
        totalElements: responseData.totalElements || groupAgentsArray.length,
        totalPages: responseData.totalPages || 1,
        last: responseData.last || true,
      };
    } catch (error) {
      console.error("Error fetching group agents by partner:", error);
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

  // Get group agents for assignment
  async getGroupAgentsForAssignment(): Promise<GroupAgentResponseDto[]> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.GROUP_AGENTS.GET_FOR_ASSIGNMENT
      );

      const response = await apiClient.get<any>(
        API_ENDPOINTS.GROUP_AGENTS.GET_FOR_ASSIGNMENT
      );

      console.log("Group Agents for Assignment API Response:", response);

      const responseData = response.data || response;
      return Array.isArray(responseData)
        ? responseData
        : responseData.data || [];
    } catch (error) {
      console.error("Error fetching group agents for assignment:", error);
      return [];
    }
  },
};
