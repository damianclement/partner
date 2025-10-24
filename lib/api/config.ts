/**
 * API Configuration
 * OBUS Partner API Integration
 */

// Determine API base URL based on environment
export const getApiBaseUrl = (): string => {
  // Check if we're in development environment (both client and server side)
  const isDevelopment =
    typeof process !== "undefined" && process.env.NODE_ENV === "development";

  // Also check client-side localhost
  const isLocalhost =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  const baseUrl =
    isDevelopment || isLocalhost
      ? "http://localhost:3000/api"
      : "https://obus-partners.otapp.live/api";

  // Debug logging
  if (typeof window !== "undefined") {
    console.log("🔧 API Config Debug:", {
      isDevelopment,
      isLocalhost,
      hostname: window.location.hostname,
      nodeEnv: process.env.NODE_ENV,
      baseUrl,
    });
  }

  return baseUrl;
};

export const API_CONFIG = {
  version: "v1",
  timeout: 30000,
  retries: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/v1/auth/login",
    REFRESH: "/v1/auth/refresh",
    LOGOUT: "/v1/auth/logout",
    RESET_PASSWORD: "/v1/auth/password/reset",
    CONFIRM_RESET: "/v1/auth/password/confirm-reset",
    CHANGE_PASSWORD: "/v1/auth/password/change",
  },

  // Admin System Users
  SYSTEM_USERS: {
    LIST: "/admin/v1/system-users",
    GET_BY_UID: "/admin/v1/system-users/uid/{uid}",
    UPDATE: "/admin/v1/system-users/uid/{uid}",
    DELETE: "/admin/v1/system-users/uid/{uid}",
    CREATE_PARTNER_USER: "/admin/v1/system-users/partner-users",
    CREATE_ADMIN_USER: "/admin/v1/system-users/admin-users",
    STATS_COUNT_BY_TYPE: "/admin/v1/system-users/stats/count-by-user-type",
    STATS_COUNT_BY_STATUS: "/admin/v1/system-users/stats/count-by-status",
    STATS_COUNT_BY_DEPARTMENT:
      "/admin/v1/system-users/stats/count-by-department",
    SEARCH_BY_TYPE: "/admin/v1/system-users/search/by-user-type",
    SEARCH_BY_STATUS: "/admin/v1/system-users/search/by-status",
    SEARCH_BY_DEPARTMENT: "/admin/v1/system-users/search/by-department",
    VERIFY_PHONE: "/admin/v1/system-users/uid/{uid}/verify-phone",
    VERIFY_EMAIL: "/admin/v1/system-users/uid/{uid}/verify-email",
    SUSPEND: "/admin/v1/system-users/uid/{uid}/suspend",
    DEACTIVATE: "/admin/v1/system-users/uid/{uid}/deactivate",
    ACTIVATE: "/admin/v1/system-users/uid/{uid}/activate",
  },

  // Partners
  PARTNERS: {
    LIST: "/admin/v1/partners",
    GET_BY_ID: "/admin/v1/partners/{id}",
    GET_BY_UID: "/admin/v1/partners/uid/{uid}",
    CREATE: "/admin/v1/partners",
    UPDATE: "/admin/v1/partners/{id}",
    UPDATE_UID: "/admin/v1/partners/uid/{uid}",
    VERIFY: "/admin/v1/partners/{id}/verify",
    UNVERIFY: "/admin/v1/partners/{id}/unverify",
    ACTIVATE: "/admin/v1/partners/{id}/activate",
    DEACTIVATE: "/admin/v1/partners/{id}/deactivate",
    SOFT_DELETE: "/admin/v1/partners/{id}/soft-delete",
    SET_TIER: "/admin/v1/partners/{id}/tier",
    SET_STATUS: "/admin/v1/partners/{id}/status",
    SET_COMMISSION: "/admin/v1/partners/{id}/commission",
    BULK_UPDATE_TIER: "/admin/v1/partners/bulk/tier",
    BULK_UPDATE_STATUS: "/admin/v1/partners/bulk/status",
    SEARCH: "/admin/v1/partners/search",
    GET_BY_TIER: "/admin/v1/partners/tier/{tier}",
    GET_BY_STATUS: "/admin/v1/partners/status/{status}",
    STATISTICS: "/admin/v1/partners/statistics",
    FOR_ASSIGNMENT: "/admin/v1/partners/for-assignment",
    GET_BY_CODE: "/admin/v1/partners/code/{partnerCode}",
    // API Keys
    API_KEYS: "/admin/v1/partners/uid/{partnerUid}/api-keys",
    API_KEYS_ACTIVE: "/admin/v1/partners/uid/{partnerUid}/api-keys/active",
    GENERATE_API_KEY: "/admin/v1/partners/uid/{partnerUid}/api-key/generate",
    REGENERATE_API_KEY:
      "/admin/v1/partners/uid/{partnerUid}/api-key/regenerate",
    ENABLE_API_KEY: "/admin/v1/partners/uid/{partnerUid}/api-key/enable",
    DISABLE_API_KEY: "/admin/v1/partners/uid/{partnerUid}/api-key/disable",
    GET_API_KEY: "/admin/v1/partners/api-keys/{apiKeyUid}",
    DELETE_API_KEY: "/admin/v1/partners/api-keys/{apiKeyUid}",
    DELETE_PARTNER_API_KEY: "/admin/v1/partners/uid/{partnerUid}/api-key",
    ENABLE_API_KEY_BY_UID: "/admin/v1/partners/api-keys/{apiKeyUid}/enable",
    DISABLE_API_KEY_BY_UID: "/admin/v1/partners/api-keys/{apiKeyUid}/disable",
  },

  // Agents
  AGENTS: {
    LIST: "/admin/v1/agents",
    GET_BY_PARTNER_UID: "/admin/v1/agents/partner/uid/{partnerUid}",
    UPDATE_STATUS: "/admin/v1/agents/uid/{uid}/status",
    RESET_PASSWORD: "/admin/v1/agents/uid/{uid}/reset-password",
    CREATE_SUPER_AGENT: "/admin/v1/agents/super-agent",
  },

  // Super Agents
  SUPER_AGENTS: {
    LIST: "/admin/v1/super-agents",
    GET_BY_UID: "/admin/v1/super-agents/uid/{uid}",
    GET_BY_PARTNER_UID: "/admin/v1/super-agents/partner/uid/{partnerUid}",
    CREATE: "/admin/v1/super-agents",
    UPDATE_STATUS: "/admin/v1/super-agents/uid/{uid}/status",
    ASSIGN_TO_SUB_AGENT: "/admin/v1/super-agents/assign",
    REMOVE_FROM_SUB_AGENT: "/admin/v1/super-agents/remove",
    GET_SUB_AGENTS: "/admin/v1/super-agents/uid/{superAgentUid}/sub-agents",
    GET_SUB_AGENTS_COUNT:
      "/admin/v1/super-agents/uid/{superAgentUid}/sub-agents/count",
    GET_HIERARCHY: "/admin/v1/super-agents/uid/{superAgentUid}/hierarchy",
    STATISTICS: "/admin/v1/super-agents/statistics",
    SEARCH: "/admin/v1/super-agents/search",
  },

  // Group Agents
  GROUP_AGENTS: {
    LIST: "/admin/v1/group-agents",
    GET_BY_UID: "/admin/v1/group-agents/uid/{uid}",
    GET_BY_PARTNER_ID: "/admin/v1/group-agents/partner/{partnerId}",
    CREATE: "/admin/v1/group-agents",
    UPDATE: "/admin/v1/group-agents/uid/{uid}",
    DELETE: "/admin/v1/group-agents/uid/{uid}",
    SUSPEND: "/admin/v1/group-agents/uid/{uid}/suspend",
    DEACTIVATE: "/admin/v1/group-agents/uid/{uid}/deactivate",
    ACTIVATE: "/admin/v1/group-agents/uid/{uid}/activate",
    SEARCH: "/admin/v1/group-agents/search",
    STATISTICS: "/admin/v1/group-agents/stats",
    FOR_ASSIGNMENT: "/admin/v1/group-agents/for-assignment",
  },

  // Roles and Permissions
  ROLES: {
    LIST: "/admin/v1/roles",
    GET_BY_UID: "/admin/v1/roles/uid/{roleUid}",
    GET_BY_NAME: "/admin/v1/roles/name/{roleName}",
    GET_PERMISSIONS_BY_UID: "/admin/v1/roles/uid/{roleUid}/permissions",
    GET_PERMISSIONS_BY_NAME: "/admin/v1/roles/name/{roleName}/permissions",
  },

  PERMISSIONS: {
    LIST: "/admin/v1/permissions",
    GET_BY_UID: "/admin/v1/permissions/uid/{permissionUid}",
    GET_BY_NAME: "/admin/v1/permissions/name/{permissionName}",
  },

  // User Management
  USERS: {
    GET_PERMISSIONS: "/admin/v1/users/uid/{userUid}/permissions",
    GET_ROLES: "/admin/v1/users/uid/{userUid}/roles",
    ASSIGN_ROLE: "/admin/v1/users/uid/{userUid}/roles",
    REVOKE_ROLE_BY_UID: "/admin/v1/users/uid/{userUid}/roles/uid/{roleUid}",
    REVOKE_ROLE_BY_NAME: "/admin/v1/users/uid/{userUid}/roles/name/{roleName}",
    CHANGE_PASSWORD: "/admin/v1/users/change-password",
  },

  // Bookings
  BOOKINGS: {
    LIST: "/admin/v1/bookings",
    GET_BY_UID: "/admin/v1/bookings/uid/{uid}",
  },

  // Bus Core Systems
  BUS_CORE_SYSTEMS: {
    LIST: "/admin/v1/bus-core-systems",
    GET_BY_ID: "/admin/v1/bus-core-systems/{id}",
    GET_BY_UID: "/admin/v1/bus-core-systems/uid/{uid}",
    GET_BY_NAME: "/admin/v1/bus-core-systems/name/{name}",
    GET_BY_CODE: "/admin/v1/bus-core-systems/code/{code}",
    GET_DEFAULT: "/admin/v1/bus-core-systems/default",
    CREATE: "/admin/v1/bus-core-systems",
    UPDATE: "/admin/v1/bus-core-systems/{uid}",
    DELETE: "/admin/v1/bus-core-systems/{uid}",
    SET_DEFAULT: "/admin/v1/bus-core-systems/{uid}/set-default",
  },

  // Agent Bus Core Systems
  AGENT_BUS_CORE_SYSTEMS: {
    UPDATE: "/admin/v1/agent-bus-core-systems/uid/{uid}",
    DELETE: "/admin/v1/agent-bus-core-systems/uid/{uid}",
    SET_PRIMARY: "/admin/v1/agent-bus-core-systems/uid/{uid}/primary",
    ACTIVATE: "/admin/v1/agent-bus-core-systems/uid/{uid}/activate",
    ASSIGN: "/admin/v1/agent-bus-core-systems/assign",
    GET_PERMISSIONS: "/admin/v1/agent-bus-core-systems/uid/{uid}/permissions",
    GET_BY_BUS_CORE_SYSTEM:
      "/admin/v1/agent-bus-core-systems/bus-core-system/{busCoreSystemId}",
    GET_BY_AGENT: "/admin/v1/agent-bus-core-systems/agent/{agentId}",
    GET_BY_AGENT_UID: "/admin/v1/agent-bus-core-systems/agent/uid/{agentUid}",
  },

  // Group Agent Bus Core Systems
  GROUP_AGENT_BUS_CORE_SYSTEMS: {
    GET_BY_UID:
      "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}",
    UPDATE:
      "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}",
    DELETE:
      "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}",
    LIST: "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems",
    ASSIGN: "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems",
    ACTIVATE:
      "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/{id}/activate",
    DEACTIVATE:
      "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/{id}/deactivate",
    SET_PRIMARY:
      "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}/set-primary",
    GET_DECRYPTED_CREDENTIALS:
      "/admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}/decrypted-credentials",
  },

  // Session Config
  SESSION_CONFIG: "/admin/v1/session-config",

  // Key Rotation
  KEY_ROTATION: {
    VALIDATE_KEYS: "/admin/v1/key-rotation/validate-keys",
    ROTATE_PASSWORDS: "/admin/v1/key-rotation/rotate-agent-passwords",
    GET_STATUS: "/admin/v1/key-rotation/status",
  },
} as const;
