"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { superAgentsService } from "@/lib/api/services";
import type {
  AgentResponseDto,
  AgentSummaryDto,
  SuperAgentStatistics,
  CreateSuperAgentRequestDto,
  SuperAgentSearchRequestDto,
  PageRequest,
} from "@/lib/api/types";
import type { PaginatedResponse, ApiResponse } from "@/lib/api/client";
import { useUser } from "./UserContext";

export interface SuperAgent {
  id: number;
  uid: string;
  agentNumber: string;
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessAddress?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  status:
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "PENDING_VERIFICATION"
    | "REJECTED"
    | "TERMINATED";
  verified: boolean;
  contactPersonName: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  description?: string;
  partnerUid: string;
  partnerName?: string;
  partnerCode?: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAgentFilters {
  status?: string;
  partnerUid?: string;
  search?: string;
}

interface SuperAgentsContextType {
  // State
  superAgents: SuperAgent[];
  currentSuperAgent: SuperAgent | null;
  stats: SuperAgentStatistics | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Filters
  filters: SuperAgentFilters;

  // Actions
  loadSuperAgents: (params?: PageRequest) => Promise<void>;
  loadSuperAgentByUid: (uid: string) => Promise<void>;
  createSuperAgent: (
    superAgent: CreateSuperAgentRequestDto
  ) => Promise<ApiResponse<AgentResponseDto>>;
  updateSuperAgentStatus: (uid: string, status: string) => Promise<void>;
  assignSuperAgent: (
    superAgentUid: string,
    subAgentUid: string
  ) => Promise<void>;
  removeSuperAgent: (subAgentUid: string) => Promise<void>;
  searchSuperAgents: (
    searchRequest: SuperAgentSearchRequestDto
  ) => Promise<void>;
  loadSuperAgentsByPartner: (
    partnerUid: string,
    params?: PageRequest
  ) => Promise<void>;
  loadSubAgents: (superAgentUid: string, params?: PageRequest) => Promise<void>;
  loadSubAgentsCount: (superAgentUid: string) => Promise<number | null>;
  loadAgentHierarchy: (
    superAgentUid: string
  ) => Promise<AgentResponseDto[] | null>;
  loadSuperAgentStatistics: () => Promise<void>;

  // UI State Management
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: SuperAgentFilters) => void;
  clearError: () => void;
  clearCurrentSuperAgent: () => void;
}

const SuperAgentsContext = createContext<SuperAgentsContextType | undefined>(
  undefined
);

export function SuperAgentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUser();

  // State
  const [superAgents, setSuperAgents] = useState<SuperAgent[]>([]);
  const [currentSuperAgent, setCurrentSuperAgent] = useState<SuperAgent | null>(
    null
  );
  const [stats, setStats] = useState<SuperAgentStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<SuperAgentFilters>({});

  // Helper function to transform API response to SuperAgent interface
  const transformSuperAgentResponse = useCallback(
    (response: AgentResponseDto): SuperAgent => {
      return {
        id: response.id,
        uid: response.uid,
        agentNumber: response.code || "",
        businessName: response.businessName || "",
        legalName: response.businessName || "",
        email: response.businessEmail || "",
        phoneNumber: response.phoneNumber || "",
        businessRegistrationNumber: "",
        taxIdentificationNumber: "",
        businessAddress: response.businessAddress || "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        status: response.status as
          | "ACTIVE"
          | "INACTIVE"
          | "SUSPENDED"
          | "PENDING_VERIFICATION"
          | "REJECTED"
          | "TERMINATED",
        verified: false,
        contactPersonName: response.contactPerson || "",
        contactPersonEmail: "",
        contactPersonPhone: "",
        description: "",
        partnerUid: "",
        partnerName: "",
        partnerCode: "",
        registrationDate: response.registrationDate || "",
        createdAt: "",
        updatedAt: "",
      };
    },
    []
  );

  // Helper function to transform summary response to SuperAgent interface
  const transformSuperAgentSummary = useCallback(
    (summary: AgentSummaryDto): SuperAgent => {
      return {
        id: summary.id,
        uid: summary.uid,
        agentNumber: summary.code || "",
        businessName: summary.businessName || "",
        legalName: summary.businessName || "",
        email: "",
        phoneNumber: "",
        businessRegistrationNumber: "",
        taxIdentificationNumber: "",
        businessAddress: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        status: summary.status as
          | "ACTIVE"
          | "INACTIVE"
          | "SUSPENDED"
          | "PENDING_VERIFICATION"
          | "REJECTED"
          | "TERMINATED",
        verified: false,
        contactPersonName: summary.contactPerson || "",
        contactPersonEmail: "",
        contactPersonPhone: "",
        description: "",
        partnerUid: "",
        partnerName: summary.partnerBusinessName || "",
        partnerCode: summary.partnerCode || "",
        registrationDate: summary.registrationDate || "",
        createdAt: "",
        updatedAt: "",
      };
    },
    []
  );

  // Load super agents with pagination
  const loadSuperAgents = useCallback(
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

        const response = await superAgentsService.getSuperAgents(requestParams);

        if (response.status && response.data) {
          const transformedSuperAgents = response.data.map(
            transformSuperAgentSummary
          );
          setSuperAgents(transformedSuperAgents);
          setTotalPages(response.totalPages || 0);
          setTotalItems(response.totalElements || 0);
        } else {
          throw new Error(response.message || "Failed to load super agents");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load super agents";
        setError(errorMessage);
        console.error("Error loading super agents:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentPage,
      pageSize,
      filters.status,
      filters.partnerUid,
      filters.search,
      transformSuperAgentSummary,
    ]
  );

  // Load super agent by UID
  const loadSuperAgentByUid = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await superAgentsService.getSuperAgentByUid(uid);

      if (response.status && response.data) {
        const transformedSuperAgent = transformSuperAgentResponse(
          response.data
        );
        setCurrentSuperAgent(transformedSuperAgent);
      } else {
        throw new Error(response.message || "Super agent not found");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load super agent";
      setError(errorMessage);
      console.error("Error loading super agent by UID:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create super agent
  const createSuperAgent = async (
    superAgent: CreateSuperAgentRequestDto
  ): Promise<ApiResponse<AgentResponseDto>> => {
    try {
      setError(null);
      const response = await superAgentsService.createSuperAgent(superAgent);

      if (response.status && response.data) {
        // Reload super agents list to include the new super agent
        await loadSuperAgents();
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create super agent";
      setError(errorMessage);
      throw err;
    }
  };

  // Update super agent status
  const updateSuperAgentStatus = async (uid: string, status: string) => {
    try {
      setError(null);
      const response = await superAgentsService.updateSuperAgentStatus(
        uid,
        status
      );

      if (response.status && response.data) {
        // Update current super agent if it's the one being updated
        if (currentSuperAgent && currentSuperAgent.uid === uid) {
          const transformedSuperAgent = transformSuperAgentResponse(
            response.data
          );
          setCurrentSuperAgent(transformedSuperAgent);
        }
        // Reload super agents list
        await loadSuperAgents();
      } else {
        throw new Error(
          response.message || "Failed to update super agent status"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update super agent status";
      setError(errorMessage);
      throw err;
    }
  };

  // Assign super agent to sub-agent
  const assignSuperAgent = async (
    superAgentUid: string,
    subAgentUid: string
  ) => {
    try {
      setError(null);
      const response = await superAgentsService.assignSuperAgent(
        superAgentUid,
        subAgentUid
      );

      if (response.status && response.data) {
        // Reload super agents list
        await loadSuperAgents();
      } else {
        throw new Error(response.message || "Failed to assign super agent");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to assign super agent";
      setError(errorMessage);
      throw err;
    }
  };

  // Remove super agent from sub-agent
  const removeSuperAgent = async (subAgentUid: string) => {
    try {
      setError(null);
      const response = await superAgentsService.removeSuperAgent(subAgentUid);

      if (response.status && response.data) {
        // Reload super agents list
        await loadSuperAgents();
      } else {
        throw new Error(response.message || "Failed to remove super agent");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove super agent";
      setError(errorMessage);
      throw err;
    }
  };

  // Search super agents
  const searchSuperAgents = useCallback(
    async (searchRequest: SuperAgentSearchRequestDto) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await superAgentsService.searchSuperAgents(
          searchRequest
        );

        if (response.status && response.data) {
          const transformedSuperAgents = response.data.map(
            transformSuperAgentSummary
          );
          setSuperAgents(transformedSuperAgents);
          setTotalPages(response.totalPages || 0);
          setTotalItems(response.totalElements || 0);
        } else {
          throw new Error(response.message || "Failed to search super agents");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search super agents";
        setError(errorMessage);
        console.error("Error searching super agents:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [transformSuperAgentSummary]
  );

  // Load super agents by partner
  const loadSuperAgentsByPartner = async (
    partnerUid: string,
    params?: PageRequest
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const requestParams = {
        page: currentPage,
        size: pageSize,
        ...params,
      };

      const response = await superAgentsService.getSuperAgentsByPartner(
        partnerUid,
        requestParams
      );

      if (response.status && response.data) {
        const transformedSuperAgents = response.data.map(
          transformSuperAgentSummary
        );
        setSuperAgents(transformedSuperAgents);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalElements || 0);
      } else {
        throw new Error(
          response.message || "Failed to load super agents by partner"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load super agents by partner";
      setError(errorMessage);
      console.error("Error loading super agents by partner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load sub-agents
  const loadSubAgents = async (superAgentUid: string, params?: PageRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const requestParams = {
        page: currentPage,
        size: pageSize,
        ...params,
      };

      const response = await superAgentsService.getSubAgents(
        superAgentUid,
        requestParams
      );

      if (response.status && response.data) {
        const transformedSuperAgents = response.data.map(
          transformSuperAgentSummary
        );
        setSuperAgents(transformedSuperAgents);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalElements || 0);
      } else {
        throw new Error(response.message || "Failed to load sub-agents");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load sub-agents";
      setError(errorMessage);
      console.error("Error loading sub-agents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load sub-agents count
  const loadSubAgentsCount = async (
    superAgentUid: string
  ): Promise<number | null> => {
    try {
      setError(null);
      const response = await superAgentsService.getSubAgentsCount(
        superAgentUid
      );

      if (response.status && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to load sub-agents count");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load sub-agents count";
      setError(errorMessage);
      return null;
    }
  };

  // Load agent hierarchy
  const loadAgentHierarchy = async (
    superAgentUid: string
  ): Promise<AgentResponseDto[] | null> => {
    try {
      setError(null);
      const response = await superAgentsService.getAgentHierarchy(
        superAgentUid
      );

      if (response.status && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to load agent hierarchy");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load agent hierarchy";
      setError(errorMessage);
      return null;
    }
  };

  // Load super agent statistics
  const loadSuperAgentStatistics = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      setError(null);

      const response = await superAgentsService.getSuperAgentStatistics();

      if (response.status && response.data) {
        setStats(response.data);
      } else {
        throw new Error(
          response.message || "Failed to load super agent statistics"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load super agent statistics";
      setError(errorMessage);
      console.error("Error loading super agent statistics:", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, [transformSuperAgentSummary]);

  // UI State Management
  const clearError = () => setError(null);
  const clearCurrentSuperAgent = () => setCurrentSuperAgent(null);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      loadSuperAgents();
      loadSuperAgentStatistics();
    }
  }, [isAuthenticated, loadSuperAgents, loadSuperAgentStatistics]);

  const value: SuperAgentsContextType = {
    // State
    superAgents,
    currentSuperAgent,
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
    loadSuperAgents,
    loadSuperAgentByUid,
    createSuperAgent,
    updateSuperAgentStatus,
    assignSuperAgent,
    removeSuperAgent,
    searchSuperAgents,
    loadSuperAgentsByPartner,
    loadSubAgents,
    loadSubAgentsCount,
    loadAgentHierarchy,
    loadSuperAgentStatistics,

    // UI State Management
    setCurrentPage,
    setPageSize,
    setFilters,
    clearError,
    clearCurrentSuperAgent,
  };

  return (
    <SuperAgentsContext.Provider value={value}>
      {children}
    </SuperAgentsContext.Provider>
  );
}

export function useSuperAgents() {
  const context = useContext(SuperAgentsContext);
  if (context === undefined) {
    throw new Error("useSuperAgents must be used within a SuperAgentsProvider");
  }
  return context;
}
