/**
 * API Client
 * Handles HTTP requests, authentication, and error handling
 */

import { API_CONFIG, getApiBaseUrl } from "./config";

// Types for API responses
export interface ApiResponse<T = any> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Authentication token management
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem("accessToken");
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem("refreshToken");
    }
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// API Key management for admin authentication
class ApiKeyManager {
  private static instance: ApiKeyManager;
  private apiKey: string | null = null;
  private apiSecret: string | null = null;

  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  setApiCredentials(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiSecret", apiSecret);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem("apiKey");
    }
    return this.apiKey;
  }

  getApiSecret(): string | null {
    if (!this.apiSecret) {
      this.apiSecret = localStorage.getItem("apiSecret");
    }
    return this.apiSecret;
  }

  clearApiCredentials() {
    this.apiKey = null;
    this.apiSecret = null;
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
  }

  hasApiCredentials(): boolean {
    return !!(this.getApiKey() && this.getApiSecret());
  }
}

export const tokenManager = TokenManager.getInstance();
export const apiKeyManager = ApiKeyManager.getInstance();

// Custom error class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// HTTP client class
class ApiClient {
  private timeout: number;
  private retries: number;

  constructor() {
    this.timeout = API_CONFIG.timeout;
    this.retries = API_CONFIG.retries;
  }

  private getBaseURL(): string {
    return getApiBaseUrl();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const baseURL = this.getBaseURL();
    const url = `${baseURL}${endpoint}`;

    // Debug logging for requests
    if (typeof window !== "undefined") {
      console.log("📡 API Request Debug:", {
        method: options.method || "GET",
        url,
        baseURL,
        endpoint,
        headers: options.headers,
      });
    }

    // Set up headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    } as Record<string, string>;

    // Add authentication headers
    const accessToken = tokenManager.getAccessToken();
    const apiKey = apiKeyManager.getApiKey();
    const apiSecret = apiKeyManager.getApiSecret();

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    if (apiSecret) {
      headers["X-API-Secret"] = apiSecret;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      // Retry logic for network errors
      if (retryCount < this.retries && this.isRetryableError(error)) {
        await this.delay(1000 * Math.pow(2, retryCount)); // Exponential backoff
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0
      );
    }
  }

  private isRetryableError(error: any): boolean {
    return error instanceof TypeError && error.message.includes("fetch");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // HTTP methods
  async get<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = params ? this.buildUrlWithParams(endpoint, params) : endpoint;
    return this.makeRequest<T>(url, { method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = params ? this.buildUrlWithParams(endpoint, params) : endpoint;
    return this.makeRequest<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = params ? this.buildUrlWithParams(endpoint, params) : endpoint;
    return this.makeRequest<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = params ? this.buildUrlWithParams(endpoint, params) : endpoint;
    return this.makeRequest<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = params ? this.buildUrlWithParams(endpoint, params) : endpoint;
    return this.makeRequest<T>(url, { method: "DELETE" });
  }

  private buildUrlWithParams(
    endpoint: string,
    params: Record<string, string>
  ): string {
    const url = new URL(`${this.getBaseURL()}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return url.pathname + url.search;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions for common operations
export const buildPathWithParams = (
  path: string,
  params: Record<string, string>
): string => {
  return path.replace(/{(\w+)}/g, (match, key) => {
    if (!(key in params)) {
      throw new Error(`Missing parameter: ${key}`);
    }
    return params[key];
  });
};

// API Response validation helpers
export const isSuccessResponse = <T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { status: true } => {
  return response.status === true;
};

export const isErrorResponse = <T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { status: false } => {
  return response.status === false;
};
