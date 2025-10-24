"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/lib/api/services";
import type { AuthResponse } from "@/lib/api/types";

export type UserRole = "admin" | "partner";

export interface User {
  id: number;
  uid: string;
  displayName: string;
  username: string;
  email: string;
  employeeId?: string;
  department?: string;
  position?: string;
  userType: UserRole;
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
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from stored tokens on app start
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
      }
    };

    initializeAuth();
  }, []);

  const checkCurrentUser = async () => {
    try {
      // In a real implementation, you'd call an endpoint like /admin/v1/users/me
      // to get the current user information based on the stored token
      // For now, we'll redirect to login if no user data is available
      const accessToken = await authService.getAccessToken();

      if (!accessToken) {
        throw new Error("No access token");
      }

      // TODO: Implement API call to get current user info
      // For now, we'll clear the user state and let login handle it
      setUser(null);
    } catch (err) {
      console.error("Failed to get current user:", err);
      await logout();
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
        userType: (authResponse.userType.toLowerCase() as UserRole) || "admin",
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
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails, clear local state
      setUser(null);
      setError(null);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.userType === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.userType) : false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return user
      ? permissions.some((p) => user.permissions?.includes(p))
      : false;
  };

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    setUser,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
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

// Helper function to switch user roles for demo purposes
export function switchUserRole(role: UserRole) {
  localStorage.setItem("demo-user-type", role);
  window.location.reload();
}
