import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  AgentResponseDto,
  AgentSummaryDto,
  SuperAgentStatistics,
  CreateSuperAgentRequestDto,
  SuperAgentSearchRequestDto,
  PageRequest,
} from "@/lib/api/types";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/client";

export const superAgentsService = {
  // Get all super agents with pagination
  getSuperAgents: async (
    params?: PageRequest
  ): Promise<PaginatedResponse<AgentSummaryDto>> => {
    return apiClient.get<PaginatedResponse<AgentSummaryDto>>(
      API_ENDPOINTS.SUPER_AGENTS.LIST,
      { params }
    );
  },

  // Get super agent by UID
  getSuperAgentByUid: async (
    uid: string
  ): Promise<ApiResponse<AgentResponseDto>> => {
    return apiClient.get<AgentResponseDto>(
      API_ENDPOINTS.SUPER_AGENTS.GET_BY_UID.replace("{uid}", uid)
    );
  },

  // Create a new super agent
  createSuperAgent: async (
    superAgent: CreateSuperAgentRequestDto
  ): Promise<ApiResponse<AgentResponseDto>> => {
    return apiClient.post<AgentResponseDto>(
      API_ENDPOINTS.SUPER_AGENTS.CREATE,
      superAgent
    );
  },

  // Update super agent status
  updateSuperAgentStatus: async (
    uid: string,
    status: string
  ): Promise<ApiResponse<AgentResponseDto>> => {
    return apiClient.put<AgentResponseDto>(
      API_ENDPOINTS.SUPER_AGENTS.UPDATE_STATUS.replace("{uid}", uid),
      {},
      { params: { status } }
    );
  },

  // Assign super agent to sub-agent
  assignSuperAgent: async (
    superAgentUid: string,
    subAgentUid: string
  ): Promise<ApiResponse<AgentResponseDto>> => {
    return apiClient.put<AgentResponseDto>(
      API_ENDPOINTS.SUPER_AGENTS.ASSIGN,
      {},
      { params: { superAgentUid, subAgentUid } }
    );
  },

  // Remove super agent from sub-agent
  removeSuperAgent: async (
    subAgentUid: string
  ): Promise<ApiResponse<AgentResponseDto>> => {
    return apiClient.delete<AgentResponseDto>(
      API_ENDPOINTS.SUPER_AGENTS.REMOVE,
      { params: { subAgentUid } }
    );
  },

  // Search super agents
  searchSuperAgents: async (
    searchRequest: SuperAgentSearchRequestDto
  ): Promise<PaginatedResponse<AgentSummaryDto>> => {
    return apiClient.get<PaginatedResponse<AgentSummaryDto>>(
      API_ENDPOINTS.SUPER_AGENTS.SEARCH,
      { params: searchRequest }
    );
  },

  // Get super agents by partner UID
  getSuperAgentsByPartner: async (
    partnerUid: string,
    params?: PageRequest
  ): Promise<PaginatedResponse<AgentSummaryDto>> => {
    return apiClient.get<PaginatedResponse<AgentSummaryDto>>(
      API_ENDPOINTS.SUPER_AGENTS.GET_BY_PARTNER.replace(
        "{partnerUid}",
        partnerUid
      ),
      { params }
    );
  },

  // Get sub-agents of a super agent
  getSubAgents: async (
    superAgentUid: string,
    params?: PageRequest
  ): Promise<PaginatedResponse<AgentSummaryDto>> => {
    return apiClient.get<PaginatedResponse<AgentSummaryDto>>(
      API_ENDPOINTS.SUPER_AGENTS.GET_SUB_AGENTS.replace(
        "{superAgentUid}",
        superAgentUid
      ),
      { params }
    );
  },

  // Get sub-agents count
  getSubAgentsCount: async (
    superAgentUid: string
  ): Promise<ApiResponse<number>> => {
    return apiClient.get<number>(
      API_ENDPOINTS.SUPER_AGENTS.GET_SUB_AGENTS_COUNT.replace(
        "{superAgentUid}",
        superAgentUid
      )
    );
  },

  // Get agent hierarchy
  getAgentHierarchy: async (
    superAgentUid: string
  ): Promise<ApiResponse<AgentResponseDto[]>> => {
    return apiClient.get<AgentResponseDto[]>(
      API_ENDPOINTS.SUPER_AGENTS.GET_HIERARCHY.replace(
        "{superAgentUid}",
        superAgentUid
      )
    );
  },

  // Get super agent statistics
  getSuperAgentStatistics: async (): Promise<
    ApiResponse<SuperAgentStatistics>
  > => {
    return apiClient.get<SuperAgentStatistics>(
      API_ENDPOINTS.SUPER_AGENTS.STATISTICS
    );
  },
};
