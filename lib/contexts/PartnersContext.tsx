"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { partnersService } from "@/lib/api/services";
import type {
  PartnerResponseDto,
  PartnerSummaryDto,
  PartnerStatistics,
  UpdatePartnerRequestDto,
  CreatePartnerRequestDto,
  PartnerSearchRequestDto,
  ApiKeySummary,
  CreateApiKeyRequestDto,
  ApiKeyStatus,
  BulkUpdateTierRequestDto,
  BulkUpdateStatusRequestDto,
  PageRequest,
} from "@/lib/api/types";
import type { PaginatedResponse, ApiResponse } from "@/lib/api/client";
import { useUser } from "./UserContext";

export interface Partner {
  id: number;
  uid: string;
  code: string;
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessAddress?: string;
  type: "INDIVIDUAL" | "COMPANY";
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  commissionRate: number;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  status:
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "PENDING_VERIFICATION"
    | "REJECTED"
    | "TERMINATED";
  verified: boolean;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerFilters {
  status?: string;
  tier?: string;
  type?: string;
  verified?: boolean;
  search?: string;
}

interface PartnersContextType {
  // State
  partners: Partner[];
  currentPartner: Partner | null;
  stats: PartnerStatistics | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Filters
  filters: PartnerFilters;

  // API Keys
  apiKeys: ApiKeySummary[];
  isApiKeysLoading: boolean;
  apiKeysError: string | null;

  // Actions
  loadPartners: (params?: PageRequest) => Promise<void>;
  loadPartnerByUid: (uid: string) => Promise<void>;
  loadPartnerById: (id: number) => Promise<void>;
  loadPartnerByCode: (code: string) => Promise<void>;
  createPartner: (
    partner: CreatePartnerRequestDto
  ) => Promise<ApiResponse<PartnerResponseDto>>;
  updatePartner: (
    id: number,
    partner: UpdatePartnerRequestDto
  ) => Promise<ApiResponse<PartnerResponseDto>>;
  updatePartnerByUid: (
    uid: string,
    partner: UpdatePartnerRequestDto
  ) => Promise<ApiResponse<PartnerResponseDto>>;
  searchPartners: (searchRequest: PartnerSearchRequestDto) => Promise<void>;
  loadPartnersByTier: (tier: string, params?: PageRequest) => Promise<void>;
  loadPartnersByStatus: (status: string, params?: PageRequest) => Promise<void>;
  loadPartnerStatistics: () => Promise<void>;

  // Partner Actions
  verifyPartner: (id: number) => Promise<void>;
  unverifyPartner: (id: number) => Promise<void>;
  activatePartner: (id: number) => Promise<void>;
  deactivatePartner: (id: number) => Promise<void>;
  setPartnerTier: (id: number, tier: string) => Promise<void>;
  setPartnerStatus: (id: number, status: string) => Promise<void>;
  setPartnerCommission: (id: number, commissionRate: number) => Promise<void>;
  softDeletePartner: (id: number) => Promise<void>;
  bulkUpdateTiers: (request: BulkUpdateTierRequestDto) => Promise<void>;
  bulkUpdateStatuses: (request: BulkUpdateStatusRequestDto) => Promise<void>;

  // API Key Management
  loadPartnerApiKeys: (partnerUid: string) => Promise<void>;
  loadPartnerActiveApiKeys: (partnerUid: string) => Promise<void>;
  generateApiKey: (
    partnerUid: string,
    request: CreateApiKeyRequestDto
  ) => Promise<ApiResponse<any>>;
  regenerateApiKey: (partnerUid: string) => Promise<ApiResponse<any>>;
  enablePartnerApiKey: (partnerUid: string) => Promise<void>;
  disablePartnerApiKey: (partnerUid: string) => Promise<void>;
  deletePartnerApiKey: (partnerUid: string) => Promise<void>;
  loadApiKeyStatus: (apiKeyUid: string) => Promise<ApiKeyStatus | null>;
  deleteApiKey: (apiKeyUid: string) => Promise<void>;
  enableApiKeyByUid: (apiKeyUid: string) => Promise<void>;
  disableApiKeyByUid: (apiKeyUid: string) => Promise<void>;

  // UI State Management
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: PartnerFilters) => void;
  clearError: () => void;
  clearCurrentPartner: () => void;
  clearApiKeysError: () => void;
}

const PartnersContext = createContext<PartnersContextType | undefined>(
  undefined
);

export function PartnersProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();

  // State
  const [partners, setPartners] = useState<Partner[]>([]);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState<PartnerStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<PartnerFilters>({});

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeySummary[]>([]);
  const [isApiKeysLoading, setIsApiKeysLoading] = useState(false);
  const [apiKeysError, setApiKeysError] = useState<string | null>(null);

  // Helper function to transform API response to Partner interface
  const transformPartnerResponse = (response: PartnerResponseDto): Partner => {
    return {
      id: response.id,
      uid: response.uid,
      code: response.code,
      businessName: response.businessName,
      legalName: response.legalName,
      email: response.email,
      phoneNumber: response.phoneNumber,
      businessRegistrationNumber: response.businessRegistrationNumber,
      taxIdentificationNumber: response.taxIdentificationNumber,
      businessAddress: response.businessAddress,
      type: response.type,
      tier: response.tier,
      commissionRate: response.commissionRate,
      contactPerson: {
        name: response.contactPersonName || "",
        email: response.contactPersonEmail || "",
        phone: response.contactPersonPhone || "",
      },
      location: {
        city: response.city || "",
        state: response.state || "",
        country: response.country || "",
        postalCode: response.postalCode,
      },
      status: response.status,
      verified: response.isVerified,
      description: response.description,
      notes: response.notes,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  };

  // Helper function to transform summary response to Partner interface
  const transformPartnerSummary = (summary: PartnerSummaryDto): Partner => {
    return {
      id: summary.id,
      uid: summary.uid,
      code: summary.code,
      businessName: summary.businessName,
      legalName: summary.legalName || summary.businessName,
      email: summary.email,
      phoneNumber: summary.phoneNumber || "",
      businessRegistrationNumber: "",
      taxIdentificationNumber: "",
      businessAddress: "",
      type: summary.type,
      tier: summary.tier,
      commissionRate: summary.commissionRate,
      contactPerson: {
        name: summary.contactPersonName || "",
        email: "",
        phone: "",
      },
      location: {
        city: summary.city || "",
        state: summary.state || "",
        country: summary.country || "",
        postalCode: "",
      },
      status: summary.status,
      verified: summary.isVerified,
      description: "",
      notes: "",
      createdAt: summary.createdAt,
      updatedAt: summary.createdAt,
    };
  };

  // Load partners with pagination
  const loadPartners = useCallback(
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

        const response = await partnersService.getPartners(requestParams);

        if (response.status && response.data) {
          const transformedPartners = response.data.map(
            transformPartnerSummary
          );
          setPartners(transformedPartners);
          setTotalPages(response.totalPages || 0);
          setTotalItems(response.totalElements || 0);
        } else {
          throw new Error(response.message || "Failed to load partners");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load partners";
        setError(errorMessage);
        console.error("Error loading partners:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize, filters]
  );

  // Load partner by UID
  const loadPartnerByUid = async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await partnersService.getPartnerByUid(uid);

      if (response.status && response.data) {
        const transformedPartner = transformPartnerResponse(response.data);
        setCurrentPartner(transformedPartner);
      } else {
        throw new Error(response.message || "Partner not found");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load partner";
      setError(errorMessage);
      console.error("Error loading partner by UID:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load partner by ID
  const loadPartnerById = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await partnersService.getPartnerById(id);

      if (response.status && response.data) {
        const transformedPartner = transformPartnerResponse(response.data);
        setCurrentPartner(transformedPartner);
      } else {
        throw new Error(response.message || "Partner not found");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load partner";
      setError(errorMessage);
      console.error("Error loading partner by ID:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load partner by code
  const loadPartnerByCode = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await partnersService.getPartnerByCode(code);

      if (response.status && response.data) {
        const transformedPartner = transformPartnerResponse(response.data);
        setCurrentPartner(transformedPartner);
      } else {
        throw new Error(response.message || "Partner not found");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load partner";
      setError(errorMessage);
      console.error("Error loading partner by code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create partner
  const createPartner = async (
    partner: CreatePartnerRequestDto
  ): Promise<ApiResponse<PartnerResponseDto>> => {
    try {
      setError(null);
      const response = await partnersService.createPartner(partner);

      if (response.status && response.data) {
        // Reload partners list to include the new partner
        await loadPartners();
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create partner";
      setError(errorMessage);
      throw err;
    }
  };

  // Update partner
  const updatePartner = async (
    id: number,
    partner: UpdatePartnerRequestDto
  ): Promise<ApiResponse<PartnerResponseDto>> => {
    try {
      setError(null);
      const response = await partnersService.updatePartnerById(id, partner);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update partner";
      setError(errorMessage);
      throw err;
    }
  };

  // Update partner by UID
  const updatePartnerByUid = async (
    uid: string,
    partner: UpdatePartnerRequestDto
  ): Promise<ApiResponse<PartnerResponseDto>> => {
    try {
      setError(null);
      const response = await partnersService.updatePartnerByUid(uid, partner);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.uid === uid) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update partner";
      setError(errorMessage);
      throw err;
    }
  };

  // Search partners
  const searchPartners = async (searchRequest: PartnerSearchRequestDto) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await partnersService.searchPartners(searchRequest);

      if (response.status && response.data) {
        const transformedPartners = response.data.map(transformPartnerSummary);
        setPartners(transformedPartners);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalElements || 0);
      } else {
        throw new Error(response.message || "Failed to search partners");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search partners";
      setError(errorMessage);
      console.error("Error searching partners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load partners by tier
  const loadPartnersByTier = async (tier: string, params?: PageRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const requestParams = {
        page: currentPage,
        size: pageSize,
        ...params,
      };

      const response = await partnersService.getPartnersByTier(
        tier,
        requestParams
      );

      if (response.status && response.data) {
        const transformedPartners = response.data.map(transformPartnerSummary);
        setPartners(transformedPartners);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalElements || 0);
      } else {
        throw new Error(response.message || "Failed to load partners by tier");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load partners by tier";
      setError(errorMessage);
      console.error("Error loading partners by tier:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load partners by status
  const loadPartnersByStatus = async (status: string, params?: PageRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const requestParams = {
        page: currentPage,
        size: pageSize,
        ...params,
      };

      const response = await partnersService.getPartnersByStatus(
        status,
        requestParams
      );

      if (response.status && response.data) {
        const transformedPartners = response.data.map(transformPartnerSummary);
        setPartners(transformedPartners);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalElements || 0);
      } else {
        throw new Error(
          response.message || "Failed to load partners by status"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load partners by status";
      setError(errorMessage);
      console.error("Error loading partners by status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load partner statistics
  const loadPartnerStatistics = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      setError(null);

      const response = await partnersService.getPartnerStatistics();

      if (response.status && response.data) {
        setStats(response.data);
      } else {
        throw new Error(
          response.message || "Failed to load partner statistics"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load partner statistics";
      setError(errorMessage);
      console.error("Error loading partner statistics:", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // Partner Actions
  const verifyPartner = async (id: number) => {
    try {
      setError(null);
      const response = await partnersService.verifyPartner(id);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to verify partner");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify partner";
      setError(errorMessage);
      throw err;
    }
  };

  const unverifyPartner = async (id: number) => {
    try {
      setError(null);
      const response = await partnersService.unverifyPartner(id);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to unverify partner");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unverify partner";
      setError(errorMessage);
      throw err;
    }
  };

  const activatePartner = async (id: number) => {
    try {
      setError(null);
      const response = await partnersService.activatePartner(id);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to activate partner");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to activate partner";
      setError(errorMessage);
      throw err;
    }
  };

  const deactivatePartner = async (id: number) => {
    try {
      setError(null);
      const response = await partnersService.deactivatePartner(id);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to deactivate partner");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to deactivate partner";
      setError(errorMessage);
      throw err;
    }
  };

  const setPartnerTier = async (id: number, tier: string) => {
    try {
      setError(null);
      const response = await partnersService.setPartnerTier(id, tier);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to set partner tier");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to set partner tier";
      setError(errorMessage);
      throw err;
    }
  };

  const setPartnerStatus = async (id: number, status: string) => {
    try {
      setError(null);
      const response = await partnersService.setPartnerStatus(id, status);

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to set partner status");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to set partner status";
      setError(errorMessage);
      throw err;
    }
  };

  const setPartnerCommission = async (id: number, commissionRate: number) => {
    try {
      setError(null);
      const response = await partnersService.setPartnerCommission(
        id,
        commissionRate
      );

      if (response.status && response.data) {
        // Update current partner if it's the one being updated
        if (currentPartner && currentPartner.id === id) {
          const transformedPartner = transformPartnerResponse(response.data);
          setCurrentPartner(transformedPartner);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to set partner commission");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to set partner commission";
      setError(errorMessage);
      throw err;
    }
  };

  const softDeletePartner = async (id: number) => {
    try {
      setError(null);
      const response = await partnersService.softDeletePartner(id);

      if (response.status && response.data) {
        // Clear current partner if it's the one being deleted
        if (currentPartner && currentPartner.id === id) {
          setCurrentPartner(null);
        }
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to delete partner");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete partner";
      setError(errorMessage);
      throw err;
    }
  };

  const bulkUpdateTiers = async (request: BulkUpdateTierRequestDto) => {
    try {
      setError(null);
      const response = await partnersService.bulkUpdateTiers(request);

      if (response.status && response.data) {
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to bulk update tiers");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to bulk update tiers";
      setError(errorMessage);
      throw err;
    }
  };

  const bulkUpdateStatuses = async (request: BulkUpdateStatusRequestDto) => {
    try {
      setError(null);
      const response = await partnersService.bulkUpdateStatuses(request);

      if (response.status && response.data) {
        // Reload partners list
        await loadPartners();
      } else {
        throw new Error(response.message || "Failed to bulk update statuses");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to bulk update statuses";
      setError(errorMessage);
      throw err;
    }
  };

  // API Key Management
  const loadPartnerApiKeys = async (partnerUid: string) => {
    try {
      setIsApiKeysLoading(true);
      setApiKeysError(null);

      const response = await partnersService.getPartnerApiKeys(partnerUid);

      if (response.status && response.data) {
        setApiKeys(response.data);
      } else {
        throw new Error(response.message || "Failed to load API keys");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load API keys";
      setApiKeysError(errorMessage);
      console.error("Error loading API keys:", err);
    } finally {
      setIsApiKeysLoading(false);
    }
  };

  const loadPartnerActiveApiKeys = async (partnerUid: string) => {
    try {
      setIsApiKeysLoading(true);
      setApiKeysError(null);

      const response = await partnersService.getPartnerActiveApiKeys(
        partnerUid
      );

      if (response.status && response.data) {
        setApiKeys(response.data);
      } else {
        throw new Error(response.message || "Failed to load active API keys");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load active API keys";
      setApiKeysError(errorMessage);
      console.error("Error loading active API keys:", err);
    } finally {
      setIsApiKeysLoading(false);
    }
  };

  const generateApiKey = async (
    partnerUid: string,
    request: CreateApiKeyRequestDto
  ): Promise<ApiResponse<any>> => {
    try {
      setApiKeysError(null);
      const response = await partnersService.generateApiKey(
        partnerUid,
        request
      );

      if (response.status && response.data) {
        // Reload API keys
        await loadPartnerApiKeys(partnerUid);
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  const regenerateApiKey = async (
    partnerUid: string
  ): Promise<ApiResponse<any>> => {
    try {
      setApiKeysError(null);
      const response = await partnersService.regenerateApiKey(partnerUid);

      if (response.status && response.data) {
        // Reload API keys
        await loadPartnerApiKeys(partnerUid);
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to regenerate API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  const enablePartnerApiKey = async (partnerUid: string) => {
    try {
      setApiKeysError(null);
      const response = await partnersService.enablePartnerApiKey(partnerUid);

      if (response.status && response.data) {
        // Reload API keys
        await loadPartnerApiKeys(partnerUid);
      } else {
        throw new Error(response.message || "Failed to enable API key");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to enable API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  const disablePartnerApiKey = async (partnerUid: string) => {
    try {
      setApiKeysError(null);
      const response = await partnersService.disablePartnerApiKey(partnerUid);

      if (response.status && response.data) {
        // Reload API keys
        await loadPartnerApiKeys(partnerUid);
      } else {
        throw new Error(response.message || "Failed to disable API key");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to disable API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  const deletePartnerApiKey = async (partnerUid: string) => {
    try {
      setApiKeysError(null);
      const response = await partnersService.deletePartnerApiKey(partnerUid);

      if (response.status && response.data) {
        // Reload API keys
        await loadPartnerApiKeys(partnerUid);
      } else {
        throw new Error(response.message || "Failed to delete API key");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  const loadApiKeyStatus = async (
    apiKeyUid: string
  ): Promise<ApiKeyStatus | null> => {
    try {
      setApiKeysError(null);
      const response = await partnersService.getApiKeyStatus(apiKeyUid);

      if (response.status && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to load API key status");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load API key status";
      setApiKeysError(errorMessage);
      return null;
    }
  };

  const deleteApiKey = async (apiKeyUid: string) => {
    try {
      setApiKeysError(null);
      const response = await partnersService.deleteApiKey(apiKeyUid);

      if (response.status && response.data) {
        // Remove from local state
        setApiKeys((prev) => prev.filter((key) => key.apiKeyUid !== apiKeyUid));
      } else {
        throw new Error(response.message || "Failed to delete API key");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  const enableApiKeyByUid = async (apiKeyUid: string) => {
    try {
      setApiKeysError(null);
      const response = await partnersService.enableApiKeyByUid(apiKeyUid);

      if (response.status && response.data) {
        // Update local state
        setApiKeys((prev) =>
          prev.map((key) =>
            key.apiKeyUid === apiKeyUid ? { ...key, active: true } : key
          )
        );
      } else {
        throw new Error(response.message || "Failed to enable API key");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to enable API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  const disableApiKeyByUid = async (apiKeyUid: string) => {
    try {
      setApiKeysError(null);
      const response = await partnersService.disableApiKeyByUid(apiKeyUid);

      if (response.status && response.data) {
        // Update local state
        setApiKeys((prev) =>
          prev.map((key) =>
            key.apiKeyUid === apiKeyUid ? { ...key, active: false } : key
          )
        );
      } else {
        throw new Error(response.message || "Failed to disable API key");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to disable API key";
      setApiKeysError(errorMessage);
      throw err;
    }
  };

  // UI State Management
  const clearError = () => setError(null);
  const clearCurrentPartner = () => setCurrentPartner(null);
  const clearApiKeysError = () => setApiKeysError(null);

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated
    if (isAuthenticated) {
      loadPartners();
      loadPartnerStatistics();
    }
  }, [isAuthenticated, loadPartners, loadPartnerStatistics]);

  const value: PartnersContextType = {
    // State
    partners,
    currentPartner,
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

    // API Keys
    apiKeys,
    isApiKeysLoading,
    apiKeysError,

    // Actions
    loadPartners,
    loadPartnerByUid,
    loadPartnerById,
    loadPartnerByCode,
    createPartner,
    updatePartner,
    updatePartnerByUid,
    searchPartners,
    loadPartnersByTier,
    loadPartnersByStatus,
    loadPartnerStatistics,

    // Partner Actions
    verifyPartner,
    unverifyPartner,
    activatePartner,
    deactivatePartner,
    setPartnerTier,
    setPartnerStatus,
    setPartnerCommission,
    softDeletePartner,
    bulkUpdateTiers,
    bulkUpdateStatuses,

    // API Key Management
    loadPartnerApiKeys,
    loadPartnerActiveApiKeys,
    generateApiKey,
    regenerateApiKey,
    enablePartnerApiKey,
    disablePartnerApiKey,
    deletePartnerApiKey,
    loadApiKeyStatus,
    deleteApiKey,
    enableApiKeyByUid,
    disableApiKeyByUid,

    // UI State Management
    setCurrentPage,
    setPageSize,
    setFilters,
    clearError,
    clearCurrentPartner,
    clearApiKeysError,
  };

  return (
    <PartnersContext.Provider value={value}>
      {children}
    </PartnersContext.Provider>
  );
}

export function usePartners() {
  const context = useContext(PartnersContext);
  if (context === undefined) {
    throw new Error("usePartners must be used within a PartnersProvider");
  }
  return context;
}
