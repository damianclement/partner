"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, sessionConfigService } from "@/lib/api/services";
import type {
  AuthResponse,
  UserType,
  UserRole,
  AdminConfigResponse,
} from "@/lib/api/types";

export interface User {
  id: number;
  uid: string;
  displayName: string;
  username: string;
  email: string;
  employeeId?: string;
  department?: string;
  position?: string;
  userType: UserType; // Store the actual API UserType
  userRole: UserRole; // Store the actual API UserRole
  partner?: {
    id: number;
    uid: string;
    name: string;
    code: string;
    businessName: string;
  };
  status: "active" | "inactive";
  roles: string[];
  permissions: string[];
  agentId?: number;
  agentStatus?: string;
  createdAt: string;
  lastLogin: string;
  tokenExpiresAt: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  sessionConfig: AdminConfigResponse | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasUserType: (userType: UserType) => boolean;
  hasAnyUserType: (userTypes: UserType[]) => boolean;
  hasUserRole: (userRole: UserRole) => boolean;
  hasAnyUserRole: (userRoles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  getUserRedirectPath: () => string;
  isAdmin: () => boolean;
  isPartner: () => boolean;
  isAgent: () => boolean;
  isRootUser: () => boolean;
  // Legacy methods for backward compatibility
  hasRole: (role: "admin" | "partner") => boolean;
  hasAnyRole: (roles: ("admin" | "partner")[]) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionConfig, setSessionConfig] =
    useState<AdminConfigResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load session config only when user is authenticated
  const loadSessionConfig = async () => {
    try {
      const config = await sessionConfigService.getSessionConfig();
      setSessionConfig(config);
    } catch (error) {
      console.warn(
        "Session config endpoint not available (non-critical):",
        error
      );
      // Set default session config to prevent UI issues
      setSessionConfig({
        userTypes: [
          {
            value: "ROOT_USER",
            displayName: "Root User",
            description: "Ultimate system administrator",
          },
          {
            value: "SYSTEM_USER",
            displayName: "System User",
            description: "OBUS platform employee",
          },
          {
            value: "PARTNER_USER",
            displayName: "Partner User",
            description: "Partner organization employee",
          },
          {
            value: "PARTNER_AGENT",
            displayName: "Partner Agent",
            description: "Partner super agent",
          },
        ],
        userRoles: [
          {
            value: "ROOT_ADMIN",
            displayName: "Root Administrator",
            description: "Ultimate platform access",
          },
          {
            value: "SYSTEM_ADMIN",
            displayName: "System Administrator",
            description: "Full platform access",
          },
          {
            value: "SYSTEM_SUPPORT",
            displayName: "System Support",
            description: "Platform-wide read-only access",
          },
          {
            value: "PARTNER_ADMIN",
            displayName: "Partner Administrator",
            description: "Full administrative access within partner",
          },
          {
            value: "PARTNER_ONBOARDING_STAFF",
            displayName: "Onboarding Staff",
            description: "Limited access for onboarding",
          },
          {
            value: "PARTNER_CUSTOMER_SUPPORT",
            displayName: "Customer Support",
            description: "Read-only access for support",
          },
          {
            value: "PARTNER_AGENT",
            displayName: "Partner Agent",
            description: "Agent with portal access",
          },
        ],
      });
    }
  };

  useEffect(() => {
    // Load user from stored tokens on app start (only once)
    if (hasInitialized) return;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if user is already authenticated
        const isAuthenticated = await authService.isAuthenticated();

        if (isAuthenticated) {
          // Try to get current user info (this would require an endpoint to get current user)
          // For now, we'll reconstruct from stored tokens or redirect to login
          await checkCurrentUser();
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError("Authentication failed");
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    initializeAuth();
  }, [hasInitialized]);

  const checkCurrentUser = async () => {
    // Don't check current user if we're in the process of logging out
    if (isLoggingOut) {
      return;
    }

    try {
      // In a real implementation, you'd call an endpoint like /admin/v1/users/me
      // to get the current user information based on the stored token
      const accessToken = await authService.getAccessToken();

      if (!accessToken) {
        // No token means user should be logged out
        setUser(null);
        return;
      }

      // For now, we'll check if there's stored user data from a previous login
      // In production, you would call an API endpoint to get current user info
      const storedUserData = localStorage.getItem("user-data");

      if (storedUserData) {
        try {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser);
          // Only load session config if user is authenticated
          try {
            await loadSessionConfig();
          } catch (configError) {
            console.warn(
              "Failed to load session config (non-critical):",
              configError
            );
            // Continue without session config - it's not critical for basic functionality
          }
          return;
        } catch (parseError) {
          console.error("Failed to parse stored user data:", parseError);
          localStorage.removeItem("user-data");
        }
      }

      // If no stored user data, create a default user based on token
      // This should only happen if the user was authenticated but we don't have their data
      console.warn(
        "No stored user data found, but user has valid token. This should not happen in normal flow."
      );
      setUser(null);
    } catch (err) {
      console.error("Failed to get current user:", err);
      // Don't call logout here to avoid infinite loop
      setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse = await authService.login({ username, password });

      // Transform API response to User object
      const userData: User = {
        id: authResponse.partnerId || authResponse.agentId || 1,
        uid: authResponse.partnerUid || "unknown",
        displayName: authResponse.displayName || username,
        username: authResponse.username,
        email: authResponse.email,
        userType: authResponse.userType as UserType, // Store actual UserType
        userRole: (authResponse.roles?.[0] as UserRole) || "PARTNER_AGENT", // Primary role
        partner: authResponse.partnerBusinessName
          ? {
              id: authResponse.partnerId,
              uid: authResponse.partnerUid,
              name: authResponse.partnerBusinessName,
              code: authResponse.partnerCode,
              businessName: authResponse.partnerBusinessName,
            }
          : undefined,
        status: "active",
        roles: authResponse.roles || [],
        permissions: authResponse.permissions || [],
        agentId: authResponse.agentId,
        agentStatus: authResponse.agentStatus,
        createdAt: authResponse.lastLoginAt || new Date().toISOString(),
        lastLogin: authResponse.lastLoginAt || "Just now",
        tokenExpiresAt: authResponse.tokenExpiresAt,
      };

      setUser(userData);

      // Store user data in localStorage for persistence
      localStorage.setItem("user-data", JSON.stringify(userData));

      // Load session config after successful login (non-critical)
      try {
        await loadSessionConfig();
      } catch (configError) {
        console.warn(
          "Failed to load session config after login (non-critical):",
          configError
        );
        // Continue without session config - it's not critical for basic functionality
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      setUser(null);
      setError(null);
      setSessionConfig(null); // Clear session config on logout
      // Clear any stored user data
      localStorage.removeItem("user-data");
      localStorage.removeItem("demo-user-type");
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails, clear local state
      setUser(null);
      setError(null);
      setSessionConfig(null); // Clear session config on logout
      localStorage.removeItem("user-data");
      localStorage.removeItem("demo-user-type");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Enhanced permission checking methods
  const hasUserType = (userType: UserType): boolean => {
    return user?.userType === userType;
  };

  const hasAnyUserType = (userTypes: UserType[]): boolean => {
    return user ? userTypes.includes(user.userType) : false;
  };

  const hasUserRole = (userRole: UserRole): boolean => {
    return user?.userRole === userRole;
  };

  const hasAnyUserRole = (userRoles: UserRole[]): boolean => {
    return user ? userRoles.includes(user.userRole) : false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return user
      ? permissions.some((p) => user.permissions?.includes(p))
      : false;
  };

  // Convenience methods for common checks
  const isAdmin = (): boolean => {
    return (
      hasAnyUserType(["ROOT_USER", "SYSTEM_USER"]) ||
      hasAnyUserRole(["ROOT_ADMIN", "SYSTEM_ADMIN", "SYSTEM_SUPPORT"])
    );
  };

  const isPartner = (): boolean => {
    return (
      hasAnyUserType(["PARTNER_USER"]) ||
      hasAnyUserRole([
        "PARTNER_ADMIN",
        "PARTNER_ONBOARDING_STAFF",
        "PARTNER_CUSTOMER_SUPPORT",
      ])
    );
  };

  const isAgent = (): boolean => {
    return hasUserType("PARTNER_AGENT") || hasUserRole("PARTNER_AGENT");
  };

  const isRootUser = (): boolean => {
    return hasUserType("ROOT_USER") || hasUserRole("ROOT_ADMIN");
  };

  const getUserRedirectPath = (): string => {
    if (!user) return "/";

    // All users go to the same dashboard page, but the dashboard will render
    // different content based on their userType and userRole
    return "/";
  };

  // Legacy methods for backward compatibility
  const hasRole = (role: "admin" | "partner"): boolean => {
    if (role === "admin") return isAdmin();
    if (role === "partner") return isPartner() || isAgent();
    return false;
  };

  const hasAnyRole = (roles: ("admin" | "partner")[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    sessionConfig,
    setUser,
    login,
    logout,
    hasUserType,
    hasAnyUserType,
    hasUserRole,
    hasAnyUserRole,
    hasPermission,
    hasAnyPermission,
    getUserRedirectPath,
    isAdmin,
    isPartner,
    isAgent,
    isRootUser,
    // Legacy methods
    hasRole,
    hasAnyRole,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Helper function to switch user roles for demo purposes (legacy)
export function switchUserRole(role: "admin" | "partner") {
  localStorage.setItem("demo-user-type", role);
  window.location.reload();
}
