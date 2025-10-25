"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usersService } from "@/lib/api/services";
import type {
  SystemUserResponseDto,
  CreateAdminUserRequestDto,
  CreatePartnerUserRequestDto,
  UpdateSystemUserRequestDto,
  UserStatistics,
  PageRequest,
} from "@/lib/api/types";
import type { PaginatedResponse, ApiResponse } from "@/lib/api/client";
import { useUser } from "./UserContext";

export interface User {
  id: number;
  uid: string;
  userId: number;
  username: string;
  email: string;
  displayName: string;
  userType: "SYSTEM_USER" | "PARTNER_USER" | "PARTNER_AGENT" | "ROOT_USER";
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  requirePasswordChange: boolean;
  partnerId?: number;
  partnerName?: string;
  partnerCode?: string;
  firstName: string;
  lastName: string;
  systemUserDisplayName: string;
  phoneNumber: string;
  personalEmail: string;
  employeeId: string;
  department: string;
  position: string;
  officeLocation: string;
  workPhone: string;
  workEmail: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  nationalId: string;
  passportNumber: string;
  gender: string;
  preferredLanguage: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserFilters {
  userType?: string;
  status?: string;
  department?: string;
  search?: string;
}

interface UsersContextType {
  // State
  users: User[];
  currentUser: User | null;
  stats: UserStatistics | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Filters
  filters: UserFilters;

  // Actions
  loadUsers: (params?: PageRequest) => Promise<void>;
  loadUserByUid: (uid: string) => Promise<void>;
  createAdminUser: (userData: CreateAdminUserRequestDto) => Promise<void>;
  createPartnerUser: (userData: CreatePartnerUserRequestDto) => Promise<void>;
  updateUser: (
    uid: string,
    userData: UpdateSystemUserRequestDto
  ) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  getUsersByType: (userType: string, params?: PageRequest) => Promise<void>;
  getUsersByStatus: (status: string, params?: PageRequest) => Promise<void>;
  getUsersByDepartment: (
    department: string,
    params?: PageRequest
  ) => Promise<void>;
  verifyUserPhone: (uid: string) => Promise<void>;
  verifyUserEmail: (uid: string) => Promise<void>;
  suspendUser: (uid: string) => Promise<void>;
  deactivateUser: (uid: string) => Promise<void>;
  activateUser: (uid: string) => Promise<void>;
  loadUserStatistics: () => Promise<void>;

  // UI State Management
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: UserFilters) => void;
  clearError: () => void;
  clearCurrentUser: () => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<UserFilters>({});

  // Helper function to transform API response to User interface
  const transformUserResponse = useCallback(
    (response: SystemUserResponseDto): User => {
      return {
        id: response.id,
        uid: response.uid,
        userId: response.userId,
        username: response.username || "",
        email: response.email || "",
        displayName: response.displayName || "",
        userType: response.userType as
          | "SYSTEM_USER"
          | "PARTNER_USER"
          | "PARTNER_AGENT"
          | "ROOT_USER",
        enabled: response.enabled,
        accountNonExpired: response.accountNonExpired,
        accountNonLocked: response.accountNonLocked,
        credentialsNonExpired: response.credentialsNonExpired,
        requirePasswordChange: response.requirePasswordChange,
        partnerId: response.partnerId,
        partnerName: response.partnerName,
        partnerCode: response.partnerCode,
        firstName: response.firstName || "",
        lastName: response.lastName || "",
        systemUserDisplayName: response.systemUserDisplayName || "",
        phoneNumber: response.phoneNumber || "",
        personalEmail: response.personalEmail || "",
        employeeId: response.employeeId || "",
        department: response.department || "",
        position: response.position || "",
        officeLocation: response.officeLocation || "",
        workPhone: response.workPhone || "",
        workEmail: response.workEmail || "",
        address: response.address || "",
        city: response.city || "",
        state: response.state || "",
        country: response.country || "",
        postalCode: response.postalCode || "",
        nationalId: response.nationalId || "",
        passportNumber: response.passportNumber || "",
        gender: response.gender || "",
        preferredLanguage: response.preferredLanguage || "",
        emergencyContactName: response.emergencyContactName || "",
        emergencyContactPhone: response.emergencyContactPhone || "",
        timezone: response.timezone || "",
        createdAt: response.createdAt || "",
        updatedAt: response.updatedAt || "",
        lastLoginAt: response.lastLoginDate || "",
      };
    },
    []
  );

  // Helper function to calculate statistics from users data
  const calculateStatsFromUsers = useCallback((usersData: User[]) => {
    console.log("UsersContext - Calculating stats from users data:", {
      totalUsers: usersData.length,
      users: usersData.map((user) => ({
        id: user.id,
        username: user.username,
        userType: user.userType,
        enabled: user.enabled,
        department: user.department,
      })),
    });

    const totalUsers = usersData.length;
    const activeUsers = usersData.filter((user) => user.enabled).length;
    const inactiveUsers = usersData.filter((user) => !user.enabled).length;
    const adminUsers = usersData.filter(
      (user) => user.userType === "SYSTEM_USER" || user.userType === "ROOT_USER"
    ).length;
    const partnerUsers = usersData.filter(
      (user) => user.userType === "PARTNER_USER"
    ).length;
    const partnerAgents = usersData.filter(
      (user) => user.userType === "PARTNER_AGENT"
    ).length;

    // Get unique departments
    const departments = new Set(
      usersData.map((user) => user.department).filter(Boolean)
    );
    const totalDepartments = departments.size;
    const averageUsersPerDepartment =
      totalDepartments > 0 ? totalUsers / totalDepartments : 0;

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers: 0, // This would need additional status field
      pendingVerificationUsers: 0, // This would need additional status field
      lockedUsers: usersData.filter((user) => !user.accountNonLocked).length,
      adminUsers,
      partnerUsers,
      partnerAgents,
      totalDepartments,
      averageUsersPerDepartment,
    };

    console.log("UsersContext - Calculated statistics:", stats);
    return stats;
  }, []);

  // Load users with pagination
  const loadUsers = useCallback(
    async (params?: PageRequest) => {
      try {
        setIsLoading(true);
        setError(null);

        const requestParams = {
          page: currentPage,
          size: pageSize,
          ...params,
          ...filters,
        };

        const response = await usersService.getUsers(requestParams);
        console.log("UsersContext - API Response:", response);

        if (response && response.status && response.data) {
          const transformedUsers = response.data.map(transformUserResponse);
          console.log("UsersContext - Transformed Users:", transformedUsers);
          setUsers(transformedUsers);
          setTotalPages(response.totalPages || 0);
          setTotalItems(response.totalElements || 0);

          // Recalculate statistics from loaded users data
          const calculatedStats = calculateStatsFromUsers(transformedUsers);
          setStats(calculatedStats);
        } else {
          console.warn(
            "UsersContext - API response invalid, using empty array"
          );
          console.warn("Response structure:", response);
          setUsers([]);
          setTotalPages(0);
          setTotalItems(0);

          // Set empty statistics
          setStats({
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            suspendedUsers: 0,
            pendingVerificationUsers: 0,
            lockedUsers: 0,
            adminUsers: 0,
            partnerUsers: 0,
            partnerAgents: 0,
            totalDepartments: 0,
            averageUsersPerDepartment: 0,
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load users";
        setError(errorMessage);
        console.error("Error loading users:", err);

        // Set empty state on error to prevent UI issues
        setUsers([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentPage,
      pageSize,
      filters.userType,
      filters.status,
      filters.department,
      filters.search,
      calculateStatsFromUsers,
    ]
  );

  // Load user by UID
  const loadUserByUid = useCallback(
    async (uid: string) => {
      try {
        console.log("UsersContext - Loading user by UID:", uid);
        setIsLoading(true);
        setError(null);

        const response: any = await usersService.getUserByUid(uid);
        console.log("UsersContext - User response:", response);
        console.log("UsersContext - Response type:", typeof response);
        console.log(
          "UsersContext - Response keys:",
          response ? Object.keys(response) : "No response"
        );

        // Check what we actually received
        if (!response) {
          throw new Error("No response received from server");
        }

        // The response could be either:
        // 1. The full ApiResponse { status: true, data: {...} }
        // 2. Just the data object with status field
        let userData;

        if (
          response.data &&
          typeof response.data === "object" &&
          "id" in response.data
        ) {
          // Standard ApiResponse structure
          console.log("UsersContext - Standard ApiResponse structure");
          userData = response.data;
        } else if (response.uid || response.userId) {
          // Response is already the user data object
          console.log("UsersContext - Response is user data directly");
          userData = response;
        } else {
          console.error(
            "UsersContext - Unable to determine response structure:",
            response
          );
          throw new Error("Unexpected response structure");
        }

        const transformedUser = transformUserResponse(userData as any);
        console.log("UsersContext - Transformed user:", transformedUser);
        setCurrentUser(transformedUser);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load user";
        setError(errorMessage);
        console.error("Error loading user:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [transformUserResponse]
  );

  // Create admin user
  const createAdminUser = async (userData: CreateAdminUserRequestDto) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.createAdminUser(userData);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) => [transformedUser, ...prev]);
        setTotalItems((prev) => prev + 1);
      } else {
        throw new Error(response.message || "Failed to create admin user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create admin user";
      setError(errorMessage);
      console.error("Error creating admin user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create partner user
  const createPartnerUser = async (userData: CreatePartnerUserRequestDto) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.createPartnerUser(userData);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) => [transformedUser, ...prev]);
        setTotalItems((prev) => prev + 1);
      } else {
        throw new Error(response.message || "Failed to create partner user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create partner user";
      setError(errorMessage);
      console.error("Error creating partner user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user
  const updateUser = async (
    uid: string,
    userData: UpdateSystemUserRequestDto
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.updateUser(uid, userData);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) =>
          prev.map((user) => (user.uid === uid ? transformedUser : user))
        );
        if (currentUser?.uid === uid) {
          setCurrentUser(transformedUser);
        }
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);
      console.error("Error updating user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await usersService.deleteUser(uid);
      setUsers((prev) => prev.filter((user) => user.uid !== uid));
      setTotalItems((prev) => prev - 1);
      if (currentUser?.uid === uid) {
        setCurrentUser(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      console.error("Error deleting user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get users by type
  const getUsersByType = async (userType: string, params?: PageRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.getUsersByType(userType, params);
      const transformedUsers = response.map(transformUserResponse);
      setUsers(transformedUsers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load users by type";
      setError(errorMessage);
      console.error("Error loading users by type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get users by status
  const getUsersByStatus = async (status: string, params?: PageRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.getUsersByStatus(status, params);
      const transformedUsers = response.map(transformUserResponse);
      setUsers(transformedUsers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load users by status";
      setError(errorMessage);
      console.error("Error loading users by status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get users by department
  const getUsersByDepartment = async (
    department: string,
    params?: PageRequest
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.getUsersByDepartment(
        department,
        params
      );
      const transformedUsers = response.map(transformUserResponse);
      setUsers(transformedUsers);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load users by department";
      setError(errorMessage);
      console.error("Error loading users by department:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify user phone
  const verifyUserPhone = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.verifyUserPhone(uid);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) =>
          prev.map((user) => (user.uid === uid ? transformedUser : user))
        );
        if (currentUser?.uid === uid) {
          setCurrentUser(transformedUser);
        }
      } else {
        throw new Error(response.message || "Failed to verify user phone");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify user phone";
      setError(errorMessage);
      console.error("Error verifying user phone:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify user email
  const verifyUserEmail = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.verifyUserEmail(uid);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) =>
          prev.map((user) => (user.uid === uid ? transformedUser : user))
        );
        if (currentUser?.uid === uid) {
          setCurrentUser(transformedUser);
        }
      } else {
        throw new Error(response.message || "Failed to verify user email");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify user email";
      setError(errorMessage);
      console.error("Error verifying user email:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Suspend user
  const suspendUser = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.suspendUser(uid);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) =>
          prev.map((user) => (user.uid === uid ? transformedUser : user))
        );
        if (currentUser?.uid === uid) {
          setCurrentUser(transformedUser);
        }
      } else {
        throw new Error(response.message || "Failed to suspend user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to suspend user";
      setError(errorMessage);
      console.error("Error suspending user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Deactivate user
  const deactivateUser = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.deactivateUser(uid);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) =>
          prev.map((user) => (user.uid === uid ? transformedUser : user))
        );
        if (currentUser?.uid === uid) {
          setCurrentUser(transformedUser);
        }
      } else {
        throw new Error(response.message || "Failed to deactivate user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to deactivate user";
      setError(errorMessage);
      console.error("Error deactivating user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Activate user
  const activateUser = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await usersService.activateUser(uid);

      if (response.status && response.data) {
        const transformedUser = transformUserResponse(response.data);
        setUsers((prev) =>
          prev.map((user) => (user.uid === uid ? transformedUser : user))
        );
        if (currentUser?.uid === uid) {
          setCurrentUser(transformedUser);
        }
      } else {
        throw new Error(response.message || "Failed to activate user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to activate user";
      setError(errorMessage);
      console.error("Error activating user:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load user statistics
  const loadUserStatistics = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      setError(null);

      // First try to calculate from loaded users data (more reliable)
      if (users.length > 0) {
        const calculatedStats = calculateStatsFromUsers(users);
        setStats(calculatedStats);
        console.log(
          "UsersContext - Calculated stats from users data:",
          calculatedStats
        );
      } else {
        // If no users loaded, try API calls
        const response = await usersService.getUserStatistics();
        setStats(response);
        console.log("UsersContext - Stats from API:", response);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user statistics";
      setError(errorMessage);
      console.error("Error loading user statistics:", err);

      // Calculate statistics from loaded users data as fallback
      const calculatedStats = calculateStatsFromUsers(users);
      setStats(calculatedStats);
    } finally {
      setIsStatsLoading(false);
    }
  }, [users, calculateStatsFromUsers]);

  // UI State Management
  const clearError = () => setError(null);
  const clearCurrentUser = () => setCurrentUser(null);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      console.log("UsersContext - Loading initial data");
      loadUsers({ page: 0, size: 10 });
      // Statistics will be calculated from loaded users data
    }
  }, [isAuthenticated, loadUsers]); // Run when authentication status changes

  const value: UsersContextType = {
    // State
    users,
    currentUser,
    stats,
    isLoading,
    isStatsLoading,
    error,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    totalItems,

    // Filters
    filters,

    // Actions
    loadUsers,
    loadUserByUid,
    createAdminUser,
    createPartnerUser,
    updateUser,
    deleteUser,
    getUsersByType,
    getUsersByStatus,
    getUsersByDepartment,
    verifyUserPhone,
    verifyUserEmail,
    suspendUser,
    deactivateUser,
    activateUser,
    loadUserStatistics,

    // UI State Management
    setCurrentPage,
    setPageSize,
    setFilters,
    clearError,
    clearCurrentUser,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}
