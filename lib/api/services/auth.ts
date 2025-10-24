/**
 * Authentication Service
 * Handles login, logout, token management, and authentication-related API calls
 */

import { apiClient, buildPathWithParams } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
  ConfirmPasswordResetRequest,
  ChangePasswordRequest,
} from "../types";
import type { ApiResponse } from "../client";

export class AuthService {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.status && response.data) {
      // Store tokens in the token manager
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        // Import token manager dynamically to avoid circular imports
        const { tokenManager } = await import("../client");
        tokenManager.setTokens(accessToken, refreshToken);
      }
      return response.data;
    }

    throw new Error(response.message || "Login failed");
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(
    refreshTokenRequest: RefreshTokenRequest
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      refreshTokenRequest
    );

    if (response.status && response.data) {
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        const { tokenManager } = await import("../client");
        tokenManager.setTokens(accessToken, refreshToken);
      }
      return response.data;
    }

    throw new Error(response.message || "Token refresh failed");
  }

  /**
   * Logout user (client-side only - API doesn't have logout endpoint)
   */
  async logout(): Promise<void> {
    const { tokenManager } = await import("../client");
    tokenManager.clearTokens();
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(
    request: ResetPasswordRequest
  ): Promise<ApiResponse<string>> {
    return apiClient.post<string>(API_ENDPOINTS.AUTH.RESET_PASSWORD, request);
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(
    request: ConfirmPasswordResetRequest
  ): Promise<ApiResponse<string>> {
    return apiClient.post<string>(API_ENDPOINTS.AUTH.CONFIRM_RESET, request);
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(
    request: ChangePasswordRequest
  ): Promise<ApiResponse<string>> {
    return apiClient.post<string>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, request);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { tokenManager } = await import("../client");
    return tokenManager.isAuthenticated();
  }

  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string | null> {
    const { tokenManager } = await import("../client");
    return tokenManager.getAccessToken();
  }

  /**
   * Get current refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    const { tokenManager } = await import("../client");
    return tokenManager.getRefreshToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
