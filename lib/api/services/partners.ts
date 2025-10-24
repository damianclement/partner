/**
 * Partners Service
 * Handles partner management API calls
 */

import { apiClient, buildPathWithParams } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  PartnerResponseDto,
  PartnerSummaryDto,
  PartnerStatistics,
  UpdatePartnerRequestDto,
  CreatePartnerRequestDto,
  PartnerSearchRequestDto,
  ApiKeySummary,
  CreateApiKeyRequestDto,
  ApiKeyStatus,
  BulkUpdateTierRequestDto,
  BulkUpdateStatusRequestDto,
  PageRequest,
} from "../types";
import type { PaginatedResponse, ApiResponse } from "../client";

export class PartnersService {
  /**
   * Get all partners with pagination
   */
  async getPartners(
    params?: PageRequest
  ): Promise<PaginatedResponse<PartnerSummaryDto>> {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : {};

    return apiClient.get<PartnerSummaryDto[]>(
      API_ENDPOINTS.PARTNERS.LIST,
      queryParams
    ) as Promise<PaginatedResponse<PartnerSummaryDto>>;
  }

  /**
   * Get partner by ID
   */
  async getPartnerById(id: number): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.get<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.GET_BY_ID, {
        id: String(id),
      })
    );
  }

  /**
   * Get partner by UID
   */
  async getPartnerByUid(uid: string): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.get<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.GET_BY_UID, { uid })
    );
  }

  /**
   * Create new partner
   */
  async createPartner(
    partner: CreatePartnerRequestDto
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.post<PartnerResponseDto>(
      API_ENDPOINTS.PARTNERS.CREATE,
      partner
    );
  }

  /**
   * Update partner by ID
   */
  async updatePartnerById(
    id: number,
    partner: UpdatePartnerRequestDto
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.UPDATE, { id: id.toString() }),
      partner
    );
  }

  /**
   * Update partner by UID
   */
  async updatePartnerByUid(
    uid: string,
    partner: UpdatePartnerRequestDto
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.UPDATE_UID, { uid }),
      partner
    );
  }

  /**
   * Verify partner by ID
   */
  async verifyPartner(id: number): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.VERIFY, { id: id.toString() })
    );
  }

  /**
   * Unverify partner by ID
   */
  async unverifyPartner(id: number): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.UNVERIFY, {
        id: id.toString(),
      })
    );
  }

  /**
   * Activate partner by ID
   */
  async activatePartner(id: number): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.ACTIVATE, {
        id: id.toString(),
      })
    );
  }

  /**
   * Deactivate partner by ID
   */
  async deactivatePartner(
    id: number
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.DEACTIVATE, {
        id: id.toString(),
      })
    );
  }

  /**
   * Soft delete partner by ID
   */
  async softDeletePartner(
    id: number
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.SOFT_DELETE, {
        id: id.toString(),
      })
    );
  }

  /**
   * Set partner tier by ID
   */
  async setPartnerTier(
    id: number,
    tier: string
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.SET_TIER, {
        id: id.toString(),
      }),
      {},
      { tier }
    );
  }

  /**
   * Set partner status by ID
   */
  async setPartnerStatus(
    id: number,
    status: string
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.SET_STATUS, {
        id: id.toString(),
      }),
      {},
      { status }
    );
  }

  /**
   * Set partner commission rate by ID
   */
  async setPartnerCommission(
    id: number,
    commissionRate: number
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.put<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.SET_COMMISSION, {
        id: String(id),
      }),
      {},
      { commissionRate: String(commissionRate) }
    );
  }

  /**
   * Bulk update partner tiers
   */
  async bulkUpdateTiers(
    request: BulkUpdateTierRequestDto
  ): Promise<ApiResponse<string>> {
    return apiClient.put<string>(
      API_ENDPOINTS.PARTNERS.BULK_UPDATE_TIER,
      request
    );
  }

  /**
   * Bulk update partner statuses
   */
  async bulkUpdateStatuses(
    request: BulkUpdateStatusRequestDto
  ): Promise<ApiResponse<string>> {
    return apiClient.put<string>(
      API_ENDPOINTS.PARTNERS.BULK_UPDATE_STATUS,
      request
    );
  }

  /**
   * Search partners
   */
  async searchPartners(
    searchRequest: PartnerSearchRequestDto
  ): Promise<PaginatedResponse<PartnerSummaryDto>> {
    return apiClient.post<PartnerSummaryDto[]>(
      API_ENDPOINTS.PARTNERS.SEARCH,
      searchRequest
    ) as Promise<PaginatedResponse<PartnerSummaryDto>>;
  }

  /**
   * Get partners by tier
   */
  async getPartnersByTier(
    tier: string,
    params?: PageRequest
  ): Promise<PaginatedResponse<PartnerSummaryDto>> {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : {};

    return apiClient.get<PartnerSummaryDto[]>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.GET_BY_TIER, { tier }),
      queryParams
    ) as Promise<PaginatedResponse<PartnerSummaryDto>>;
  }

  /**
   * Get partners by status
   */
  async getPartnersByStatus(
    status: string,
    params?: PageRequest
  ): Promise<PaginatedResponse<PartnerSummaryDto>> {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : {};

    return apiClient.get<PartnerSummaryDto[]>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.GET_BY_STATUS, { status }),
      queryParams
    ) as Promise<PaginatedResponse<PartnerSummaryDto>>;
  }

  /**
   * Get partner statistics
   */
  async getPartnerStatistics(): Promise<ApiResponse<PartnerStatistics>> {
    return apiClient.get<PartnerStatistics>(API_ENDPOINTS.PARTNERS.STATISTICS);
  }

  /**
   * Get partners for assignment (dropdown options)
   */
  async getPartnersForAssignment(): Promise<ApiResponse<PartnerSummaryDto[]>> {
    return apiClient.get<PartnerSummaryDto[]>(
      API_ENDPOINTS.PARTNERS.FOR_ASSIGNMENT
    );
  }

  /**
   * Get partner by code
   */
  async getPartnerByCode(
    partnerCode: string
  ): Promise<ApiResponse<PartnerResponseDto>> {
    return apiClient.get<PartnerResponseDto>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.GET_BY_CODE, { partnerCode })
    );
  }

  // API Key Management

  /**
   * Get API keys for partner by UID
   */
  async getPartnerApiKeys(
    partnerUid: string
  ): Promise<ApiResponse<ApiKeySummary[]>> {
    return apiClient.get<ApiKeySummary[]>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.API_KEYS, { partnerUid })
    );
  }

  /**
   * Get active API keys for partner by UID
   */
  async getPartnerActiveApiKeys(
    partnerUid: string
  ): Promise<ApiResponse<ApiKeySummary[]>> {
    return apiClient.get<ApiKeySummary[]>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.API_KEYS_ACTIVE, {
        partnerUid,
      })
    );
  }

  /**
   * Generate new API key for partner
   */
  async generateApiKey(
    partnerUid: string,
    request: CreateApiKeyRequestDto
  ): Promise<ApiResponse<any>> {
    return apiClient.post<any>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.GENERATE_API_KEY, {
        partnerUid,
      }),
      request
    );
  }

  /**
   * Regenerate API key for partner
   */
  async regenerateApiKey(partnerUid: string): Promise<ApiResponse<any>> {
    return apiClient.post<any>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.REGENERATE_API_KEY, {
        partnerUid,
      })
    );
  }

  /**
   * Enable API key for partner
   */
  async enablePartnerApiKey(partnerUid: string): Promise<ApiResponse<string>> {
    return apiClient.put<string>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.ENABLE_API_KEY, { partnerUid })
    );
  }

  /**
   * Disable API key for partner
   */
  async disablePartnerApiKey(partnerUid: string): Promise<ApiResponse<string>> {
    return apiClient.put<string>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.DISABLE_API_KEY, {
        partnerUid,
      })
    );
  }

  /**
   * Get API key status by UID
   */
  async getApiKeyStatus(apiKeyUid: string): Promise<ApiResponse<ApiKeyStatus>> {
    return apiClient.get<ApiKeyStatus>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.GET_API_KEY, { apiKeyUid })
    );
  }

  /**
   * Delete API key by UID
   */
  async deleteApiKey(apiKeyUid: string): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.DELETE_API_KEY, { apiKeyUid })
    );
  }

  /**
   * Delete partner API key
   */
  async deletePartnerApiKey(partnerUid: string): Promise<ApiResponse<string>> {
    return apiClient.delete<string>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.DELETE_PARTNER_API_KEY, {
        partnerUid,
      })
    );
  }

  /**
   * Enable API key by UID (admin endpoint)
   */
  async enableApiKeyByUid(apiKeyUid: string): Promise<ApiResponse<string>> {
    return apiClient.put<string>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.ENABLE_API_KEY_BY_UID, {
        apiKeyUid,
      })
    );
  }

  /**
   * Disable API key by UID (admin endpoint)
   */
  async disableApiKeyByUid(apiKeyUid: string): Promise<ApiResponse<string>> {
    return apiClient.put<string>(
      buildPathWithParams(API_ENDPOINTS.PARTNERS.DISABLE_API_KEY_BY_UID, {
        apiKeyUid,
      })
    );
  }
}

// Export singleton instance
export const partnersService = new PartnersService();
