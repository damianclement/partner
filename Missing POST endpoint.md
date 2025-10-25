# Missing POST Endpoint Implementations

## Overview
This document identifies POST endpoints from the API documentation that are **NOT yet implemented** in the codebase. These endpoints are documented in `api.md` but lack corresponding service implementations.

## 🚨 Critical Missing Implementations

### 1. Agent-Bus Core Systems Assignment
**Endpoint**: `POST /admin/v1/agent-bus-core-systems/assign`
- **Purpose**: Assign agent to bus core system with specific credentials and permissions
- **Request Body**: `AssignAgentToBusCoreSystemRequest`
- **Status**: ❌ **NOT IMPLEMENTED**
- **Impact**: Cannot assign agents to bus core systems
- **Service**: No service method exists
- **Config Available**: `API_ENDPOINTS.AGENT_BUS_CORE_SYSTEMS.ASSIGN`

### 2. Key Rotation Management
**Endpoints**:
- `POST /admin/v1/key-rotation/validate-keys`
- `POST /admin/v1/key-rotation/rotate-agent-passwords`

- **Purpose**: 
  - Validate encryption keys are properly configured
  - Rotate encryption keys for all AgentBusCoreSystem passwords
- **Status**: ❌ **NOT IMPLEMENTED**
- **Impact**: Cannot manage encryption key rotation
- **Service**: No service exists for key rotation functionality
- **Config Available**: `API_ENDPOINTS.KEY_ROTATION`

### 3. Group Agent Bus Core System Management
**Endpoints**:
- `POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems` (Assign)
- `POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/{id}/deactivate`
- `POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/{id}/activate`
- `POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}/set-primary`

- **Purpose**: Manage GroupAgent-BusCoreSystem relationships
- **Status**: ❌ **NOT IMPLEMENTED**
- **Impact**: Cannot manage group agent bus system assignments
- **Service**: Missing from `groupAgentsService`
- **Config Available**: `API_ENDPOINTS.GROUP_AGENT_BUS_CORE_SYSTEMS`

### 4. Admin User Password Change
**Endpoint**: `POST /admin/v1/users/change-password`
- **Purpose**: Change user password (admin endpoint)
- **Request Body**: `ChangePasswordRequest`
- **Status**: ⚠️ **PARTIALLY IMPLEMENTED**
- **Issue**: `authService.changePassword()` uses `/v1/auth/password/change` instead of admin endpoint
- **Impact**: Admin password changes not using correct endpoint
- **Config Available**: `API_ENDPOINTS.USERS.CHANGE_PASSWORD`

## ✅ Already Implemented POST Endpoints

The following POST endpoints **ARE** properly implemented:

### System Users
- `POST /admin/v1/system-users/partner-users` → `usersService.createPartnerUser()`
- `POST /admin/v1/system-users/admin-users` → `usersService.createAdminUser()`

### Partners
- `POST /admin/v1/partners` → `partnersService.createPartner()`
- `POST /admin/v1/partners/search` → `partnersService.searchPartners()`
- `POST /admin/v1/partners/uid/{partnerUid}/api-key/generate` → `partnersService.generateApiKey()`
- `POST /admin/v1/partners/uid/{partnerUid}/api-key/regenerate` → `partnersService.regenerateApiKey()`

### Group Agents
- `POST /admin/v1/group-agents` → `groupAgentsService.createGroupAgent()`
- `POST /admin/v1/group-agents/uid/{uid}/suspend` → `groupAgentsService.suspendGroupAgent()`
- `POST /admin/v1/group-agents/uid/{uid}/deactivate` → `groupAgentsService.deactivateGroupAgent()`
- `POST /admin/v1/group-agents/uid/{uid}/activate` → `groupAgentsService.activateGroupAgent()`
- `POST /admin/v1/group-agents/search` → `groupAgentsService.searchGroupAgents()`

### Super Agents
- `POST /admin/v1/super-agents` → `superAgentsService.createSuperAgent()`
- `POST /admin/v1/agents/super-agent` → `agentsService.createSuperAgent()`

### Agents
- `POST /admin/v1/agents/uid/{uid}/reset-password` → `agentsService.resetAgentPassword()`

### Bus Core Systems
- `POST /admin/v1/bus-core-systems` → `busCoreSystemsService.createBusCoreSystem()`

### Authentication
- `POST /v1/auth/login` → `authService.login()`
- `POST /v1/auth/refresh` → `authService.refreshToken()`
- `POST /v1/auth/password/reset` → `authService.requestPasswordReset()`
- `POST /v1/auth/password/confirm-reset` → `authService.confirmPasswordReset()`
- `POST /v1/auth/password/change` → `authService.changePassword()`

### User Roles
- `POST /admin/v1/users/uid/{userUid}/roles` → `rolesService.assignRoleToUser()`

## 📊 Implementation Priority

### High Priority (Core Functionality)
1. **Agent-Bus Core Systems Assignment** - Critical for agent management
2. **Group Agent Bus Core System Management** - Essential for group agent operations

### Medium Priority (Security & Maintenance)
3. **Key Rotation Management** - Important for security maintenance
4. **Admin User Password Change** - Fix endpoint usage

## 🔧 Implementation Requirements

### For Agent-Bus Core Systems Service
```typescript
// New service: lib/api/services/agent-bus-core-systems.ts
export class AgentBusCoreSystemsService {
  async assignAgentToBusCoreSystem(
    request: AssignAgentToBusCoreSystemRequest
  ): Promise<ApiResponse<AgentBusCoreSystemResponseDto>> {
    return apiClient.post<AgentBusCoreSystemResponseDto>(
      API_ENDPOINTS.AGENT_BUS_CORE_SYSTEMS.ASSIGN,
      request
    );
  }
}
```

### For Key Rotation Service
```typescript
// New service: lib/api/services/key-rotation.ts
export class KeyRotationService {
  async validateKeys(): Promise<ApiResponse<string>> {
    return apiClient.post<string>(API_ENDPOINTS.KEY_ROTATION.VALIDATE_KEYS);
  }

  async rotateAgentPasswords(): Promise<ApiResponse<string>> {
    return apiClient.post<string>(API_ENDPOINTS.KEY_ROTATION.ROTATE_PASSWORDS);
  }
}
```

### For Group Agent Bus Core Systems (Add to existing service)
```typescript
// Add to: lib/api/services/group-agents.ts
export const groupAgentsService = {
  // ... existing methods ...

  async assignToBusCoreSystem(
    groupAgentUid: string,
    request: AssignGroupAgentToBusCoreSystemRequest
  ): Promise<GroupAgentCoreBusSystemResponseDto> {
    return apiClient.post<GroupAgentCoreBusSystemResponseDto>(
      API_ENDPOINTS.GROUP_AGENT_BUS_CORE_SYSTEMS.ASSIGN.replace(
        "{groupAgentUid}",
        groupAgentUid
      ),
      request
    );
  },

  async deactivateBusCoreSystem(
    groupAgentUid: string,
    id: number
  ): Promise<GroupAgentCoreBusSystemResponseDto> {
    return apiClient.post<GroupAgentCoreBusSystemResponseDto>(
      API_ENDPOINTS.GROUP_AGENT_BUS_CORE_SYSTEMS.DEACTIVATE
        .replace("{groupAgentUid}", groupAgentUid)
        .replace("{id}", String(id))
    );
  },

  async activateBusCoreSystem(
    groupAgentUid: string,
    id: number
  ): Promise<GroupAgentCoreBusSystemResponseDto> {
    return apiClient.post<GroupAgentCoreBusSystemResponseDto>(
      API_ENDPOINTS.GROUP_AGENT_BUS_CORE_SYSTEMS.ACTIVATE
        .replace("{groupAgentUid}", groupAgentUid)
        .replace("{id}", String(id))
    );
  },

  async setPrimaryBusCoreSystem(
    groupAgentUid: string,
    uid: string
  ): Promise<GroupAgentCoreBusSystemResponseDto> {
    return apiClient.post<GroupAgentCoreBusSystemResponseDto>(
      API_ENDPOINTS.GROUP_AGENT_BUS_CORE_SYSTEMS.SET_PRIMARY
        .replace("{groupAgentUid}", groupAgentUid)
        .replace("{uid}", uid)
    );
  },
};
```

### Fix Admin Password Change
```typescript
// Update: lib/api/services/users.ts
export const usersService = {
  // ... existing methods ...

  async changeUserPassword(
    request: ChangePasswordRequest
  ): Promise<ApiResponse<string>> {
    return apiClient.post<string>(
      API_ENDPOINTS.USERS.CHANGE_PASSWORD,
      request
    );
  },
};
```

## 📝 Notes

- All endpoint configurations are already available in `lib/api/config.ts`
- Type definitions may need to be added to `lib/api/types.ts` for new request/response DTOs
- Services should follow the existing patterns for error handling and response transformation
- Consider adding proper TypeScript types for all request and response objects

## 🎯 Next Steps

1. **Create Agent-Bus Core Systems service** with assignment functionality
2. **Create Key Rotation service** for encryption key management
3. **Extend Group Agents service** with bus core system management methods
4. **Fix Admin User Password Change** to use correct endpoint
5. **Add missing TypeScript types** for new request/response DTOs
6. **Update service exports** in `lib/api/services/index.ts`
7. **Test all new implementations** with proper error handling
