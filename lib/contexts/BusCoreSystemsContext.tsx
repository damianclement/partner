"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "./UserContext";
import { busCoreSystemsService } from "@/lib/api/services";
import type {
  BusCoreSystemResponseDto,
  BusCoreSystemFilters,
  PageRequest,
} from "@/lib/api/types";

// Bus Core System interface for UI
export interface BusCoreSystem {
  id: number;
  uid: string;
  code: string;
  name: string;
  providerName: string;
  baseUrl: string;
  description: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface BusCoreSystemsContextType {
  // Data
  busCoreSystems: BusCoreSystem[];
  currentBusCoreSystem: BusCoreSystem | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Filters
  filters: BusCoreSystemFilters;

  // Actions
  loadBusCoreSystems: (
    params?: PageRequest & BusCoreSystemFilters
  ) => Promise<void>;
  loadBusCoreSystemDetails: (uid: string) => Promise<void>;
  setFilters: (filters: BusCoreSystemFilters) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  searchBusCoreSystems: (searchTerm: string) => void;
  clearError: () => void;

  // Statistics calculation
  calculateStatsFromBusCoreSystems: () => {
    totalBusCoreSystems: number;
    defaultBusCoreSystems: number;
    providers: string[];
    averageSystemsPerProvider: number;
  };
}

const BusCoreSystemsContext = createContext<
  BusCoreSystemsContextType | undefined
>(undefined);

export function useBusCoreSystems() {
  const context = useContext(BusCoreSystemsContext);
  if (!context) {
    throw new Error(
      "useBusCoreSystems must be used within a BusCoreSystemsProvider"
    );
  }
  return context;
}

// Transform API response to UI-friendly format
const transformBusCoreSystemResponse = (
  response: BusCoreSystemResponseDto
): BusCoreSystem => {
  return {
    id: response.id,
    uid: response.uid,
    code: response.code,
    name: response.name,
    providerName: response.providerName,
    baseUrl: response.baseUrl,
    description: response.description,
    isDefault: response.isDefault,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    createdBy: response.createdBy,
    updatedBy: response.updatedBy,
  };
};

export function BusCoreSystemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useUser();

  // State
  const [busCoreSystems, setBusCoreSystems] = useState<BusCoreSystem[]>([]);
  const [currentBusCoreSystem, setCurrentBusCoreSystem] =
    useState<BusCoreSystem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<BusCoreSystemFilters>({});

  // Load bus core systems
  const loadBusCoreSystems = useCallback(
    async (params?: PageRequest & BusCoreSystemFilters) => {
      if (!isAuthenticated) {
        console.log(
          "BusCoreSystemsContext - User not authenticated, skipping API call"
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
          "BusCoreSystemsContext - Loading bus core systems with params:",
          requestParams
        );

        const response = await busCoreSystemsService.getBusCoreSystems(
          requestParams
        );

        console.log(
          "BusCoreSystemsContext - Bus core systems loaded:",
          response
        );

        if (response && response.data) {
          const transformedBusCoreSystems = response.data.map(
            (busCoreSystem: BusCoreSystemResponseDto) =>
              transformBusCoreSystemResponse(busCoreSystem)
          );
          console.log(
            "BusCoreSystemsContext - Transformed systems:",
            transformedBusCoreSystems
          );
          setBusCoreSystems(transformedBusCoreSystems);
          setTotalPages(response.totalPages);
          setTotalItems(response.totalElements);
        }
      } catch (err) {
        console.error(
          "BusCoreSystemsContext - Error loading bus core systems:",
          err
        );
        setError("Failed to load bus core systems");
        setBusCoreSystems([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, currentPage, pageSize, filters]
  );

  // Load bus core system details
  const loadBusCoreSystemDetails = useCallback(
    async (uid: string) => {
      if (!isAuthenticated) {
        console.log(
          "BusCoreSystemsContext - User not authenticated, skipping API call"
        );
        return;
      }

      try {
        setError(null);
        console.log(
          "BusCoreSystemsContext - Loading bus core system details for:",
          uid
        );

        const response = await busCoreSystemsService.getBusCoreSystemByUid(uid);

        console.log(
          "BusCoreSystemsContext - Bus core system details loaded:",
          response
        );

        if (response) {
          setCurrentBusCoreSystem(transformBusCoreSystemResponse(response));
        }
      } catch (err) {
        console.error(
          "BusCoreSystemsContext - Error loading bus core system details:",
          err
        );
        setError("Failed to load bus core system details");
        setCurrentBusCoreSystem(null);
      }
    },
    [isAuthenticated]
  );

  // Search bus core systems
  const searchBusCoreSystems = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setCurrentPage(0); // Reset to first page when searching
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Calculate statistics from current bus core systems data
  const calculateStatsFromBusCoreSystems = useCallback(() => {
    const totalBusCoreSystems = busCoreSystems.length;
    const defaultBusCoreSystems = busCoreSystems.filter(
      (b) => b.isDefault
    ).length;
    const providers = [...new Set(busCoreSystems.map((b) => b.providerName))];
    const averageSystemsPerProvider =
      providers.length > 0 ? totalBusCoreSystems / providers.length : 0;

    return {
      totalBusCoreSystems,
      defaultBusCoreSystems,
      providers,
      averageSystemsPerProvider,
    };
  }, [busCoreSystems]);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      console.log("BusCoreSystemsContext - Loading initial data");
      loadBusCoreSystems({ page: 0, size: 20 });
    }
  }, [isAuthenticated]); // Run when authentication status changes

  // Reload data when filters or pagination change
  useEffect(() => {
    if (isAuthenticated) {
      loadBusCoreSystems();
    }
  }, [isAuthenticated, loadBusCoreSystems]);

  const value: BusCoreSystemsContextType = {
    // Data
    busCoreSystems,
    currentBusCoreSystem,

    // Loading states
    isLoading,
    error,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    totalItems,

    // Filters
    filters,

    // Actions
    loadBusCoreSystems,
    loadBusCoreSystemDetails,
    setFilters,
    setCurrentPage,
    setPageSize,
    searchBusCoreSystems,
    clearError,

    // Statistics calculation
    calculateStatsFromBusCoreSystems,
  };

  return (
    <BusCoreSystemsContext.Provider value={value}>
      {children}
    </BusCoreSystemsContext.Provider>
  );
}
