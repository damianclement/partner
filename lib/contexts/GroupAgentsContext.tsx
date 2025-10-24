"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "./UserContext";
import { groupAgentsService } from "@/lib/api/services";
import type {
  GroupAgentResponseDto,
  GroupAgentFilters,
  GroupAgentStatsDto,
  PageRequest,
} from "@/lib/api/types";

// Group Agent interface for UI
export interface GroupAgent {
  id: number;
  uid: string;
  code: string;
  name: string;
  description: string;
  externalSystemIdentifier: string;
  type: "STANDARD" | "CORPORATE" | "AGENCY" | "INDIVIDUAL" | "FRANCHISE";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessName?: string;
  businessAddress?: string;
  taxId?: string;
  licenseNumber?: string;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
  lastActivityDate?: string;
  notes?: string;
  partnerId: number;
  partnerUid: string;
  partnerCode: string;
  partnerBusinessName: string;
  agentCount: number;
  busCoreSystemCount: number;
  activeBusCoreSystemCount: number;
}

export interface GroupAgentsContextType {
  // Data
  groupAgents: GroupAgent[];
  currentGroupAgent: GroupAgent | null;
  stats: GroupAgentStatsDto | null;

  // Loading states
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Filters
  filters: GroupAgentFilters;

  // Actions
  loadGroupAgents: (params?: PageRequest & GroupAgentFilters) => Promise<void>;
  loadGroupAgentDetails: (uid: string) => Promise<void>;
  loadGroupAgentStats: () => Promise<void>;
  setFilters: (filters: GroupAgentFilters) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  searchGroupAgents: (searchTerm: string) => void;
  clearError: () => void;

  // Statistics calculation
  calculateStatsFromGroupAgents: () => {
    totalGroupAgents: number;
    activeGroupAgents: number;
    inactiveGroupAgents: number;
    suspendedGroupAgents: number;
    pendingGroupAgents: number;
    totalAgents: number;
    totalBusCoreSystems: number;
    averageAgentsPerGroup: number;
    averageBusCoreSystemsPerGroup: number;
    groupAgentsByStatus: Record<string, number>;
    groupAgentsByType: Record<string, number>;
  };
}

const GroupAgentsContext = createContext<GroupAgentsContextType | undefined>(
  undefined
);

export function useGroupAgents() {
  const context = useContext(GroupAgentsContext);
  if (!context) {
    throw new Error("useGroupAgents must be used within a GroupAgentsProvider");
  }
  return context;
}

// Transform API response to UI-friendly format
const transformGroupAgentResponse = (
  response: GroupAgentResponseDto
): GroupAgent => {
  return {
    id: response.id,
    uid: response.uid,
    code: response.code,
    name: response.name,
    description: response.description,
    externalSystemIdentifier: response.externalSystemIdentifier,
    type: response.type as
      | "STANDARD"
      | "CORPORATE"
      | "AGENCY"
      | "INDIVIDUAL"
      | "FRANCHISE",
    status: response.status as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING",
    contactPerson: response.contactPerson,
    contactEmail: response.contactEmail,
    contactPhone: response.contactPhone,
    businessName: response.businessName,
    businessAddress: response.businessAddress,
    taxId: response.taxId,
    licenseNumber: response.licenseNumber,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    activatedAt: response.activatedAt,
    lastActivityDate: response.lastActivityDate,
    notes: response.notes,
    partnerId: response.partnerId,
    partnerUid: response.partnerUid,
    partnerCode: response.partnerCode,
    partnerBusinessName: response.partnerBusinessName,
    agentCount: response.agentCount,
    busCoreSystemCount: response.busCoreSystemCount,
    activeBusCoreSystemCount: response.activeBusCoreSystemCount,
  };
};

export function GroupAgentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useUser();

  // State
  const [groupAgents, setGroupAgents] = useState<GroupAgent[]>([]);
  const [currentGroupAgent, setCurrentGroupAgent] = useState<GroupAgent | null>(
    null
  );
  const [stats, setStats] = useState<GroupAgentStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<GroupAgentFilters>({});

  // Load group agents
  const loadGroupAgents = useCallback(
    async (params?: PageRequest & GroupAgentFilters) => {
      if (!isAuthenticated) {
        console.log(
          "GroupAgentsContext - User not authenticated, skipping API call"
        );
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const requestParams = {
          page: currentPage,
          size: pageSize,
          ...filters,
          ...params,
        };

        console.log(
          "GroupAgentsContext - Loading group agents with params:",
          requestParams
        );

        const response = await groupAgentsService.getGroupAgents(requestParams);

        console.log("GroupAgentsContext - Group agents loaded:", response);

        if (response && response.data) {
          const transformedGroupAgents = response.data.map(
            (groupAgent: GroupAgentResponseDto) =>
              transformGroupAgentResponse(groupAgent)
          );
          console.log(
            "GroupAgentsContext - Transformed group agents:",
            transformedGroupAgents
          );
          setGroupAgents(transformedGroupAgents);
          setTotalPages(response.totalPages);
          setTotalItems(response.totalElements);
        }
      } catch (err) {
        console.error("GroupAgentsContext - Error loading group agents:", err);
        setError("Failed to load group agents");
        setGroupAgents([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, currentPage, pageSize, filters]
  );

  // Load group agent details
  const loadGroupAgentDetails = useCallback(
    async (uid: string) => {
      if (!isAuthenticated) {
        console.log(
          "GroupAgentsContext - User not authenticated, skipping API call"
        );
        return;
      }

      try {
        setError(null);
        console.log(
          "GroupAgentsContext - Loading group agent details for:",
          uid
        );

        const response = await groupAgentsService.getGroupAgentByUid(uid);

        console.log(
          "GroupAgentsContext - Group agent details loaded:",
          response
        );

        if (response) {
          setCurrentGroupAgent(transformGroupAgentResponse(response));
        }
      } catch (err) {
        console.error(
          "GroupAgentsContext - Error loading group agent details:",
          err
        );
        setError("Failed to load group agent details");
        setCurrentGroupAgent(null);
      }
    },
    [isAuthenticated]
  );

  // Load group agent statistics
  const loadGroupAgentStats = useCallback(async () => {
    if (!isAuthenticated) {
      console.log(
        "GroupAgentsContext - User not authenticated, skipping API call"
      );
      return;
    }

    try {
      setIsStatsLoading(true);
      setError(null);

      console.log("GroupAgentsContext - Loading group agent statistics");

      const response = await groupAgentsService.getGroupAgentStats();

      console.log(
        "GroupAgentsContext - Group agent statistics loaded:",
        response
      );

      if (response) {
        setStats(response);
      }
    } catch (err) {
      console.error(
        "GroupAgentsContext - Error loading group agent statistics:",
        err
      );
      setError("Failed to load group agent statistics");
      setStats(null);
    } finally {
      setIsStatsLoading(false);
    }
  }, [isAuthenticated]);

  // Search group agents
  const searchGroupAgents = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setCurrentPage(0); // Reset to first page when searching
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calculate statistics from current group agents data
  const calculateStatsFromGroupAgents = useCallback(() => {
    const totalGroupAgents = groupAgents.length;
    const activeGroupAgents = groupAgents.filter(
      (g) => g.status === "ACTIVE"
    ).length;
    const inactiveGroupAgents = groupAgents.filter(
      (g) => g.status === "INACTIVE"
    ).length;
    const suspendedGroupAgents = groupAgents.filter(
      (g) => g.status === "SUSPENDED"
    ).length;
    const pendingGroupAgents = groupAgents.filter(
      (g) => g.status === "PENDING"
    ).length;
    const totalAgents = groupAgents.reduce((sum, g) => sum + g.agentCount, 0);
    const totalBusCoreSystems = groupAgents.reduce(
      (sum, g) => sum + g.busCoreSystemCount,
      0
    );
    const averageAgentsPerGroup =
      totalGroupAgents > 0 ? totalAgents / totalGroupAgents : 0;
    const averageBusCoreSystemsPerGroup =
      totalGroupAgents > 0 ? totalBusCoreSystems / totalGroupAgents : 0;

    // Count by status
    const groupAgentsByStatus = groupAgents.reduce((acc, groupAgent) => {
      acc[groupAgent.status] = (acc[groupAgent.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count by type
    const groupAgentsByType = groupAgents.reduce((acc, groupAgent) => {
      acc[groupAgent.type] = (acc[groupAgent.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGroupAgents,
      activeGroupAgents,
      inactiveGroupAgents,
      suspendedGroupAgents,
      pendingGroupAgents,
      totalAgents,
      totalBusCoreSystems,
      averageAgentsPerGroup,
      averageBusCoreSystemsPerGroup,
      groupAgentsByStatus,
      groupAgentsByType,
    };
  }, [groupAgents]);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      console.log("GroupAgentsContext - Loading initial data");
      loadGroupAgents({ page: 0, size: 20 });
    }
  }, [isAuthenticated]); // Run when authentication status changes

  // Reload data when filters or pagination change
  useEffect(() => {
    if (isAuthenticated) {
      loadGroupAgents();
    }
  }, [isAuthenticated, loadGroupAgents]);

  const value: GroupAgentsContextType = {
    // Data
    groupAgents,
    currentGroupAgent,
    stats,

    // Loading states
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
    loadGroupAgents,
    loadGroupAgentDetails,
    loadGroupAgentStats,
    setFilters,
    setCurrentPage,
    setPageSize,
    searchGroupAgents,
    clearError,

    // Statistics calculation
    calculateStatsFromGroupAgents,
  };

  return (
    <GroupAgentsContext.Provider value={value}>
      {children}
    </GroupAgentsContext.Provider>
  );
}
