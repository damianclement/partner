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
} from "../types";
import type { PaginatedResponse, ApiResponse } from "../client";

export class AgentsService {
  /**
   * Get all agents with pagination
   */
  async getAgents(
    params?: PageRequest
  ): Promise<PaginatedResponse<AgentSummaryDto>> {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : {};

    return apiClient.get<AgentSummaryDto[]>(
      API_ENDPOINTS.AGENTS.LIST,
      queryParams
    ) as Promise<PaginatedResponse<AgentSummaryDto>>;
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
}

// Export singleton instance
export const agentsService = new AgentsService();
