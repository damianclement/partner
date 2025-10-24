/**
 * Session Config Service
 * Handles fetching user types and roles configuration from the API
 */

import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type { SessionConfigResponse, AdminConfigResponse } from "../types";

export class SessionConfigService {
  /**
   * Get session configuration including user types and roles
   */
  async getSessionConfig(): Promise<AdminConfigResponse> {
    const response = await apiClient.get<SessionConfigResponse>(
      API_ENDPOINTS.SESSION_CONFIG
    );

    if (response.status && response.data) {
      return response.data.data;
    }

    throw new Error(response.message || "Failed to get session config");
  }

  /**
   * Get available user types
   */
  async getUserTypes(): Promise<
    Array<{ value: string; displayName: string; description: string }>
  > {
    const config = await this.getSessionConfig();
    return config.userTypes;
  }

  /**
   * Get available user roles
   */
  async getUserRoles(): Promise<
    Array<{ value: string; displayName: string; description: string }>
  > {
    const config = await this.getSessionConfig();
    return config.userRoles;
  }

  /**
   * Get user type display name by value
   */
  async getUserTypeDisplayName(userType: string): Promise<string> {
    const userTypes = await this.getUserTypes();
    const found = userTypes.find((ut) => ut.value === userType);
    return found?.displayName || userType;
  }

  /**
   * Get user role display name by value
   */
  async getUserRoleDisplayName(userRole: string): Promise<string> {
    const userRoles = await this.getUserRoles();
    const found = userRoles.find((ur) => ur.value === userRole);
    return found?.displayName || userRole;
  }
}

// Export singleton instance
export const sessionConfigService = new SessionConfigService();
