"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { agentsService } from "@/lib/api/services";
import type {
  AgentResponseDto,
  AgentSummaryDto,
  AgentListParams,
  AgentStats,
  AgentFilters,
  UpdateAgentStatusRequestDto,
  CreateSuperAgentRequestDto,
  AgentPasswordResetResponseDto,
  PageRequest,
} from "@/lib/api/types";
import type { PaginatedResponse, ApiResponse } from "@/lib/api/client";
import { useUser } from "./UserContext";

export interface Agent {
  id: number;
  uid: string;
  code: string;
  partnerAgentNumber: string;
  passName: string;
  businessName: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  agentType: "Individual" | "Corporate" | "Agency";
  partner: {
    code: string;
    businessName: string;
  };
  status: "active" | "inactive" | "suspended" | "pending";
  registrationDate: string;
}

interface AgentsContextType {
  // State
  agents: Agent[];
  currentAgent: Agent | null;
  stats: AgentStats | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Filters
  filters: AgentFilters;

  // Actions
  loadAgents: (params?: AgentListParams) => Promise<void>;
  loadAgentByUid: (uid: string) => Promise<void>;
  loadStats: () => Promise<void>;
  searchAgents: (searchTerm: string) => Promise<void>;
  updateAgentStatus: (
    uid: string,
    request: UpdateAgentStatusRequestDto
  ) => Promise<void>;
  resetAgentPassword: (
    uid: string,
    sendEmail?: boolean,
    sendSms?: boolean
  ) => Promise<AgentPasswordResetResponseDto>;
  createSuperAgent: (request: CreateSuperAgentRequestDto) => Promise<void>;

  // Utility functions
  setFilters: (filters: AgentFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearError: () => void;
  clearCurrentAgent: () => void;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export function useAgents() {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error("useAgents must be used within an AgentsProvider");
  }
  return context;
}

export function AgentsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();

  // State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<AgentFilters>({});

  // Transform API response to UI format
  const transformAgentSummary = (apiAgent: AgentSummaryDto): Agent => ({
    id: apiAgent.id,
    uid: apiAgent.uid,
    code: apiAgent.code,
    partnerAgentNumber: apiAgent.partnerAgentNumber,
    passName: apiAgent.passName,
    businessName: apiAgent.businessName,
    contactPerson: {
      name: apiAgent.contactPerson,
      email: "", // Not available in summary
      phone: "", // Not available in summary
    },
    agentType:
      apiAgent.agentType === "INDIVIDUAL"
        ? "Individual"
        : apiAgent.agentType === "COMPANY"
        ? "Corporate"
        : "Agency",
    partner: {
      code: apiAgent.partnerCode,
      businessName: apiAgent.partnerBusinessName,
    },
    status:
      apiAgent.status === "ACTIVE"
        ? "active"
        : apiAgent.status === "INACTIVE"
        ? "inactive"
        : apiAgent.status === "SUSPENDED"
        ? "suspended"
        : "pending",
    registrationDate: apiAgent.registrationDate,
  });

  const transformAgentResponse = (apiAgent: AgentResponseDto): Agent => ({
    id: apiAgent.id,
    uid: apiAgent.uid,
    code: apiAgent.code,
    partnerAgentNumber: apiAgent.partnerAgentNumber,
    passName: apiAgent.passName,
    businessName: apiAgent.businessName,
    contactPerson: {
      name: apiAgent.contactPerson,
      email: apiAgent.businessEmail,
      phone: apiAgent.phoneNumber,
    },
    agentType:
      apiAgent.agentType === "INDIVIDUAL"
        ? "Individual"
        : apiAgent.agentType === "COMPANY"
        ? "Corporate"
        : "Agency",
    partner: {
      code: apiAgent.partnerCode,
      businessName: apiAgent.partnerBusinessName,
    },
    status:
      apiAgent.status === "ACTIVE"
        ? "active"
        : apiAgent.status === "INACTIVE"
        ? "inactive"
        : apiAgent.status === "SUSPENDED"
        ? "suspended"
        : "pending",
    registrationDate: apiAgent.registrationDate,
  });

  // Load agents with pagination and filters
  const loadAgents = async (params?: AgentListParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const requestParams: AgentListParams = {
        page: currentPage,
        size: pageSize,
        sortBy: "createdAt",
        sortDir: "desc",
        filters,
        ...params,
      };

      const response = await agentsService.getAgents(requestParams);

      if (response.status && response.data) {
        const transformedAgents = response.data.map(transformAgentSummary);
        setAgents(transformedAgents);

        // Update pagination info
        if (response.totalPages !== undefined) {
          setTotalPages(response.totalPages);
          setTotalItems(response.totalElements);
        }
      } else {
        throw new Error(response.message || "Failed to load agents");
      }
    } catch (err) {
      console.error("Error loading agents:", err);
      setError(err instanceof Error ? err.message : "Failed to load agents");
    } finally {
      setIsLoading(false);
    }
  };

  // Load specific agent by UID
  const loadAgentByUid = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await agentsService.getAgentByUid(uid);

      if (response.status && response.data) {
        const transformedAgent = transformAgentResponse(response.data);
        setCurrentAgent(transformedAgent);
      } else {
        throw new Error(response.message || "Failed to load agent");
      }
    } catch (err) {
      console.error("Error loading agent:", err);
      setError(err instanceof Error ? err.message : "Failed to load agent");
    } finally {
      setIsLoading(false);
    }
  };

  // Load agent statistics
  const loadStats = async () => {
    try {
      setIsStatsLoading(true);
      setError(null);

      const statsData = await agentsService.getAgentStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading agent stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load agent statistics"
      );
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Search agents
  const searchAgents = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await agentsService.searchAgents(searchTerm, filters, {
        page: currentPage,
        size: pageSize,
        sortBy: "createdAt",
        sortDir: "desc",
      });

      if (response.status && response.data) {
        const transformedAgents = response.data.map(transformAgentSummary);
        setAgents(transformedAgents);

        if (response.totalPages !== undefined) {
          setTotalPages(response.totalPages);
          setTotalItems(response.totalElements);
        }
      } else {
        throw new Error(response.message || "Failed to search agents");
      }
    } catch (err) {
      console.error("Error searching agents:", err);
      setError(err instanceof Error ? err.message : "Failed to search agents");
    } finally {
      setIsLoading(false);
    }
  };

  // Update agent status
  const updateAgentStatus = async (
    uid: string,
    request: UpdateAgentStatusRequestDto
  ) => {
    try {
      setError(null);

      const response = await agentsService.updateAgentStatus(uid, request);

      if (response.status) {
        // Reload agents to reflect the change
        await loadAgents();
      } else {
        throw new Error(response.message || "Failed to update agent status");
      }
    } catch (err) {
      console.error("Error updating agent status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update agent status"
      );
      throw err;
    }
  };

  // Reset agent password
  const resetAgentPassword = async (
    uid: string,
    sendEmail: boolean = true,
    sendSms: boolean = true
  ): Promise<AgentPasswordResetResponseDto> => {
    try {
      setError(null);

      const response = await agentsService.resetAgentPassword(
        uid,
        sendEmail,
        sendSms
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to reset agent password");
      }

      return response.data;
    } catch (err) {
      console.error("Error resetting agent password:", err);
      setError(
        err instanceof Error ? err.message : "Failed to reset agent password"
      );
      throw err;
    }
  };

  // Create super agent
  const createSuperAgent = async (request: CreateSuperAgentRequestDto) => {
    try {
      setError(null);

      const response = await agentsService.createSuperAgent(request);

      if (response.status) {
        // Reload agents to show the new agent
        await loadAgents();
      } else {
        throw new Error(response.message || "Failed to create super agent");
      }
    } catch (err) {
      console.error("Error creating super agent:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create super agent"
      );
      throw err;
    }
  };

  // Utility functions
  const clearError = () => setError(null);
  const clearCurrentAgent = () => setCurrentAgent(null);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      loadAgents();
      loadStats();
    }
  }, [isAuthenticated, currentPage, pageSize, filters]);

  const value: AgentsContextType = {
    // State
    agents,
    currentAgent,
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
    loadAgents,
    loadAgentByUid,
    loadStats,
    searchAgents,
    updateAgentStatus,
    resetAgentPassword,
    createSuperAgent,

    // Utility functions
    setFilters,
    setPage: setCurrentPage,
    setPageSize,
    clearError,
    clearCurrentAgent,
  };

  return (
    <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>
  );
}
