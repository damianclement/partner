import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type {
  RoleResponseDto,
  RoleWithPermissionsDto,
  UserRolesResponseDto,
  AssignRoleRequest,
  RoleStatistics,
} from "../types";
import type { ApiResponse } from "../client";

export const rolesService = {
  // Get all roles
  async getRoles(): Promise<RoleResponseDto[]> {
    try {
      console.log("Making API call to:", API_ENDPOINTS.ROLES.LIST);

      const response = await apiClient.get<RoleResponseDto[]>(
        API_ENDPOINTS.ROLES.LIST
      );

      console.log("Roles API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      });

      // Return empty array on error
      return [];
    }
  },

  // Get role by UID
  async getRoleByUid(roleUid: string): Promise<RoleResponseDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.ROLES.GET_BY_UID.replace("{roleUid}", roleUid)
      );

      const response = await apiClient.get<RoleResponseDto>(
        API_ENDPOINTS.ROLES.GET_BY_UID.replace("{roleUid}", roleUid)
      );

      console.log("Role API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching role:", error);
      throw error;
    }
  },

  // Get role by name
  async getRoleByName(roleName: string): Promise<RoleResponseDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.ROLES.GET_BY_NAME.replace("{roleName}", roleName)
      );

      const response = await apiClient.get<RoleResponseDto>(
        API_ENDPOINTS.ROLES.GET_BY_NAME.replace("{roleName}", roleName)
      );

      console.log("Role API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching role:", error);
      throw error;
    }
  },

  // Get role permissions by UID
  async getRolePermissionsByUid(
    roleUid: string
  ): Promise<RoleWithPermissionsDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.ROLES.GET_PERMISSIONS_BY_UID.replace("{roleUid}", roleUid)
      );

      const response = await apiClient.get<RoleWithPermissionsDto>(
        API_ENDPOINTS.ROLES.GET_PERMISSIONS_BY_UID.replace("{roleUid}", roleUid)
      );

      console.log("Role Permissions API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      throw error;
    }
  },

  // Get role permissions by name
  async getRolePermissionsByName(
    roleName: string
  ): Promise<RoleWithPermissionsDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.ROLES.GET_PERMISSIONS_BY_NAME.replace(
          "{roleName}",
          roleName
        )
      );

      const response = await apiClient.get<RoleWithPermissionsDto>(
        API_ENDPOINTS.ROLES.GET_PERMISSIONS_BY_NAME.replace(
          "{roleName}",
          roleName
        )
      );

      console.log("Role Permissions API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      throw error;
    }
  },

  // Get user roles
  async getUserRoles(userUid: string): Promise<UserRolesResponseDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.USER_ROLES.GET_USER_ROLES.replace("{userUid}", userUid)
      );

      const response = await apiClient.get<UserRolesResponseDto>(
        API_ENDPOINTS.USER_ROLES.GET_USER_ROLES.replace("{userUid}", userUid)
      );

      console.log("User Roles API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching user roles:", error);
      throw error;
    }
  },

  // Assign role to user
  async assignRoleToUser(
    userUid: string,
    roleData: AssignRoleRequest
  ): Promise<UserRolesResponseDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.USER_ROLES.ASSIGN_ROLE.replace("{userUid}", userUid)
      );
      console.log("Role data:", roleData);

      const response = await apiClient.post<UserRolesResponseDto>(
        API_ENDPOINTS.USER_ROLES.ASSIGN_ROLE.replace("{userUid}", userUid),
        roleData
      );

      console.log("Assign Role API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error assigning role:", error);
      throw error;
    }
  },

  // Revoke role from user by UID
  async revokeRoleFromUserByUid(
    userUid: string,
    roleUid: string
  ): Promise<UserRolesResponseDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.USER_ROLES.REVOKE_ROLE_BY_UID.replace(
          "{userUid}",
          userUid
        ).replace("{roleUid}", roleUid)
      );

      const response = await apiClient.delete<UserRolesResponseDto>(
        API_ENDPOINTS.USER_ROLES.REVOKE_ROLE_BY_UID.replace(
          "{userUid}",
          userUid
        ).replace("{roleUid}", roleUid)
      );

      console.log("Revoke Role API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error revoking role:", error);
      throw error;
    }
  },

  // Revoke role from user by name
  async revokeRoleFromUserByName(
    userUid: string,
    roleName: string
  ): Promise<UserRolesResponseDto> {
    try {
      console.log(
        "Making API call to:",
        API_ENDPOINTS.USER_ROLES.REVOKE_ROLE_BY_NAME.replace(
          "{userUid}",
          userUid
        ).replace("{roleName}", roleName)
      );

      const response = await apiClient.delete<UserRolesResponseDto>(
        API_ENDPOINTS.USER_ROLES.REVOKE_ROLE_BY_NAME.replace(
          "{userUid}",
          userUid
        ).replace("{roleName}", roleName)
      );

      console.log("Revoke Role API Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error revoking role:", error);
      throw error;
    }
  },

  // Get role statistics (mock implementation - adjust based on actual API)
  async getRoleStatistics(): Promise<RoleStatistics> {
    try {
      // This would need to be implemented based on actual API endpoints
      // For now, return mock data
      const roles = await this.getRoles();

      const stats: RoleStatistics = {
        totalRoles: roles.length,
        activeRoles: roles.filter((role) => role.active).length,
        rolesByType: {},
        totalUsers: roles.reduce((sum, role) => sum + role.userCount, 0),
      };

      // Group roles by type (you might need to adjust this based on your role naming convention)
      roles.forEach((role) => {
        const type = role.name.includes("ADMIN")
          ? "admin"
          : role.name.includes("MANAGER")
          ? "manager"
          : role.name.includes("USER")
          ? "user"
          : "other";
        stats.rolesByType[type] = (stats.rolesByType[type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error fetching role statistics:", error);
      return {
        totalRoles: 0,
        activeRoles: 0,
        rolesByType: {},
        totalUsers: 0,
      };
    }
  },
};
