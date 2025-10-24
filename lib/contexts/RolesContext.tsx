"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { rolesService } from "@/lib/api/services";
import type {
  RoleResponseDto,
  RoleWithPermissionsDto,
  UserRolesResponseDto,
  AssignRoleRequest,
  RoleStatistics,
} from "@/lib/api/types";
import { useUser } from "./UserContext";

export interface Role {
  id: number;
  uid: string;
  name: string;
  displayName: string;
  description: string;
  active: boolean;
  permissionCount: number;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFilters {
  active?: boolean;
  search?: string;
}

export interface RolesContextType {
  // State
  roles: Role[];
  currentRole: Role | null;
  stats: RoleStatistics | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Actions
  loadRoles: () => Promise<void>;
  loadRoleByUid: (uid: string) => Promise<void>;
  loadRoleByName: (name: string) => Promise<void>;
  loadRolePermissions: (uid: string) => Promise<RoleWithPermissionsDto | null>;
  loadUserRoles: (userUid: string) => Promise<UserRolesResponseDto | null>;
  assignRoleToUser: (
    userUid: string,
    roleData: AssignRoleRequest
  ) => Promise<void>;
  revokeRoleFromUser: (userUid: string, roleUid: string) => Promise<void>;
  loadRoleStatistics: () => Promise<void>;

  // Filters
  filters: RoleFilters;
  setFilters: (filters: RoleFilters) => void;

  // UI State Management
  clearError: () => void;
  clearCurrentRole: () => void;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
};

interface RolesProviderProps {
  children: React.ReactNode;
}

export const RolesProvider: React.FC<RolesProviderProps> = ({ children }) => {
  const { isAuthenticated } = useUser();

  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [stats, setStats] = useState<RoleStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<RoleFilters>({});

  // Helper function to transform API response to Role interface
  const transformRoleResponse = useCallback(
    (response: RoleResponseDto): Role => {
      return {
        id: response.id,
        uid: response.uid,
        name: response.name,
        displayName: response.displayName,
        description: response.description,
        active: response.active,
        permissionCount: response.permissionCount,
        userCount: response.userCount,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
    },
    []
  );

  // Load roles
  const loadRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesService.getRoles();
      console.log("RolesContext - API Response:", response);

      if (response && Array.isArray(response)) {
        const transformedRoles = response.map(transformRoleResponse);
        console.log("RolesContext - Transformed Roles:", transformedRoles);
        setRoles(transformedRoles);
      } else {
        console.warn("RolesContext - API response invalid, using empty array");
        setRoles([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load roles";
      setError(errorMessage);
      console.error("Error loading roles:", err);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, [transformRoleResponse]);

  // Load role by UID
  const loadRoleByUid = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesService.getRoleByUid(uid);

      if (response) {
        const transformedRole = transformRoleResponse(response);
        setCurrentRole(transformedRole);
      } else {
        throw new Error("Failed to load role");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load role";
      setError(errorMessage);
      console.error("Error loading role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load role by name
  const loadRoleByName = async (name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesService.getRoleByName(name);

      if (response) {
        const transformedRole = transformRoleResponse(response);
        setCurrentRole(transformedRole);
      } else {
        throw new Error("Failed to load role");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load role";
      setError(errorMessage);
      console.error("Error loading role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load role permissions
  const loadRolePermissions = async (
    uid: string
  ): Promise<RoleWithPermissionsDto | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesService.getRolePermissionsByUid(uid);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load role permissions";
      setError(errorMessage);
      console.error("Error loading role permissions:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load user roles
  const loadUserRoles = async (
    userUid: string
  ): Promise<UserRolesResponseDto | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesService.getUserRoles(userUid);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user roles";
      setError(errorMessage);
      console.error("Error loading user roles:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Assign role to user
  const assignRoleToUser = async (
    userUid: string,
    roleData: AssignRoleRequest
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesService.assignRoleToUser(userUid, roleData);

      if (response) {
        // Reload roles to update user counts
        await loadRoles();
      } else {
        throw new Error("Failed to assign role");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to assign role";
      setError(errorMessage);
      console.error("Error assigning role:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Revoke role from user
  const revokeRoleFromUser = async (userUid: string, roleUid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rolesService.revokeRoleFromUserByUid(
        userUid,
        roleUid
      );

      if (response) {
        // Reload roles to update user counts
        await loadRoles();
      } else {
        throw new Error("Failed to revoke role");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to revoke role";
      setError(errorMessage);
      console.error("Error revoking role:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load role statistics
  const loadRoleStatistics = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      setError(null);

      const response = await rolesService.getRoleStatistics();
      console.log("RolesContext - Statistics Response:", response);
      setStats(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load role statistics";
      setError(errorMessage);
      console.error("Error loading role statistics:", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // UI State Management
  const clearError = () => setError(null);
  const clearCurrentRole = () => setCurrentRole(null);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      console.log("RolesContext - Loading initial data");
      loadRoles();
      loadRoleStatistics();
    }
  }, [isAuthenticated]); // Run when authentication status changes

  const value: RolesContextType = {
    // State
    roles,
    currentRole,
    stats,
    isLoading,
    isStatsLoading,
    error,

    // Actions
    loadRoles,
    loadRoleByUid,
    loadRoleByName,
    loadRolePermissions,
    loadUserRoles,
    assignRoleToUser,
    revokeRoleFromUser,
    loadRoleStatistics,

    // Filters
    filters,
    setFilters,

    // UI State Management
    clearError,
    clearCurrentRole,
  };

  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
};
