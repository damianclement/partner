/**
 * Agents Service
 * Handles agent management API calls
 */

import { apiClient, buildPathWithParams } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  AgentResponseDto,
  AgentSummaryDto,
  UpdateAgentStatusRequestDto,
  CreateSuperAgentRequestDto,
  AgentPasswordResetResponseDto,
  PageRequest,
  AgentListParams,
  AgentStats,
  AgentFilters,
} from "../types";
import type { PaginatedResponse, ApiResponse } from "../client";

export class AgentsService {
  /**
   * Get all agents with pagination and filters
   */
  async getAgents(
    params?: AgentListParams
  ): Promise<PaginatedResponse<AgentSummaryDto>> {
    const queryParams: Record<string, any> = {};

    // Add pagination params
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.size !== undefined) queryParams.size = params.size;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.sortDir) queryParams.sortDir = params.sortDir;

      // Add filter params
      if (params.filters) {
        if (params.filters.status) queryParams.status = params.filters.status;
        if (params.filters.agentType)
          queryParams.agentType = params.filters.agentType;
        if (params.filters.partnerId)
          queryParams.partnerId = params.filters.partnerId;
        if (params.filters.search) queryParams.search = params.filters.search;
      }
    }

    return apiClient.get<AgentSummaryDto[]>(
      API_ENDPOINTS.AGENTS.LIST,
      queryParams
    ) as Promise<PaginatedResponse<AgentSummaryDto>>;
  }

  /**
   * Get agent by UID
   */
  async getAgentByUid(uid: string): Promise<ApiResponse<AgentResponseDto>> {
    return apiClient.get<AgentResponseDto>(
      buildPathWithParams(API_ENDPOINTS.AGENTS.GET_BY_UID, { uid })
    );
  }

  /**
   * Get agents by partner UID
   */
  async getAgentsByPartnerUid(
    partnerUid: string,
    params?: PageRequest
  ): Promise<PaginatedResponse<AgentSummaryDto>> {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : {};

    return apiClient.get<AgentSummaryDto[]>(
      buildPathWithParams(API_ENDPOINTS.AGENTS.GET_BY_PARTNER_UID, {
        partnerUid,
      }),
      queryParams
    ) as Promise<PaginatedResponse<AgentSummaryDto>>;
  }

  /**
   * Update agent status
   */
  async updateAgentStatus(
    uid: string,
    request: UpdateAgentStatusRequestDto
  ): Promise<ApiResponse<AgentResponseDto>> {
    return apiClient.put<AgentResponseDto>(
      buildPathWithParams(API_ENDPOINTS.AGENTS.UPDATE_STATUS, { uid }),
      request
    );
  }

  /**
   * Reset agent password
   */
  async resetAgentPassword(
    uid: string,
    sendEmail: boolean = true,
    sendSms: boolean = true
  ): Promise<ApiResponse<AgentPasswordResetResponseDto>> {
    return apiClient.post<AgentPasswordResetResponseDto>(
      buildPathWithParams(API_ENDPOINTS.AGENTS.RESET_PASSWORD, { uid }),
      {},
      { sendEmail: String(sendEmail), sendSms: String(sendSms) }
    );
  }

  /**
   * Create super agent
   */
  async createSuperAgent(
    request: CreateSuperAgentRequestDto
  ): Promise<ApiResponse<AgentResponseDto>> {
    return apiClient.post<AgentResponseDto>(
      API_ENDPOINTS.AGENTS.CREATE_SUPER_AGENT,
      request
    );
  }

  /**
   * Get agent statistics (mock implementation - would need actual endpoint)
   */
  async getAgentStats(): Promise<AgentStats> {
    // This would be a real API call in production
    // For now, return mock data that matches the UI expectations
    return {
      totalAgents: 1423,
      activeAgents: 1289,
      pendingApproval: 87,
      averageRating: 4.6,
    };
  }

  /**
   * Search agents with filters
   */
  async searchAgents(
    searchTerm: string,
    filters?: AgentFilters,
    pageRequest?: PageRequest
  ): Promise<PaginatedResponse<AgentSummaryDto>> {
    const params: AgentListParams = {
      ...pageRequest,
      filters: {
        ...filters,
        search: searchTerm,
      },
    };
    return this.getAgents(params);
  }
}

// Export singleton instance
export const agentsService = new AgentsService();
