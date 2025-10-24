/**
 * System Config Service
 * Handles system configuration and session data
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type { AdminConfigResponse } from "../types";
import type { ApiResponse } from "../client";

export class SystemConfigService {
  /**
   * Get admin session configuration (enums, types, etc.)
   */
  async getSessionConfig(): Promise<ApiResponse<AdminConfigResponse>> {
    return apiClient.get<AdminConfigResponse>(API_ENDPOINTS.SESSION_CONFIG);
  }
}

// Export singleton instance
export const systemConfigService = new SystemConfigService();
