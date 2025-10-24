# Comprehensive Review and Documentation of OBUS Partner API

## Introduction

As a professional API analyst, I have reviewed the provided OpenAPI 3.0.1 specification for the **OBUS Partner API**. This API facilitates partner integration and management for the OBUS platform, including administrative operations for users, agents, roles, bookings, and more. It supports authentication via JWT bearer tokens.

The API is structured around several tags (e.g., Admin System User Management, Booking Management), which group related endpoints. Endpoints are primarily under `/admin/v1/` and `/v1/`, with a base server URL of `http://obus-partners.otapp.live/api`.

This documentation is thorough and tailored for UI integration preparation. It includes:
- **Endpoints**: Method, path, summary, parameters, request bodies, and responses.
- **Requests**: Detailed schemas for request bodies.
- **Responses**: Status codes, descriptions, and response schemas.
- **Schemas**: Key data models from the `components/schemas` section.

I have organized endpoints by tags for clarity. All schemas are presented in JSON format for easy reference. Assumptions:
- All endpoints require authentication as specified in the `security` section (bearerAuth, apiKey, apiSecret).
- Error handling follows standard HTTP codes (e.g., 400 for invalid data, 401 for unauthorized, 404 for not found).
- Pagination is common (e.g., `page`, `size`, `sortBy`, `sortDir` query params).

If any part of the spec is ambiguous (e.g., duplicated tags like "Auth"), I note it.

## Authentication and Security

- **bearerAuth**: JWT token in `Authorization: Bearer <token>` header. Used for authenticated sessions (e.g., after login).
- **apiKey**: `X-API-Key` header for partner-specific API keys.
- **apiSecret**: `X-API-Secret` header for partner secrets.
- Global security: All endpoints require one or more of these unless specified otherwise.
- Recommendation for UI: Store tokens securely (e.g., in localStorage or HttpOnly cookies), refresh tokens periodically, and handle 401 errors by redirecting to login.

## Endpoints by Tag

### Tag: Admin System User Management
Administrative endpoints for managing system users.

#### GET /admin/v1/system-users/uid/{uid}
- **Summary**: Get system user by UID.
- **Description**: Retrieves a system user by their unique identifier.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Responses**:
  - 200: System user found. Schema: `ResponseWrapperSystemUserResponseDto` (see Schemas).
  - 404: System user not found. Schema: `ResponseWrapperSystemUserResponseDto`.
- **Request**: None.

#### PUT /admin/v1/system-users/uid/{uid}
- **Summary**: Update system user by UID.
- **Description**: Updates a system user's information by their unique identifier.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Request Body** (application/json, required): `UpdateSystemUserRequestDto` (see Schemas).
- **Responses**:
  - 200: System user updated successfully. Schema: `ResponseWrapperSystemUserResponseDto`.
  - 400: Invalid request data. Schema: `ResponseWrapperSystemUserResponseDto`.
  - 404: System user not found. Schema: `ResponseWrapperSystemUserResponseDto`.

#### DELETE /admin/v1/system-users/uid/{uid}
- **Summary**: Delete system user by UID.
- **Description**: Deletes a system user by their unique identifier.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Responses**:
  - 204: System user deleted successfully.
  - 404: System user not found.
- **Request**: None.

#### POST /admin/v1/system-users/partner-users
- **Summary**: Create a new partner user.
- **Description**: Creates a new partner user with generated password and sends welcome email.
- **Request Body** (application/json, required): `CreatePartnerUserRequestDto` (see Schemas).
- **Responses**:
  - 201: Partner user created successfully. Schema: `SystemUserResponseDto`.
  - 409: Username or email already exists. Schema: `SystemUserResponseDto`.
  - 400: Invalid request data. Schema: `SystemUserResponseDto`.

#### POST /admin/v1/system-users/admin-users
- **Summary**: Create a new admin user.
- **Description**: Creates a new admin user with generated password and sends welcome email.
- **Request Body** (application/json, required): `CreateAdminUserRequestDto` (see Schemas).
- **Responses**:
  - 201: Admin user created successfully. Schema: `SystemUserResponseDto`.
  - 409: Username or email already exists. Schema: `SystemUserResponseDto`.
  - 400: Invalid request data. Schema: `SystemUserResponseDto`.

#### GET /admin/v1/system-users
- **Summary**: Get all system users.
- **Description**: Retrieves a paginated list of all system users.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 10): Page size.
  - `sortBy` (string, optional, default: "id"): Sort field.
  - `sortDir` (string, optional, default: "asc"): Sort direction (asc/desc).
- **Responses**:
  - 200: System users retrieved successfully. Schema: `PageResponseWrapperSystemUserResponseDto`.
  - 400: Invalid pagination parameters. Schema: `PageResponseWrapperSystemUserResponseDto`.

#### GET /admin/v1/system-users/stats/count-by-user-type
- **Summary**: Get count by user type.
- **Description**: Returns the count of system users grouped by user type.
- **Query Parameters**:
  - `userType` (string, required): User type (enum: SYSTEM_USER, PARTNER_USER, PARTNER_AGENT).
- **Responses**:
  - 200: Count retrieved successfully. Schema: integer (int64).

#### GET /admin/v1/system-users/stats/count-by-status
- **Summary**: Get count by status.
- **Description**: Returns the count of system users grouped by status.
- **Query Parameters**:
  - `status` (string, required): Status (enum: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, LOCKED).
- **Responses**:
  - 200: Count retrieved successfully. Schema: integer (int64).

#### GET /admin/v1/system-users/stats/count-by-department
- **Summary**: Get count by department.
- **Description**: Returns the count of system users grouped by department.
- **Query Parameters**:
  - `department` (string, required): Department.
- **Responses**:
  - 200: Count retrieved successfully. Schema: integer (int64).

#### GET /admin/v1/system-users/search/by-user-type
- **Summary**: Get system users by user type.
- **Description**: Retrieves system users filtered by user type.
- **Query Parameters**:
  - `userType` (string, required): User type filter (enum: SYSTEM_USER, PARTNER_USER, PARTNER_AGENT).
- **Responses**:
  - 200: System users retrieved successfully. Schema: array of `SystemUserResponseDto`.

#### GET /admin/v1/system-users/search/by-status
- **Summary**: Get system users by status.
- **Description**: Retrieves system users filtered by status.
- **Query Parameters**:
  - `status` (string, required): Status filter (enum: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, LOCKED).
- **Responses**:
  - 200: System users retrieved successfully. Schema: array of `SystemUserResponseDto`.

#### GET /admin/v1/system-users/search/by-department
- **Summary**: Get system users by department.
- **Description**: Retrieves system users filtered by department.
- **Query Parameters**:
  - `department` (string, required): Department filter.
- **Responses**:
  - 200: System users retrieved successfully. Schema: array of `SystemUserResponseDto`.

#### PATCH /admin/v1/system-users/uid/{uid}/verify-phone
- **Summary**: Verify system user phone.
- **Description**: Marks a system user's phone as verified.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Responses**:
  - 200: Phone verified successfully. Schema: `SystemUserResponseDto`.
  - 404: System user not found. Schema: `SystemUserResponseDto`.
- **Request**: None.

#### PATCH /admin/v1/system-users/uid/{uid}/verify-email
- **Summary**: Verify system user email.
- **Description**: Marks a system user's email as verified.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Responses**:
  - 200: Email verified successfully. Schema: `SystemUserResponseDto`.
  - 404: System user not found. Schema: `SystemUserResponseDto`.
- **Request**: None.

#### PATCH /admin/v1/system-users/uid/{uid}/suspend
- **Summary**: Suspend system user.
- **Description**: Suspends a system user by their unique identifier.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Responses**:
  - 200: System user suspended successfully. Schema: `SystemUserResponseDto`.
  - 404: System user not found. Schema: `SystemUserResponseDto`.
- **Request**: None.

#### PATCH /admin/v1/system-users/uid/{uid}/deactivate
- **Summary**: Deactivate system user.
- **Description**: Deactivates a system user by their unique identifier.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Responses**:
  - 200: System user deactivated successfully. Schema: `SystemUserResponseDto`.
  - 404: System user not found. Schema: `SystemUserResponseDto`.
- **Request**: None.

#### PATCH /admin/v1/system-users/uid/{uid}/activate
- **Summary**: Activate system user.
- **Description**: Activates a system user by their unique identifier.
- **Path Parameters**:
  - `uid` (string, required): System user UID.
- **Responses**:
  - 200: System user activated successfully. Schema: `SystemUserResponseDto`.
  - 404: System user not found. Schema: `SystemUserResponseDto`.
- **Request**: None.

### Tag: Admin GroupAgent Management
GroupAgent management operations for administrators.

#### GET /admin/v1/group-agents/uid/{uid}
- **Summary**: Get GroupAgent by UID.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): GroupAgent UID.
- **Responses**:
  - 200: GroupAgent retrieved successfully. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 404: GroupAgent not found. Schema: `ResponseWrapperGroupAgentResponseDto`.

#### PUT /admin/v1/group-agents/uid/{uid}
- **Summary**: Update GroupAgent.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): GroupAgent UID.
- **Request Body** (application/json, required): `UpdateGroupAgentRequestDto` (see Schemas).
- **Responses**:
  - 200: GroupAgent updated successfully. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 400: Invalid request data. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 404: GroupAgent not found. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 409: GroupAgent code or external system identifier already exists. Schema: `ResponseWrapperGroupAgentResponseDto`.

#### DELETE /admin/v1/group-agents/uid/{uid}
- **Summary**: Delete GroupAgent.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): GroupAgent UID.
- **Responses**:
  - 200: GroupAgent deleted successfully. Schema: `ResponseWrapperString`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperString`.
  - 404: GroupAgent not found. Schema: `ResponseWrapperString`.
  - 409: Cannot delete GroupAgent with associated agents or bus core systems. Schema: `ResponseWrapperString`.

#### GET /admin/v1/group-agents
- **Summary**: Get all GroupAgents.
- **Description**: None.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "createdAt"): Sort by field.
  - `sortDirection` (string, optional, default: "desc"): Sort direction.
- **Responses**:
  - 200: GroupAgents retrieved successfully. Schema: `PageResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperGroupAgentResponseDto`.

#### POST /admin/v1/group-agents
- **Summary**: Create a new GroupAgent.
- **Description**: None.
- **Request Body** (application/json, required): `CreateGroupAgentRequestDto` (see Schemas).
- **Responses**:
  - 201: GroupAgent created successfully. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 400: Invalid request data. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 409: GroupAgent code or external system identifier already exists. Schema: `ResponseWrapperGroupAgentResponseDto`.

#### POST /admin/v1/group-agents/uid/{uid}/suspend
- **Summary**: Suspend GroupAgent.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): GroupAgent UID.
- **Responses**:
  - 200: GroupAgent suspended successfully. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 404: GroupAgent not found. Schema: `ResponseWrapperGroupAgentResponseDto`.
- **Request**: None.

#### POST /admin/v1/group-agents/uid/{uid}/deactivate
- **Summary**: Deactivate GroupAgent.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): GroupAgent UID.
- **Responses**:
  - 200: GroupAgent deactivated successfully. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 404: GroupAgent not found. Schema: `ResponseWrapperGroupAgentResponseDto`.
- **Request**: None.

#### POST /admin/v1/group-agents/uid/{uid}/activate
- **Summary**: Activate GroupAgent.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): GroupAgent UID.
- **Responses**:
  - 200: GroupAgent activated successfully. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentResponseDto`.
  - 404: GroupAgent not found. Schema: `ResponseWrapperGroupAgentResponseDto`.
- **Request**: None.

#### POST /admin/v1/group-agents/search
- **Summary**: Search GroupAgents.
- **Description**: None.
- **Request Body** (application/json, required): `GroupAgentSearchRequestDto` (see Schemas).
- **Responses**:
  - 200: GroupAgents retrieved successfully. Schema: `PageResponseWrapperGroupAgentResponseDto`.
  - 400: Invalid request parameters. Schema: `PageResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperGroupAgentResponseDto`.

#### GET /admin/v1/group-agents/stats
- **Summary**: Get GroupAgent statistics.
- **Description**: None.
- **Responses**:
  - 200: Statistics retrieved successfully. Schema: `ResponseWrapperGroupAgentStatsDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentStatsDto`.
- **Request**: None.

#### GET /admin/v1/group-agents/partner/{partnerId}
- **Summary**: Get all GroupAgents by Partner.
- **Description**: None.
- **Path Parameters**:
  - `partnerId` (integer, required): Partner ID.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number.
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "createdAt"): Sort field.
  - `sortDirection` (string, optional, default: "DESC"): Sort direction.
- **Responses**:
  - 200: GroupAgents retrieved successfully. Schema: `PageResponseWrapperGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperGroupAgentResponseDto`.
  - 404: Partner not found. Schema: `PageResponseWrapperGroupAgentResponseDto`.

#### GET /admin/v1/group-agents/for-assignment
- **Summary**: Get all active GroupAgents for assignment.
- **Description**: None.
- **Responses**:
  - 200: GroupAgents retrieved successfully. Schema: `ResponseWrapperListGroupAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperListGroupAgentResponseDto`.
- **Request**: None.

### Tag: Admin Role Management
Administrative endpoints for managing roles and viewing role permissions.

#### GET /admin/v1/roles
- **Summary**: List all roles.
- **Description**: Retrieve all roles in the system with permission counts and user counts.
- **Responses**:
  - 200: Roles retrieved successfully. Schema: `ResponseWrapperListRoleResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperListRoleResponseDto`.
- **Request**: None.

#### GET /admin/v1/roles/uid/{roleUid}
- **Summary**: Get role by UID.
- **Description**: Retrieve detailed information about a specific role using its UID.
- **Path Parameters**:
  - `roleUid` (string, required): Role UID.
- **Responses**:
  - 200: Role retrieved successfully. Schema: `ResponseWrapperRoleResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperRoleResponseDto`.
  - 404: Role not found. Schema: `ResponseWrapperRoleResponseDto`.

#### GET /admin/v1/roles/uid/{roleUid}/permissions
- **Summary**: Get role's permissions by UID.
- **Description**: Retrieve all permissions assigned to a specific role using its UID.
- **Path Parameters**:
  - `roleUid` (string, required): Role UID.
- **Responses**:
  - 200: Role permissions retrieved successfully. Schema: `ResponseWrapperRoleWithPermissionsDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperRoleWithPermissionsDto`.
  - 404: Role not found. Schema: `ResponseWrapperRoleWithPermissionsDto`.

#### GET /admin/v1/roles/name/{roleName}
- **Summary**: Get role by name.
- **Description**: Retrieve detailed information about a specific role using its name (e.g., PARTNER_ADMIN).
- **Path Parameters**:
  - `roleName` (string, required): Role name (e.g., PARTNER_ADMIN).
- **Responses**:
  - 200: Role retrieved successfully. Schema: `ResponseWrapperRoleResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperRoleResponseDto`.
  - 404: Role not found. Schema: `ResponseWrapperRoleResponseDto`.

#### GET /admin/v1/roles/name/{roleName}/permissions
- **Summary**: Get role's permissions by name.
- **Description**: Retrieve all permissions assigned to a specific role using its name (e.g., PARTNER_ADMIN).
- **Path Parameters**:
  - `roleName` (string, required): Role name (e.g., PARTNER_ADMIN).
- **Responses**:
  - 200: Role permissions retrieved successfully. Schema: `ResponseWrapperRoleWithPermissionsDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperRoleWithPermissionsDto`.
  - 404: Role not found. Schema: `ResponseWrapperRoleWithPermissionsDto`.

### Tag: Admin Agent Bus Core System Management
Administrative endpoints for managing agent-bus core system relationships.

#### PUT /admin/v1/agent-bus-core-systems/uid/{uid}
- **Summary**: Update agent bus core system configuration.
- **Description**: Updates the configuration and permissions for an agent-bus core system relationship.
- **Path Parameters**:
  - `uid` (string, required): Agent-Bus Core System relationship UID.
- **Request Body** (application/json, required): `UpdateAgentBusCoreSystemRequest` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAgentBusCoreSystemResponseDto`.

#### DELETE /admin/v1/agent-bus-core-systems/uid/{uid}
- **Summary**: Remove agent from bus core system.
- **Description**: Removes an agent from a bus core system.
- **Path Parameters**:
  - `uid` (string, required): Agent-Bus Core System relationship UID.
- **Responses**:
  - 200: OK.
- **Request**: None.

#### PUT /admin/v1/agent-bus-core-systems/uid/{uid}/primary
- **Summary**: Set primary bus core system for agent.
- **Description**: Sets a bus core system as the primary one for an agent.
- **Path Parameters**:
  - `uid` (string, required): Agent-Bus Core System relationship UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAgentBusCoreSystemResponseDto`.
- **Request**: None.

#### PUT /admin/v1/agent-bus-core-systems/uid/{uid}/activate
- **Summary**: Activate/deactivate agent for bus core system.
- **Description**: Activates or deactivates an agent for a specific bus core system.
- **Path Parameters**:
  - `uid` (string, required): Agent-Bus Core System relationship UID.
- **Query Parameters**:
  - `isActive` (boolean, required): Active status.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAgentBusCoreSystemResponseDto`.

#### POST /admin/v1/agent-bus-core-systems/assign
- **Summary**: Assign agent to bus core system.
- **Description**: Assigns an agent to a bus core system with specific credentials and permissions.
- **Request Body** (application/json, required): `AssignAgentToBusCoreSystemRequest` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAgentBusCoreSystemResponseDto`.

#### GET /admin/v1/agent-bus-core-systems/uid/{uid}/permissions
- **Summary**: Get agent permissions for bus core system.
- **Description**: Retrieves the permissions and configuration for an agent on a specific bus core system.
- **Path Parameters**:
  - `uid` (string, required): Agent-Bus Core System relationship UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAgentBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/agent-bus-core-systems/bus-core-system/{busCoreSystemId}
- **Summary**: Get agents for bus core system.
- **Description**: Retrieves all agents assigned to a specific bus core system.
- **Path Parameters**:
  - `busCoreSystemId` (integer, required): Bus Core System ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperListAgentBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/agent-bus-core-systems/agent/{agentId}
- **Summary**: Get bus core systems for agent.
- **Description**: Retrieves all bus core systems assigned to a specific agent.
- **Path Parameters**:
  - `agentId` (integer, required): Agent ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperListAgentBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/agent-bus-core-systems/agent/uid/{agentUid}
- **Summary**: Get bus core systems for agent by UID.
- **Description**: Retrieves all bus core systems assigned to a specific agent using agent UID.
- **Path Parameters**:
  - `agentUid` (string, required): Agent UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperListAgentBusCoreSystemResponseDto`.
- **Request**: None.

### Tag: Booking Management
Booking management operations (context-aware: system users see all bookings, partner users see only their bookings).

#### GET /admin/v1/bookings
- **Summary**: Get bookings with pagination.
- **Description**: Retrieve bookings with automatic partner filtering. System users see all bookings, partner users see only their partner's bookings.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "createdAt"): Sort field (e.g., createdAt, departureDate, status).
  - `sortDir` (string, optional, default: "desc"): Sort direction (asc or desc).
- **Responses**:
  - 200: Bookings retrieved successfully. Schema: `PageResponseWrapperAdminBookingDetailDto`.
  - 400: Invalid request parameters. Schema: `PageResponseWrapperAdminBookingDetailDto`.
  - 401: Unauthorized - Authentication required. Schema: `PageResponseWrapperAdminBookingDetailDto`.
  - 403: Forbidden - Insufficient permissions. Schema: `PageResponseWrapperAdminBookingDetailDto`.

#### GET /admin/v1/bookings/uid/{uid}
- **Summary**: Get booking by UID.
- **Description**: Retrieve detailed information about a specific booking. Partner users can only access their own partner's bookings.
- **Path Parameters**:
  - `uid` (string, required): Booking UID.
- **Responses**:
  - 200: Booking retrieved successfully. Schema: `ResponseWrapperAdminBookingDetailDto`.
  - 401: Unauthorized - Authentication required. Schema: `ResponseWrapperAdminBookingDetailDto`.
  - 403: Forbidden - Booking belongs to different partner. Schema: `ResponseWrapperAdminBookingDetailDto`.
  - 404: Booking not found. Schema: `ResponseWrapperAdminBookingDetailDto`.

### Tag: User Permission Management
Endpoints for viewing user permissions (read-only).

#### GET /admin/v1/users/uid/{userUid}/permissions
- **Summary**: Get user's effective permissions.
- **Description**: Retrieve all effective permissions for a user (permissions from all assigned roles).
- **Path Parameters**:
  - `userUid` (string, required): User UID.
- **Responses**:
  - 200: User permissions retrieved successfully. Schema: `ResponseWrapperUserPermissionsResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperUserPermissionsResponseDto`.
  - 404: User not found. Schema: `ResponseWrapperUserPermissionsResponseDto`.

### Tag: Admin
Admin APIs - Manage Partners, Users, Agents, Bus Systems.

#### GET /admin/v1/partners/{id}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Request Body** (application/json, required): `UpdatePartnerRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.

#### PUT /admin/v1/partners/{id}/verify
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}/unverify
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}/tier
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Query Parameters**:
  - `tier` (string, required): New tier (enum: BRONZE, SILVER, GOLD, PLATINUM, DIAMOND).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}/status
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Query Parameters**:
  - `status` (string, required): New status (enum: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, REJECTED, TERMINATED).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}/soft-delete
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}/deactivate
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}/commission
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Query Parameters**:
  - `commissionRate` (number, required): New commission rate.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/{id}/activate
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Partner ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### GET /admin/v1/partners/uid/{uid}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Request Body** (application/json, required): `UpdatePartnerRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.

#### PUT /admin/v1/partners/uid/{uid}/verify
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}/unverify
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}/tier
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Query Parameters**:
  - `tier` (string, required): New tier (enum: BRONZE, SILVER, GOLD, PLATINUM, DIAMOND).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}/status
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Query Parameters**:
  - `status` (string, required): New status (enum: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, REJECTED, TERMINATED).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}/soft-delete
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}/deactivate
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}/commission
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Query Parameters**:
  - `commissionRate` (number, required): New commission rate.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{uid}/activate
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{partnerUid}/api-key/enable
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### PUT /admin/v1/partners/uid/{partnerUid}/api-key/disable
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### PUT /admin/v1/partners/bulk/tier
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `BulkUpdateTierRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.

#### PUT /admin/v1/partners/bulk/status
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `BulkUpdateStatusRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.

#### PUT /admin/v1/partners/api-keys/{apiKeyUid}/enable
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `apiKeyUid` (string, required): API Key UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### PUT /admin/v1/partners/api-keys/{apiKeyUid}/disable
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `apiKeyUid` (string, required): API Key UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### GET /admin/v1/partners
- **Summary**: None.
- **Description**: None.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number.
  - `size` (integer, optional, default: 10): Page size.
  - `sortBy` (string, optional, default: "id"): Sort field.
  - `sortDir` (string, optional, default: "asc"): Sort direction.
- **Responses**:
  - 200: OK. Schema: `PageResponseWrapperPartnerSummaryDto`.
- **Request**: None.

#### POST /admin/v1/partners
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `CreatePartnerRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.

#### POST /admin/v1/partners/uid/{partnerUid}/api-key/regenerate
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperApiKeyInfo`.
- **Request**: None.

#### POST /admin/v1/partners/uid/{partnerUid}/api-key/generate
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Request Body** (application/json, required): `CreateApiKeyRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperApiKeyInfo`.

#### POST /admin/v1/partners/search
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `PartnerSearchRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `PageResponseWrapperPartnerSummaryDto`.

#### GET /admin/v1/partners/uid/{partnerUid}/api-keys
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperListApiKeySummary`.
- **Request**: None.

#### GET /admin/v1/partners/uid/{partnerUid}/api-keys/active
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperListApiKeySummary`.
- **Request**: None.

#### GET /admin/v1/partners/tier/{tier}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `tier` (string, required): Tier (enum: BRONZE, SILVER, GOLD, PLATINUM, DIAMOND).
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number.
  - `size` (integer, optional, default: 10): Page size.
  - `sortBy` (string, optional, default: "id"): Sort field.
  - `sortDir` (string, optional, default: "asc"): Sort direction.
- **Responses**:
  - 200: OK. Schema: `PageResponseWrapperPartnerSummaryDto`.
- **Request**: None.

#### GET /admin/v1/partners/status/{status}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `status` (string, required): Status (enum: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, REJECTED, TERMINATED).
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number.
  - `size` (integer, optional, default: 10): Page size.
  - `sortBy` (string, optional, default: "id"): Sort field.
  - `sortDir` (string, optional, default: "asc"): Sort direction.
- **Responses**:
  - 200: OK. Schema: `PageResponseWrapperPartnerSummaryDto`.
- **Request**: None.

#### GET /admin/v1/partners/statistics
- **Summary**: None.
- **Description**: None.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerStatistics`.
- **Request**: None.

#### GET /admin/v1/partners/for-assignment
- **Summary**: None.
- **Description**: None.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperListPartnerSummaryDto`.
- **Request**: None.

#### GET /admin/v1/partners/code/{partnerCode}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerCode` (string, required): Partner code.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperPartnerResponseDto`.
- **Request**: None.

#### GET /admin/v1/partners/api-keys/{apiKeyUid}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `apiKeyUid` (string, required): API Key UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperApiKeyStatus`.
- **Request**: None.

#### DELETE /admin/v1/partners/api-keys/{apiKeyUid}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `apiKeyUid` (string, required): API Key UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### DELETE /admin/v1/partners/uid/{partnerUid}/api-key
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

### Tag: Admin User-Role Management
Administrative endpoints for managing user role assignments.

#### GET /admin/v1/users/uid/{userUid}/roles
- **Summary**: Get user's roles.
- **Description**: Retrieve all roles assigned to a specific user.
- **Path Parameters**:
  - `userUid` (string, required): User UID.
- **Responses**:
  - 200: User roles retrieved successfully. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 404: User not found. Schema: `ResponseWrapperUserRolesResponseDto`.

#### POST /admin/v1/users/uid/{userUid}/roles
- **Summary**: Assign role to user.
- **Description**: Assign a role to a user. Provide either roleName or roleId in the request body.
- **Path Parameters**:
  - `userUid` (string, required): User UID.
- **Request Body** (application/json, required): `AssignRoleRequest` (see Schemas).
- **Responses**:
  - 200: Role assigned successfully. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 400: Invalid request - provide either roleName or roleId. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 404: User or role not found. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 409: Role already assigned to user. Schema: `ResponseWrapperUserRolesResponseDto`.

#### DELETE /admin/v1/users/uid/{userUid}/roles/uid/{roleUid}
- **Summary**: Revoke role from user by UID.
- **Description**: Remove a role from a user using the role's UID.
- **Path Parameters**:
  - `userUid` (string, required): User UID.
  - `roleUid` (string, required): Role UID.
- **Responses**:
  - 200: Role revoked successfully. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 404: User, role not found, or role not assigned to user. Schema: `ResponseWrapperUserRolesResponseDto`.
- **Request**: None.

#### DELETE /admin/v1/users/uid/{userUid}/roles/name/{roleName}
- **Summary**: Revoke role from user by name.
- **Description**: Remove a role from a user using the role's name (e.g., PARTNER_ADMIN).
- **Path Parameters**:
  - `userUid` (string, required): User UID.
  - `roleName` (string, required): Role name (e.g., PARTNER_ADMIN).
- **Responses**:
  - 200: Role revoked successfully. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 400: Invalid role name. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperUserRolesResponseDto`.
  - 404: User, role not found, or role not assigned to user. Schema: `ResponseWrapperUserRolesResponseDto`.
- **Request**: None.

### Tag: Admin Session Config
Provides configuration data for Admin UI.

#### GET /admin/v1/session-config
- **Summary**: Get configuration data.
- **Description**: Provides static configuration values (enums, types) needed by the Admin UI.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAdminConfigResponse`.
- **Request**: None.

### Tag: Admin Agent Management
Agent management operations for administrators.

#### PUT /admin/v1/agents/uid/{uid}/status
- **Summary**: Update agent status.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Agent UID.
- **Request Body** (application/json, required): `UpdateAgentStatusRequestDto` (see Schemas).
- **Responses**:
  - 200: Agent status updated successfully. Schema: `ResponseWrapperAgentResponseDto`.
  - 400: Invalid status or request. Schema: `ResponseWrapperAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperAgentResponseDto`.
  - 404: Agent not found. Schema: `ResponseWrapperAgentResponseDto`.

#### POST /admin/v1/agents/uid/{uid}/reset-password
- **Summary**: Reset agent password.
- **Description**: Reset an agent's password and optionally send notifications via email and/or SMS.
- **Path Parameters**:
  - `uid` (string, required): Agent UID.
- **Query Parameters**:
  - `sendEmail` (boolean, optional, default: true): Send email notification.
  - `sendSms` (boolean, optional, default: true): Send SMS notification.
- **Responses**:
  - 200: Password reset successfully. Schema: `ResponseWrapperAgentPasswordResetResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperAgentPasswordResetResponseDto`.
  - 403: Forbidden - Insufficient permissions. Schema: `ResponseWrapperAgentPasswordResetResponseDto`.
  - 404: Agent not found. Schema: `ResponseWrapperAgentPasswordResetResponseDto`.
- **Request**: None.

#### POST /admin/v1/agents/super-agent
- **Summary**: Create a new super agent.
- **Description**: None.
- **Request Body** (application/json, required): `CreateSuperAgentRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAgentResponseDto`.

#### GET /admin/v1/agents
- **Summary**: Get all agents with pagination.
- **Description**: None.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "createdAt"): Sort field.
  - `sortDir` (string, optional, default: "desc"): Sort direction.
- **Responses**:
  - 200: Agents retrieved successfully. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 400: Invalid request parameters. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperAgentSummaryDto`.

#### GET /admin/v1/agents/partner/uid/{partnerUid}
- **Summary**: Get agents by partner UID.
- **Description**: None.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "createdAt"): Sort field.
  - `sortDir` (string, optional, default: "desc"): Sort direction.
- **Responses**:
  - 200: Agents retrieved successfully. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 404: Partner not found. Schema: `PageResponseWrapperAgentSummaryDto`.
- **Request**: None.

### Tag: Admin Super Agent Management
Super agent management operations for administrators.

#### PUT /admin/v1/super-agents/uid/{uid}/status
- **Summary**: Update super agent status.
- **Description**: Update the status of a super agent (ACTIVE, SUSPENDED, INACTIVE).
- **Path Parameters**:
  - `uid` (string, required): Super Agent UID.
- **Query Parameters**:
  - `status` (string, required): New status.
- **Responses**:
  - 200: Status updated successfully. Schema: `ResponseWrapperAgentResponseDto`.
  - 400: Invalid status. Schema: `ResponseWrapperAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperAgentResponseDto`.
  - 404: Super agent not found. Schema: `ResponseWrapperAgentResponseDto`.

#### PUT /admin/v1/super-agents/assign
- **Summary**: Assign super agent to sub-agent.
- **Description**: Create a relationship between a super agent and a sub-agent.
- **Query Parameters**:
  - `subAgentUid` (string, required): Sub-agent UID.
  - `superAgentUid` (string, required): Super agent UID.
- **Responses**:
  - 200: Super agent assigned successfully. Schema: `ResponseWrapperAgentResponseDto`.
  - 400: Invalid assignment. Schema: `ResponseWrapperAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperAgentResponseDto`.
  - 404: Agent not found. Schema: `ResponseWrapperAgentResponseDto`.
- **Request**: None.

#### GET /admin/v1/super-agents
- **Summary**: Get all super agents with pagination.
- **Description**: Retrieve all super agents in the system with pagination and sorting support.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "registrationDate"): Sort field (e.g., registrationDate, businessName).
  - `sortDir` (string, optional, default: "desc"): Sort direction (asc or desc).
- **Responses**:
  - 200: Super agents retrieved successfully. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 400: Invalid request parameters. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperAgentSummaryDto`.

#### POST /admin/v1/super-agents
- **Summary**: Create a new super agent.
- **Description**: Create a new super agent with user account for dashboard access.
- **Request Body** (application/json, required): `CreateSuperAgentRequestDto` (see Schemas).
- **Responses**:
  - 201: Super agent created successfully. Schema: `ResponseWrapperAgentResponseDto`.
  - 400: Invalid request data. Schema: `ResponseWrapperAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperAgentResponseDto`.
  - 409: Super agent already exists. Schema: `ResponseWrapperAgentResponseDto`.

#### GET /admin/v1/super-agents/uid/{uid}
- **Summary**: Get super agent by UID.
- **Description**: Retrieve detailed information about a specific super agent using its unique identifier.
- **Path Parameters**:
  - `uid` (string, required): Super Agent UID.
- **Responses**:
  - 200: Super agent retrieved successfully. Schema: `ResponseWrapperAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperAgentResponseDto`.
  - 404: Super agent not found. Schema: `ResponseWrapperAgentResponseDto`.

#### GET /admin/v1/super-agents/uid/{superAgentUid}/sub-agents
- **Summary**: Get sub-agents of a super agent.
- **Description**: Retrieve all sub-agents managed by a specific super agent.
- **Path Parameters**:
  - `superAgentUid` (string, required): Super Agent UID.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "registrationDate"): Sort field.
  - `sortDir` (string, optional, default: "desc"): Sort direction.
- **Responses**:
  - 200: Sub-agents retrieved successfully. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 404: Super agent not found. Schema: `PageResponseWrapperAgentSummaryDto`.
- **Request**: None.

#### GET /admin/v1/super-agents/uid/{superAgentUid}/sub-agents/count
- **Summary**: Count sub-agents.
- **Description**: Get the total number of sub-agents for a specific super agent.
- **Path Parameters**:
  - `superAgentUid` (string, required): Super Agent UID.
- **Responses**:
  - 200: Count retrieved successfully. Schema: `ResponseWrapperLong`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperLong`.
  - 404: Super agent not found. Schema: `ResponseWrapperLong`.
- **Request**: None.

#### GET /admin/v1/super-agents/uid/{superAgentUid}/hierarchy
- **Summary**: Get agent hierarchy.
- **Description**: Retrieve the complete hierarchy (super agent and all sub-agents).
- **Path Parameters**:
  - `superAgentUid` (string, required): Super Agent UID.
- **Responses**:
  - 200: Hierarchy retrieved successfully. Schema: `ResponseWrapperListAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperListAgentResponseDto`.
  - 404: Super agent not found. Schema: `ResponseWrapperListAgentResponseDto`.
- **Request**: None.

#### GET /admin/v1/super-agents/statistics
- **Summary**: Get super agent statistics.
- **Description**: Retrieve statistics about super agents and sub-agents in the system.
- **Responses**:
  - 200: Statistics retrieved successfully. Schema: `ResponseWrapperSuperAgentStatistics`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperSuperAgentStatistics`.
- **Request**: None.

#### GET /admin/v1/super-agents/search
- **Summary**: Search super agents by business name.
- **Description**: Search for super agents using business name with pagination.
- **Query Parameters**:
  - `businessName` (string, required): Business name to search.
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "businessName"): Sort field.
  - `sortDir` (string, optional, default: "asc"): Sort direction.
- **Responses**:
  - 200: Search completed successfully. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 400: Invalid search parameters. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperAgentSummaryDto`.

#### GET /admin/v1/super-agents/partner/uid/{partnerUid}
- **Summary**: Get super agents by partner UID.
- **Description**: Retrieve all super agents belonging to a specific partner.
- **Path Parameters**:
  - `partnerUid` (string, required): Partner UID.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number (0-based).
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "registrationDate"): Sort field.
  - `sortDir` (string, optional, default: "desc"): Sort direction.
- **Responses**:
  - 200: Super agents retrieved successfully. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperAgentSummaryDto`.
  - 404: Partner not found. Schema: `PageResponseWrapperAgentSummaryDto`.
- **Request**: None.

#### DELETE /admin/v1/super-agents/remove
- **Summary**: Remove super agent from sub-agent.
- **Description**: Remove the relationship between a super agent and a sub-agent.
- **Query Parameters**:
  - `subAgentUid` (string, required): Sub-agent UID.
- **Responses**:
  - 200: Super agent removed successfully. Schema: `ResponseWrapperAgentResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperAgentResponseDto`.
  - 404: Sub-agent not found. Schema: `ResponseWrapperAgentResponseDto`.
- **Request**: None.

### Tag: Admin Permission Management
Administrative endpoints for viewing and filtering permissions.

#### GET /admin/v1/permissions
- **Summary**: List all permissions.
- **Description**: Retrieve all permissions with optional filters for scope type, resource, action, and partner UID.
- **Query Parameters**:
  - `resource` (string, optional): Filter by resource type (e.g., BOOKING, AGENT).
  - `action` (string, optional): Filter by action type (e.g., LIST, READ, CREATE).
- **Responses**:
  - 200: Permissions retrieved successfully. Schema: `ResponseWrapperListPermissionResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperListPermissionResponseDto`.

#### GET /admin/v1/permissions/uid/{permissionUid}
- **Summary**: Get permission by UID.
- **Description**: Retrieve detailed information about a specific permission using its UID.
- **Path Parameters**:
  - `permissionUid` (string, required): Permission UID.
- **Responses**:
  - 200: Permission retrieved successfully. Schema: `ResponseWrapperPermissionResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperPermissionResponseDto`.
  - 404: Permission not found. Schema: `ResponseWrapperPermissionResponseDto`.

#### GET /admin/v1/permissions/name/{permissionName}
- **Summary**: Get permission by name.
- **Description**: Retrieve detailed information about a specific permission using its name (e.g., booking:list or booking:list:01ARZ3ND...).
- **Path Parameters**:
  - `permissionName` (string, required): Permission name (URL-encoded if contains colons).
- **Responses**:
  - 200: Permission retrieved successfully. Schema: `ResponseWrapperPermissionResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperPermissionResponseDto`.
  - 404: Permission not found. Schema: `ResponseWrapperPermissionResponseDto`.

### Tag: Admin GroupAgent Core Bus System Management
GroupAgent BusCoreSystem assignment management for administrators.

#### GET /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}
- **Summary**: Get GroupAgentCoreBusSystem by UID.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
  - `uid` (string, required): GroupAgentCoreBusSystem UID.
- **Responses**:
  - 200: GroupAgentCoreBusSystem retrieved successfully. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 404: GroupAgentCoreBusSystem not found. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.

#### PUT /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}
- **Summary**: Update GroupAgentCoreBusSystem credentials.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
  - `uid` (string, required): GroupAgentCoreBusSystem UID.
- **Request Body** (application/json, required): `UpdateGroupAgentCoreBusSystemRequest` (see Schemas).
- **Responses**:
  - 200: GroupAgentCoreBusSystem updated successfully. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 400: Invalid request data. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 404: GroupAgentCoreBusSystem not found. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.

#### DELETE /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}
- **Summary**: Remove GroupAgent from BusCoreSystem.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
  - `uid` (string, required): GroupAgentCoreBusSystem UID.
- **Responses**:
  - 200: GroupAgent removed from BusCoreSystem successfully. Schema: `ResponseWrapperString`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperString`.
  - 404: GroupAgentCoreBusSystem not found. Schema: `ResponseWrapperString`.
- **Request**: None.

#### GET /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems
- **Summary**: Get all BusCoreSystems for a GroupAgent.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
- **Query Parameters**:
  - `page` (integer, optional, default: 0): Page number.
  - `size` (integer, optional, default: 20): Page size.
  - `sortBy` (string, optional, default: "createdAt"): Sort field.
  - `sortDirection` (string, optional, default: "DESC"): Sort direction.
- **Responses**:
  - 200: BusCoreSystems retrieved successfully. Schema: `PageResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `PageResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 404: GroupAgent not found. Schema: `PageResponseWrapperGroupAgentCoreBusSystemResponseDto`.

#### POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems
- **Summary**: Assign GroupAgent to BusCoreSystem.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
- **Request Body** (application/json, required): `AssignGroupAgentToBusCoreSystemRequest` (see Schemas).
- **Responses**:
  - 201: GroupAgent assigned to BusCoreSystem successfully. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 400: Invalid request data. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 404: GroupAgent or BusCoreSystem not found. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 409: GroupAgent already assigned to this BusCoreSystem. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.

#### POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/{id}/deactivate
- **Summary**: Deactivate GroupAgent for BusCoreSystem.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
  - `id` (integer, required): GroupAgentCoreBusSystem ID.
- **Responses**:
  - 200: GroupAgent deactivated for BusCoreSystem successfully. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 404: GroupAgentCoreBusSystem not found. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
- **Request**: None.

#### POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/{id}/activate
- **Summary**: Activate GroupAgent for BusCoreSystem.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
  - `id` (integer, required): GroupAgentCoreBusSystem ID.
- **Responses**:
  - 200: GroupAgent activated for BusCoreSystem successfully. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 404: GroupAgentCoreBusSystem not found. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
- **Request**: None.

#### POST /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}/set-primary
- **Summary**: Set primary BusCoreSystem for GroupAgent.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
  - `uid` (string, required): GroupAgentCoreBusSystem UID.
- **Responses**:
  - 200: Primary BusCoreSystem set successfully. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
  - 404: GroupAgentCoreBusSystem not found. Schema: `ResponseWrapperGroupAgentCoreBusSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/group-agents/uid/{groupAgentUid}/bus-core-systems/uid/{uid}/decrypted-credentials
- **Summary**: Get decrypted credentials for GroupAgentCoreBusSystem.
- **Description**: None.
- **Path Parameters**:
  - `groupAgentUid` (string, required): GroupAgent UID.
  - `uid` (string, required): GroupAgentCoreBusSystem UID.
- **Responses**:
  - 200: Decrypted credentials retrieved successfully. Schema: `ResponseWrapperDecryptedGroupAgentCredentials`.
  - 401: Unauthorized - Admin access required. Schema: `ResponseWrapperDecryptedGroupAgentCredentials`.
  - 404: GroupAgentCoreBusSystem not found. Schema: `ResponseWrapperDecryptedGroupAgentCredentials`.
- **Request**: None.

### Tag: Auth
Authentication APIs - Login, Register, Refresh Token, Password Reset. (Note: Tag duplicated in spec; assuming it's the same.)

#### POST /v1/auth/refresh
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `RefreshTokenRequest` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAuthResponse`.

#### POST /v1/auth/password/reset
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `ResetPasswordRequest` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.

#### POST /v1/auth/password/confirm-reset
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `ConfirmPasswordResetRequest` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.

#### POST /v1/auth/password/change
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `ChangePasswordRequest` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.

#### POST /v1/auth/login
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `LoginRequest` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperAuthResponse`.

### Tag: Admin User Management
Administrative endpoints for managing users.

#### POST /admin/v1/users/change-password
- **Summary**: Change user password.
- **Description**: Changes the password for the authenticated user.
- **Request Body** (application/json, required): `ChangePasswordRequest` (see Schemas).
- **Responses**:
  - 200: Password changed successfully. Schema: `ResponseWrapperString`.
  - 400: Invalid request data. Schema: `ResponseWrapperString`.
  - 401: Unauthorized. Schema: `ResponseWrapperString`.
  - 403: Access denied. Schema: `ResponseWrapperString`.

### Tag: Admin Key Rotation
Administrative endpoints for encryption key rotation.

#### POST /admin/v1/key-rotation/validate-keys
- **Summary**: Validate encryption keys.
- **Description**: Validates that encryption keys are properly configured and working.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### POST /admin/v1/key-rotation/rotate-agent-passwords
- **Summary**: Rotate agent passwords.
- **Description**: Rotates encryption keys for all AgentBusCoreSystem passwords.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### GET /admin/v1/key-rotation/status
- **Summary**: Get key rotation status.
- **Description**: Retrieves the current key rotation configuration status.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperKeyRotationStatus`.
- **Request**: None.

### Tag: admin-bus-core-system-controller
(Note: Tag name in lowercase; likely a typo in spec.)

#### PUT /admin/v1/bus-core-systems/{uid}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Bus Core System UID.
- **Request Body** (application/json, required): `UpdateBusCoreSystemRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.

#### DELETE /admin/v1/bus-core-systems/{uid}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Bus Core System UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperString`.
- **Request**: None.

#### PUT /admin/v1/bus-core-systems/{uid}/set-default
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Bus Core System UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/bus-core-systems
- **Summary**: None.
- **Description**: None.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperListBusCoreSystemResponseDto`.
- **Request**: None.

#### POST /admin/v1/bus-core-systems
- **Summary**: None.
- **Description**: None.
- **Request Body** (application/json, required): `CreateBusCoreSystemRequestDto` (see Schemas).
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.

#### GET /admin/v1/bus-core-systems/{id}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `id` (integer, required): Bus Core System ID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/bus-core-systems/uid/{uid}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `uid` (string, required): Bus Core System UID.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/bus-core-systems/name/{name}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `name` (string, required): Bus Core System name.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/bus-core-systems/default
- **Summary**: None.
- **Description**: None.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.
- **Request**: None.

#### GET /admin/v1/bus-core-systems/code/{code}
- **Summary**: None.
- **Description**: None.
- **Path Parameters**:
  - `code` (string, required): Bus Core System code.
- **Responses**:
  - 200: OK. Schema: `ResponseWrapperBusCoreSystemResponseDto`.
- **Request**: None.

## Schemas

Here are the key schemas from the spec, presented as JSON examples for UI integration (e.g., for form validation or display).

### ResponseWrapperSystemUserResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "userId": 1,
    "username": "string",
    "email": "string",
    "displayName": "string",
    "userType": "SYSTEM_USER",
    "enabled": true,
    "accountNonExpired": true,
    "accountNonLocked": true,
    "credentialsNonExpired": true,
    "requirePasswordChange": true,
    "partnerId": 1,
    "partnerName": "string",
    "partnerCode": "string",
    "firstName": "string",
    "lastName": "string",
    "systemUserDisplayName": "string",
    "phoneNumber": "string",
    "personalEmail": "string",
    "dateOfBirth": "2023-10-22",
    "gender": "string",
    "employeeId": "string",
    "department": "string",
    "position": "string",
    "officeLocation": "string",
    "workPhone": "string",
    "workEmail": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string",
    "nationalId": "string",
    "passportNumber": "string",
    "status": "ACTIVE",
    "preferredLanguage": "string",
    "timezone": "string",
    "profilePictureUrl": "string",
    "emergencyContactName": "string",
    "emergencyContactPhone": "string",
    "registrationDate": "2023-10-22T00:00:00Z",
    "lastLoginDate": "2023-10-22T00:00:00Z",
    "passwordChangedDate": "2023-10-22T00:00:00Z",
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z",
    "createdBy": "string",
    "updatedBy": "string",
    "emailVerified": true,
    "phoneVerified": true,
    "verified": true,
    "active": true,
    "fullName": "string"
  }
}
```

### UpdateSystemUserRequestDto
```json
{
  "uid": "string",
  "firstName": "string",
  "lastName": "string",
  "displayName": "string",
  "phoneNumber": "string",
  "personalEmail": "string",
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "officeLocation": "string",
  "workPhone": "string",
  "workEmail": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "nationalId": "string",
  "passportNumber": "string",
  "gender": "string",
  "preferredLanguage": "string",
  "timezone": "string",
  "profilePictureUrl": "string",
  "emergencyContactName": "string",
  "emergencyContactPhone": "string",
  "status": "ACTIVE"
}
```

### SystemUserResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "userId": 1,
  "username": "string",
  "email": "string",
  "displayName": "string",
  "userType": "SYSTEM_USER",
  "enabled": true,
  "accountNonExpired": true,
  "accountNonLocked": true,
  "credentialsNonExpired": true,
  "requirePasswordChange": true,
  "partnerId": 1,
  "partnerName": "string",
  "partnerCode": "string",
  "firstName": "string",
  "lastName": "string",
  "systemUserDisplayName": "string",
  "phoneNumber": "string",
  "personalEmail": "string",
  "dateOfBirth": "2023-10-22",
  "gender": "string",
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "officeLocation": "string",
  "workPhone": "string",
  "workEmail": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "nationalId": "string",
  "passportNumber": "string",
  "status": "ACTIVE",
  "preferredLanguage": "string",
  "timezone": "string",
  "profilePictureUrl": "string",
  "emergencyContactName": "string",
  "emergencyContactPhone": "string",
  "registrationDate": "2023-10-22T00:00:00Z",
  "lastLoginDate": "2023-10-22T00:00:00Z",
  "passwordChangedDate": "2023-10-22T00:00:00Z",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z",
  "createdBy": "string",
  "updatedBy": "string",
  "emailVerified": true,
  "phoneVerified": true,
  "verified": true,
  "active": true,
  "fullName": "string"
}
```

### AgentResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "code": "string",
  "partnerAgentNumber": "string",
  "passName": "string",
  "passCode": "string",
  "businessName": "string",
  "contactPerson": "string",
  "phoneNumber": "string",
  "msisdn": "string",
  "businessEmail": "string",
  "businessAddress": "string",
  "taxId": "string",
  "licenseNumber": "string",
  "name": "string",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "gender": "string",
  "nationality": "string",
  "phoneNo": "string",
  "email": "string",
  "personalAddress": "string",
  "nidaNo": "string",
  "agentType": "INDIVIDUAL",
  "status": "PENDING_APPROVAL",
  "registrationDate": "2023-10-22T00:00:00Z",
  "approvalDate": "2023-10-22T00:00:00Z",
  "lastActivityDate": "2023-10-22T00:00:00Z",
  "notes": "string",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z",
  "partnerId": 1,
  "partnerUid": "string",
  "partnerCode": "string",
  "partnerBusinessName": "string",
  "superAgentId": 1,
  "superAgentUid": "string",
  "superAgentCode": "string",
  "superAgentBusinessName": "string",
  "userId": 1,
  "userUsername": "string",
  "userEmail": "string"
}
```

### ResponseWrapperAgentResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "code": "string",
    "partnerAgentNumber": "string",
    "passName": "string",
    "passCode": "string",
    "businessName": "string",
    "contactPerson": "string",
    "phoneNumber": "string",
    "msisdn": "string",
    "businessEmail": "string",
    "businessAddress": "string",
    "taxId": "string",
    "licenseNumber": "string",
    "name": "string",
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "gender": "string",
    "nationality": "string",
    "phoneNo": "string",
    "email": "string",
    "personalAddress": "string",
    "nidaNo": "string",
    "agentType": "INDIVIDUAL",
    "status": "PENDING_APPROVAL",
    "registrationDate": "2023-10-22T00:00:00Z",
    "approvalDate": "2023-10-22T00:00:00Z",
    "lastActivityDate": "2023-10-22T00:00:00Z",
    "notes": "string",
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z",
    "partnerId": 1,
    "partnerUid": "string",
    "partnerCode": "string",
    "partnerBusinessName": "string",
    "superAgentId": 1,
    "superAgentUid": "string",
    "superAgentCode": "string",
    "superAgentBusinessName": "string",
    "userId": 1,
    "userUsername": "string",
    "userEmail": "string"
  }
}
```

### UpdatePartnerRequestDto
```json
{
  "businessName": "string",
  "legalName": "string",
  "email": "string",
  "phoneNumber": "string",
  "businessRegistrationNumber": "string",
  "taxIdentificationNumber": "string",
  "businessAddress": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "status": "ACTIVE",
  "type": "INDIVIDUAL",
  "tier": "BRONZE",
  "isActive": true,
  "isVerified": true,
  "contactPersonName": "string",
  "contactPersonEmail": "string",
  "contactPersonPhone": "string",
  "commissionRate": 0.0,
  "description": "string",
  "notes": "string"
}
```

### PartnerResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "code": "string",
  "businessName": "string",
  "legalName": "string",
  "email": "string",
  "phoneNumber": "string",
  "businessRegistrationNumber": "string",
  "taxIdentificationNumber": "string",
  "businessAddress": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "status": "ACTIVE",
  "type": "INDIVIDUAL",
  "tier": "BRONZE",
  "isActive": true,
  "isVerified": true,
  "commissionRate": 0.0,
  "contactPersonName": "string",
  "contactPersonEmail": "string",
  "contactPersonPhone": "string",
  "description": "string",
  "notes": "string",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z",
  "createdByUsername": "string",
  "createdByEmail": "string",
  "updatedByUsername": "string",
  "updatedByEmail": "string"
}
```

### ResponseWrapperPartnerResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "code": "string",
    "businessName": "string",
    "legalName": "string",
    "email": "string",
    "phoneNumber": "string",
    "businessRegistrationNumber": "string",
    "taxIdentificationNumber": "string",
    "businessAddress": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string",
    "status": "ACTIVE",
    "type": "INDIVIDUAL",
    "tier": "BRONZE",
    "isActive": true,
    "isVerified": true,
    "commissionRate": 0.0,
    "contactPersonName": "string",
    "contactPersonEmail": "string",
    "contactPersonPhone": "string",
    "description": "string",
    "notes": "string",
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z",
    "createdByUsername": "string",
    "createdByEmail": "string",
    "updatedByUsername": "string",
    "updatedByEmail": "string"
  }
}
```

### ResponseWrapperString
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": "string"
}
```

### BulkUpdateTierRequestDto
```json
{
  "partnerIds": [
    1
  ],
  "tier": "BRONZE"
}
```

### BulkUpdateStatusRequestDto
```json
{
  "partnerIds": [
    1
  ],
  "status": "ACTIVE"
}
```

### UpdateGroupAgentRequestDto
```json
{
  "code": "string",
  "name": "string",
  "description": "string",
  "externalSystemIdentifier": "string",
  "type": "STANDARD",
  "status": "ACTIVE",
  "contactPerson": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "businessName": "string",
  "businessAddress": "string",
  "taxId": "string",
  "licenseNumber": "string",
  "notes": "string"
}
```

### GroupAgentCoreBusSystemSummaryDto
```json
{
  "id": 1,
  "uid": "string",
  "externalAgentIdentifier": "string",
  "username": "string",
  "isActive": true,
  "isPrimary": true,
  "externalSystemStatus": "string",
  "busCoreSystemId": 1,
  "busCoreSystemCode": "string",
  "busCoreSystemName": "string",
  "busCoreSystemProviderName": "string",
  "lastAuthenticationDate": "2023-10-22T00:00:00Z",
  "lastSyncDate": "2023-10-22T00:00:00Z"
}
```

### GroupAgentResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "code": "string",
  "name": "string",
  "description": "string",
  "externalSystemIdentifier": "string",
  "type": "STANDARD",
  "status": "ACTIVE",
  "contactPerson": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "businessName": "string",
  "businessAddress": "string",
  "taxId": "string",
  "licenseNumber": "string",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z",
  "activatedAt": "2023-10-22T00:00:00Z",
  "lastActivityDate": "2023-10-22T00:00:00Z",
  "notes": "string",
  "partnerId": 1,
  "partnerUid": "string",
  "partnerCode": "string",
  "partnerBusinessName": "string",
  "agentCount": 0,
  "busCoreSystemCount": 0,
  "activeBusCoreSystemCount": 0,
  "busCoreSystems": [
    {
      "id": 1,
      "uid": "string",
      "externalAgentIdentifier": "string",
      "username": "string",
      "isActive": true,
      "isPrimary": true,
      "externalSystemStatus": "string",
      "busCoreSystemId": 1,
      "busCoreSystemCode": "string",
      "busCoreSystemName": "string",
      "busCoreSystemProviderName": "string",
      "lastAuthenticationDate": "2023-10-22T00:00:00Z",
      "lastSyncDate": "2023-10-22T00:00:00Z"
    }
  ]
}
```

### ResponseWrapperGroupAgentResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "code": "string",
    "name": "string",
    "description": "string",
    "externalSystemIdentifier": "string",
    "type": "STANDARD",
    "status": "ACTIVE",
    "contactPerson": "string",
    "contactEmail": "string",
    "contactPhone": "string",
    "businessName": "string",
    "businessAddress": "string",
    "taxId": "string",
    "licenseNumber": "string",
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z",
    "activatedAt": "2023-10-22T00:00:00Z",
    "lastActivityDate": "2023-10-22T00:00:00Z",
    "notes": "string",
    "partnerId": 1,
    "partnerUid": "string",
    "partnerCode": "string",
    "partnerBusinessName": "string",
    "agentCount": 0,
    "busCoreSystemCount": 0,
    "activeBusCoreSystemCount": 0,
    "busCoreSystems": [
      {
        "id": 1,
        "uid": "string",
        "externalAgentIdentifier": "string",
        "username": "string",
        "isActive": true,
        "isPrimary": true,
        "externalSystemStatus": "string",
        "busCoreSystemId": 1,
        "busCoreSystemCode": "string",
        "busCoreSystemName": "string",
        "busCoreSystemProviderName": "string",
        "lastAuthenticationDate": "2023-10-22T00:00:00Z",
        "lastSyncDate": "2023-10-22T00:00:00Z"
      }
    ]
  }
}
```

### UpdateGroupAgentCoreBusSystemRequest
```json
{
  "externalAgentIdentifier": "string",
  "username": "string",
  "password": "string",
  "txnUserName": "string",
  "txnPassword": "string",
  "apiKey": "string",
  "apiSecret": "string",
  "accessToken": "string",
  "refreshToken": "string",
  "isActive": true,
  "isPrimary": true,
  "externalSystemStatus": "string",
  "externalAgentId": "string",
  "configuration": "string",
  "endpointUrl": "string",
  "timeoutSeconds": 0,
  "retryAttempts": 0,
  "notes": "string"
}
```

### GroupAgentCoreBusSystemResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "externalAgentIdentifier": "string",
  "username": "string",
  "txnUserName": "string",
  "isActive": true,
  "isPrimary": true,
  "externalSystemStatus": "string",
  "externalAgentId": "string",
  "configuration": "string",
  "endpointUrl": "string",
  "timeoutSeconds": 0,
  "retryAttempts": 0,
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z",
  "createdBy": "string",
  "updatedBy": "string",
  "lastAuthenticationDate": "2023-10-22T00:00:00Z",
  "lastSyncDate": "2023-10-22T00:00:00Z",
  "notes": "string",
  "busCoreSystemId": 1,
  "busCoreSystemUid": "string",
  "busCoreSystemCode": "string",
  "busCoreSystemName": "string",
  "busCoreSystemProviderName": "string",
  "busCoreSystemBaseUrl": "string",
  "groupAgentId": 1,
  "groupAgentUid": "string",
  "groupAgentCode": "string",
  "groupAgentName": "string",
  "partnerId": 1,
  "partnerUid": "string",
  "partnerCode": "string",
  "partnerBusinessName": "string"
}
```

### ResponseWrapperGroupAgentCoreBusSystemResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "externalAgentIdentifier": "string",
    "username": "string",
    "txnUserName": "string",
    "isActive": true,
    "isPrimary": true,
    "externalSystemStatus": "string",
    "externalAgentId": "string",
    "configuration": "string",
    "endpointUrl": "string",
    "timeoutSeconds": 0,
    "retryAttempts": 0,
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z",
    "createdBy": "string",
    "updatedBy": "string",
    "lastAuthenticationDate": "2023-10-22T00:00:00Z",
    "lastSyncDate": "2023-10-22T00:00:00Z",
    "notes": "string",
    "busCoreSystemId": 1,
    "busCoreSystemUid": "string",
    "busCoreSystemCode": "string",
    "busCoreSystemName": "string",
    "busCoreSystemProviderName": "string",
    "busCoreSystemBaseUrl": "string",
    "groupAgentId": 1,
    "groupAgentUid": "string",
    "groupAgentCode": "string",
    "groupAgentName": "string",
    "partnerId": 1,
    "partnerUid": "string",
    "partnerCode": "string",
    "partnerBusinessName": "string"
  }
}
```

### UpdateBusCoreSystemRequestDto
```json
{
  "code": "string",
  "name": "string",
  "providerName": "string",
  "baseUrl": "string",
  "description": "string",
  "isDefault": true
}
```

### BusCoreSystemResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "code": "string",
  "name": "string",
  "providerName": "string",
  "baseUrl": "string",
  "description": "string",
  "isDefault": true,
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z",
  "createdBy": "string",
  "updatedBy": "string"
}
```

### ResponseWrapperBusCoreSystemResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "code": "string",
    "name": "string",
    "providerName": "string",
    "baseUrl": "string",
    "description": "string",
    "isDefault": true,
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z",
    "createdBy": "string",
    "updatedBy": "string"
  }
}
```

### UpdateAgentStatusRequestDto
```json
{
  "status": "PENDING_APPROVAL",
  "reason": "string",
  "notes": "string"
}
```

### UpdateAgentBusCoreSystemRequest
```json
{
  "agentLoginName": "string",
  "password": "string",
  "txnUserName": "string",
  "txnPassword": "string",
  "isActive": true,
  "isPrimary": true,
  "agentStatusInBusCore": "string",
  "busCoreAgentId": "string"
}
```

### AgentBusCoreSystemResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "agentId": 1,
  "agentName": "string",
  "agentContactPerson": "string",
  "agentBusinessName": "string",
  "agentPhoneNumber": "string",
  "agentEmail": "string",
  "busCoreSystemId": 1,
  "busCoreSystemName": "string",
  "busCoreSystemCode": "string",
  "agentLoginName": "string",
  "password": "string",
  "txnUserName": "string",
  "txnPassword": "string",
  "agentStatusInBusCore": "string",
  "isActive": true,
  "isPrimary": true,
  "busCoreAgentId": "string",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z",
  "createdBy": "string",
  "updatedBy": "string",
  "lastAuthenticationDate": "2023-10-22T00:00:00Z",
  "lastBookingDate": "2023-10-22T00:00:00Z",
  "activeInBusCore": true
}
```

### ResponseWrapperAgentBusCoreSystemResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "agentId": 1,
    "agentName": "string",
    "agentContactPerson": "string",
    "agentBusinessName": "string",
    "agentPhoneNumber": "string",
    "agentEmail": "string",
    "busCoreSystemId": 1,
    "busCoreSystemName": "string",
    "busCoreSystemCode": "string",
    "agentLoginName": "string",
    "password": "string",
    "txnUserName": "string",
    "txnPassword": "string",
    "agentStatusInBusCore": "string",
    "isActive": true,
    "isPrimary": true,
    "busCoreAgentId": "string",
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z",
    "createdBy": "string",
    "updatedBy": "string",
    "lastAuthenticationDate": "2023-10-22T00:00:00Z",
    "lastBookingDate": "2023-10-22T00:00:00Z",
    "activeInBusCore": true
  }
}
```

### RefreshTokenRequest
```json
{
  "refreshToken": "string"
}
```

### AuthResponse
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "type": "string",
  "username": "string",
  "email": "string",
  "userType": "string",
  "requireResetPassword": true,
  "partnerId": 1,
  "partnerUid": "string",
  "partnerCode": "string",
  "partnerBusinessName": "string",
  "displayName": "string",
  "roles": [
    "string"
  ],
  "tokenExpiresAt": "string",
  "agentId": 1,
  "agentStatus": "string",
  "lastLoginAt": "string",
  "permissions": [
    "string"
  ]
}
```

### ResponseWrapperAuthResponse
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "type": "string",
    "username": "string",
    "email": "string",
    "userType": "string",
    "requireResetPassword": true,
    "partnerId": 1,
    "partnerUid": "string",
    "partnerCode": "string",
    "partnerBusinessName": "string",
    "displayName": "string",
    "roles": [
      "string"
    ],
    "tokenExpiresAt": "string",
    "agentId": 1,
    "agentStatus": "string",
    "lastLoginAt": "string",
    "permissions": [
      "string"
    ]
  }
}
```

### ResetPasswordRequest
```json
{
  "email": "string"
}
```

### ConfirmPasswordResetRequest
```json
{
  "token": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### ChangePasswordRequest
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### LoginRequest
```json
{
  "username": "string",
  "password": "string"
}
```

### AssignRoleRequest
```json
{
  "roleName": "string",
  "roleId": 1,
  "valid": true
}
```

### RoleResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "name": "string",
  "displayName": "string",
  "description": "string",
  "active": true,
  "permissionCount": 0,
  "userCount": 0,
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z"
}
```

### UserRolesResponseDto
```json
{
  "userUid": "string",
  "username": "string",
  "userType": "string",
  "partnerUid": "string",
  "partnerName": "string",
  "roles": [
    {
      "id": 1,
      "uid": "string",
      "name": "string",
      "displayName": "string",
      "description": "string",
      "active": true,
      "permissionCount": 0,
      "userCount": 0,
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z"
    }
  ],
  "totalRoles": 0
}
```

### CreatePartnerUserRequestDto
```json
{
  "username": "string",
  "email": "string",
  "displayName": "string",
  "partnerId": 1,
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "personalEmail": "string",
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "officeLocation": "string",
  "workPhone": "string",
  "workEmail": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "nationalId": "string",
  "passportNumber": "string",
  "gender": "string",
  "preferredLanguage": "string",
  "timezone": "string",
  "emergencyContactName": "string",
  "emergencyContactPhone": "string"
}
```

### CreateAdminUserRequestDto
```json
{
  "username": "string",
  "email": "string",
  "displayName": "string",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "personalEmail": "string",
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "officeLocation": "string",
  "workPhone": "string",
  "workEmail": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "nationalId": "string",
  "passportNumber": "string",
  "gender": "string",
  "preferredLanguage": "string",
  "timezone": "string",
  "emergencyContactName": "string",
  "emergencyContactPhone": "string"
}
```

### AgentSummaryDto
```json
{
  "id": 1,
  "uid": "string",
  "code": "string",
  "partnerAgentNumber": "string",
  "passName": "string",
  "businessName": "string",
  "contactPerson": "string",
  "agentType": "INDIVIDUAL",
  "status": "PENDING_APPROVAL",
  "registrationDate": "2023-10-22T00:00:00Z",
  "partnerId": 1,
  "partnerCode": "string",
  "partnerBusinessName": "string",
  "superAgentId": 1,
  "superAgentCode": "string",
  "superAgentBusinessName": "string"
}
```

### PageResponseWrapperAgentSummaryDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "code": "string",
      "partnerAgentNumber": "string",
      "passName": "string",
      "businessName": "string",
      "contactPerson": "string",
      "agentType": "INDIVIDUAL",
      "status": "PENDING_APPROVAL",
      "registrationDate": "2023-10-22T00:00:00Z",
      "partnerId": 1,
      "partnerCode": "string",
      "partnerBusinessName": "string",
      "superAgentId": 1,
      "superAgentCode": "string",
      "superAgentBusinessName": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### ResponseWrapperLong
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": 1
}
```

### ResponseWrapperListAgentResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "code": "string",
      "partnerAgentNumber": "string",
      "passName": "string",
      "passCode": "string",
      "businessName": "string",
      "contactPerson": "string",
      "phoneNumber": "string",
      "msisdn": "string",
      "businessEmail": "string",
      "businessAddress": "string",
      "taxId": "string",
      "licenseNumber": "string",
      "name": "string",
      "firstName": "string",
      "middleName": "string",
      "lastName": "string",
      "gender": "string",
      "nationality": "string",
      "phoneNo": "string",
      "email": "string",
      "personalAddress": "string",
      "nidaNo": "string",
      "agentType": "INDIVIDUAL",
      "status": "PENDING_APPROVAL",
      "registrationDate": "2023-10-22T00:00:00Z",
      "approvalDate": "2023-10-22T00:00:00Z",
      "lastActivityDate": "2023-10-22T00:00:00Z",
      "notes": "string",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z",
      "partnerId": 1,
      "partnerUid": "string",
      "partnerCode": "string",
      "partnerBusinessName": "string",
      "superAgentId": 1,
      "superAgentUid": "string",
      "superAgentCode": "string",
      "superAgentBusinessName": "string",
      "userId": 1,
      "userUsername": "string",
      "userEmail": "string"
    }
  ]
}
```

### ResponseWrapperSuperAgentStatistics
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "totalSuperAgents": 1,
    "activeSuperAgents": 1,
    "pendingSuperAgents": 1,
    "suspendedSuperAgents": 1,
    "totalSubAgents": 1,
    "activeSubAgents": 1
  }
}
```

### AdminConfigResponse
```json
{
  "userTypes": [
    {
      "value": "string",
      "displayName": "string",
      "description": "string"
    }
  ],
  "userRoles": [
    {
      "value": "string",
      "displayName": "string",
      "description": "string"
    }
  ]
}
```

### EnumItem
```json
{
  "value": "string",
  "displayName": "string",
  "description": "string"
}
```

### ResponseWrapperAdminConfigResponse
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "userTypes": [
      {
        "value": "string",
        "displayName": "string",
        "description": "string"
      }
    ],
    "userRoles": [
      {
        "value": "string",
        "displayName": "string",
        "description": "string"
      }
    ]
  }
}
```

### ResponseWrapperListRoleResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "name": "string",
      "displayName": "string",
      "description": "string",
      "active": true,
      "permissionCount": 0,
      "userCount": 0,
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z"
    }
  ]
}
```

### ResponseWrapperRoleResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "name": "string",
    "displayName": "string",
    "description": "string",
    "active": true,
    "permissionCount": 0,
    "userCount": 0,
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z"
  }
}
```

### PermissionSummaryDto
```json
{
  "uid": "string",
  "name": "string",
  "action": "string",
  "resource": "string"
}
```

### ResponseWrapperRoleWithPermissionsDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "name": "string",
    "displayName": "string",
    "description": "string",
    "active": true,
    "permissions": [
      {
        "uid": "string",
        "name": "string",
        "action": "string",
        "resource": "string"
      }
    ],
    "totalPermissions": 0,
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z"
  }
}
```

### RoleWithPermissionsDto
```json
{
  "id": 1,
  "uid": "string",
  "name": "string",
  "displayName": "string",
  "description": "string",
  "active": true,
  "permissions": [
    {
      "uid": "string",
      "name": "string",
      "action": "string",
      "resource": "string"
    }
  ],
  "totalPermissions": 0,
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z"
}
```

### ResponseWrapperListPermissionResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "name": "string",
      "action": "string",
      "resource": "string",
      "description": "string",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z"
    }
  ]
}
```

### ResponseWrapperPermissionResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "uid": "string",
    "name": "string",
    "action": "string",
    "resource": "string",
    "description": "string",
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z"
  }
}
```

### PermissionResponseDto
```json
{
  "id": 1,
  "uid": "string",
  "name": "string",
  "action": "string",
  "resource": "string",
  "description": "string",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z"
}
```

### ApiKeySummary
```json
{
  "apiKeyUid": "string",
  "keyName": "string",
  "description": "string",
  "environment": "string",
  "permissions": [
    "string"
  ],
  "createdAt": "2023-10-22T00:00:00Z",
  "lastUsedAt": "2023-10-22T00:00:00Z",
  "expiresAt": "2023-10-22T00:00:00Z",
  "usageCount": 1,
  "active": true,
  "primary": true
}
```

### ResponseWrapperListApiKeySummary
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "apiKeyUid": "string",
      "keyName": "string",
      "description": "string",
      "environment": "string",
      "permissions": [
        "string"
      ],
      "createdAt": "2023-10-22T00:00:00Z",
      "lastUsedAt": "2023-10-22T00:00:00Z",
      "expiresAt": "2023-10-22T00:00:00Z",
      "usageCount": 1,
      "active": true,
      "primary": true
    }
  ]
}
```

### PartnerStatistics
```json
{
  "totalPartners": 1,
  "activePartners": 1,
  "verifiedPartners": 1,
  "partnersByType": 1,
  "partnersByTier": 1
}
```

### ResponseWrapperPartnerStatistics
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "totalPartners": 1,
    "activePartners": 1,
    "verifiedPartners": 1,
    "partnersByType": 1,
    "partnersByTier": 1
  }
}
```

### ResponseWrapperListPartnerSummaryDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "code": "string",
      "businessName": "string",
      "legalName": "string",
      "email": "string",
      "phoneNumber": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "status": "ACTIVE",
      "type": "INDIVIDUAL",
      "tier": "BRONZE",
      "isActive": true,
      "isVerified": true,
      "commissionRate": 0.0,
      "contactPersonName": "string",
      "createdAt": "2023-10-22T00:00:00Z"
    }
  ]
}
```

### ApiKeyStatus
```json
{
  "exists": true,
  "createdAt": "2023-10-22T00:00:00Z",
  "lastUsedAt": "2023-10-22T00:00:00Z",
  "expiresAt": "2023-10-22T00:00:00Z",
  "usageCount": 1,
  "keyName": "string",
  "environment": "string",
  "permissions": [
    "string"
  ],
  "expired": true,
  "usable": true,
  "active": true
}
```

### ResponseWrapperApiKeyStatus
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "exists": true,
    "createdAt": "2023-10-22T00:00:00Z",
    "lastUsedAt": "2023-10-22T00:00:00Z",
    "expiresAt": "2023-10-22T00:00:00Z",
    "usageCount": 1,
    "keyName": "string",
    "environment": "string",
    "permissions": [
      "string"
    ],
    "expired": true,
    "usable": true,
    "active": true
  }
}
```

### KeyRotationStatus
```json
{
  "enabled": true,
  "batchSize": 0
}
```

### ResponseWrapperKeyRotationStatus
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "enabled": true,
    "batchSize": 0
  }
}
```

### PageResponseWrapperGroupAgentCoreBusSystemResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "externalAgentIdentifier": "string",
      "username": "string",
      "txnUserName": "string",
      "isActive": true,
      "isPrimary": true,
      "externalSystemStatus": "string",
      "externalAgentId": "string",
      "configuration": "string",
      "endpointUrl": "string",
      "timeoutSeconds": 0,
      "retryAttempts": 0,
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z",
      "createdBy": "string",
      "updatedBy": "string",
      "lastAuthenticationDate": "2023-10-22T00:00:00Z",
      "lastSyncDate": "2023-10-22T00:00:00Z",
      "notes": "string",
      "busCoreSystemId": 1,
      "busCoreSystemUid": "string",
      "busCoreSystemCode": "string",
      "busCoreSystemName": "string",
      "busCoreSystemProviderName": "string",
      "busCoreSystemBaseUrl": "string",
      "groupAgentId": 1,
      "groupAgentUid": "string",
      "groupAgentCode": "string",
      "groupAgentName": "string",
      "partnerId": 1,
      "partnerUid": "string",
      "partnerCode": "string",
      "partnerBusinessName": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### DecryptedGroupAgentCredentials
```json
{
  "username": "string",
  "password": "string",
  "txnUserName": "string",
  "txnPassword": "string",
  "apiKey": "string",
  "apiSecret": "string",
  "accessToken": "string",
  "refreshToken": "string"
}
```

### ResponseWrapperDecryptedGroupAgentCredentials
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "username": "string",
    "password": "string",
    "txnUserName": "string",
    "txnPassword": "string",
    "apiKey": "string",
    "apiSecret": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### GroupAgentStatsDto
```json
{
  "totalGroupAgents": 1,
  "activeGroupAgents": 1,
  "suspendedGroupAgents": 1,
  "inactiveGroupAgents": 1,
  "standardGroupAgents": 1,
  "premiumGroupAgents": 1,
  "enterpriseGroupAgents": 1,
  "franchiseGroupAgents": 1,
  "corporateGroupAgents": 1,
  "totalBusCoreSystemAssignments": 1,
  "activeBusCoreSystemAssignments": 1,
  "totalAssignedAgents": 1,
  "activeAssignedAgents": 1,
  "groupAgentsWithRecentActivity": 1,
  "recentBusCoreSystemAuthentications": 1,
  "recentBusCoreSystemSyncs": 1
}
```

### ResponseWrapperGroupAgentStatsDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "totalGroupAgents": 1,
    "activeGroupAgents": 1,
    "suspendedGroupAgents": 1,
    "inactiveGroupAgents": 1,
    "standardGroupAgents": 1,
    "premiumGroupAgents": 1,
    "enterpriseGroupAgents": 1,
    "franchiseGroupAgents": 1,
    "corporateGroupAgents": 1,
    "totalBusCoreSystemAssignments": 1,
    "activeBusCoreSystemAssignments": 1,
    "totalAssignedAgents": 1,
    "activeAssignedAgents": 1,
    "groupAgentsWithRecentActivity": 1,
    "recentBusCoreSystemAuthentications": 1,
    "recentBusCoreSystemSyncs": 1
  }
}
```

### ResponseWrapperListGroupAgentResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "code": "string",
      "name": "string",
      "description": "string",
      "externalSystemIdentifier": "string",
      "type": "STANDARD",
      "status": "ACTIVE",
      "contactPerson": "string",
      "contactEmail": "string",
      "contactPhone": "string",
      "businessName": "string",
      "businessAddress": "string",
      "taxId": "string",
      "licenseNumber": "string",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z",
      "activatedAt": "2023-10-22T00:00:00Z",
      "lastActivityDate": "2023-10-22T00:00:00Z",
      "notes": "string",
      "partnerId": 1,
      "partnerUid": "string",
      "partnerCode": "string",
      "partnerBusinessName": "string",
      "agentCount": 0,
      "busCoreSystemCount": 0,
      "activeBusCoreSystemCount": 0,
      "busCoreSystems": [
        {
          "id": 1,
          "uid": "string",
          "externalAgentIdentifier": "string",
          "username": "string",
          "isActive": true,
          "isPrimary": true,
          "externalSystemStatus": "string",
          "busCoreSystemId": 1,
          "busCoreSystemCode": "string",
          "busCoreSystemName": "string",
          "busCoreSystemProviderName": "string",
          "lastAuthenticationDate": "2023-10-22T00:00:00Z",
          "lastSyncDate": "2023-10-22T00:00:00Z"
        }
      ]
    }
  ]
}
```

### ResponseWrapperListBusCoreSystemResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "code": "string",
      "name": "string",
      "providerName": "string",
      "baseUrl": "string",
      "description": "string",
      "isDefault": true,
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z",
      "createdBy": "string",
      "updatedBy": "string"
    }
  ]
}
```

### AgentPasswordResetResponseDto
```json
{
  "agentUid": "string",
  "agentPassName": "string",
  "agentPartnerNumber": "string",
  "newPassword": "string",
  "emailSent": true,
  "smsSent": true,
  "resetAt": "2023-10-22T00:00:00Z"
}
```

### ResponseWrapperAgentPasswordResetResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "agentUid": "string",
    "agentPassName": "string",
    "agentPartnerNumber": "string",
    "newPassword": "string",
    "emailSent": true,
    "smsSent": true,
    "resetAt": "2023-10-22T00:00:00Z"
  }
}
```

### AssignAgentToBusCoreSystemRequest
```json
{
  "agentId": 1,
  "busCoreSystemId": 1,
  "agentLoginName": "string",
  "password": "string",
  "txnUserName": "string",
  "txnPassword": "string",
  "isActive": true,
  "isPrimary": true,
  "agentStatusInBusCore": "string",
  "busCoreAgentId": "string"
}
```

### ResponseWrapperUserPermissionsResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "userUid": "string",
    "username": "string",
    "userType": "string",
    "partnerUid": "string",
    "partnerName": "string",
    "roles": [
      "string"
    ],
    "permissions": [
      {
        "id": 1,
        "uid": "string",
        "name": "string",
        "action": "string",
        "resource": "string",
        "description": "string",
        "createdAt": "2023-10-22T00:00:00Z",
        "updatedAt": "2023-10-22T00:00:00Z"
      }
    ],
    "totalPermissions": 0,
    "groupedByResource": {
      "key": 0
    }
  }
}
```

### UserPermissionsResponseDto
```json
{
  "userUid": "string",
  "username": "string",
  "userType": "string",
  "partnerUid": "string",
  "partnerName": "string",
  "roles": [
    "string"
  ],
  "permissions": [
    {
      "id": 1,
      "uid": "string",
      "name": "string",
      "action": "string",
      "resource": "string",
      "description": "string",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z"
    }
  ],
  "totalPermissions": 0,
  "groupedByResource": {
    "key": 0
  }
}
```

### PageResponseWrapperSystemUserResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "userId": 1,
      "username": "string",
      "email": "string",
      "displayName": "string",
      "userType": "SYSTEM_USER",
      "enabled": true,
      "accountNonExpired": true,
      "accountNonLocked": true,
      "credentialsNonExpired": true,
      "requirePasswordChange": true,
      "partnerId": 1,
      "partnerName": "string",
      "partnerCode": "string",
      "firstName": "string",
      "lastName": "string",
      "systemUserDisplayName": "string",
      "phoneNumber": "string",
      "personalEmail": "string",
      "dateOfBirth": "2023-10-22",
      "gender": "string",
      "employeeId": "string",
      "department": "string",
      "position": "string",
      "officeLocation": "string",
      "workPhone": "string",
      "workEmail": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "postalCode": "string",
      "nationalId": "string",
      "passportNumber": "string",
      "status": "ACTIVE",
      "preferredLanguage": "string",
      "timezone": "string",
      "profilePictureUrl": "string",
      "emergencyContactName": "string",
      "emergencyContactPhone": "string",
      "registrationDate": "2023-10-22T00:00:00Z",
      "lastLoginDate": "2023-10-22T00:00:00Z",
      "passwordChangedDate": "2023-10-22T00:00:00Z",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z",
      "createdBy": "string",
      "updatedBy": "string",
      "emailVerified": true,
      "phoneVerified": true,
      "verified": true,
      "active": true,
      "fullName": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### CreateGroupAgentRequestDto
```json
{
  "partnerId": 1,
  "code": "string",
  "name": "string",
  "description": "string",
  "externalSystemIdentifier": "string",
  "type": "STANDARD",
  "contactPerson": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "businessName": "string",
  "businessAddress": "string",
  "taxId": "string",
  "licenseNumber": "string",
  "notes": "string"
}
```

### AssignGroupAgentToBusCoreSystemRequest
```json
{
  "groupAgentId": 1,
  "busCoreSystemId": 1,
  "externalAgentIdentifier": "string",
  "username": "string",
  "password": "string",
  "txnUserName": "string",
  "txnPassword": "string",
  "apiKey": "string",
  "apiSecret": "string",
  "isPrimary": true,
  "configuration": "string",
  "endpointUrl": "string",
  "timeoutSeconds": 0,
  "retryAttempts": 0,
  "notes": "string"
}
```

### GroupAgentSearchRequestDto
```json
{
  "partnerId": 1,
  "partnerUid": "string",
  "searchTerm": "string",
  "status": "ACTIVE",
  "type": "STANDARD",
  "createdFrom": "2023-10-22T00:00:00Z",
  "createdTo": "2023-10-22T00:00:00Z",
  "lastActivityFrom": "2023-10-22T00:00:00Z",
  "lastActivityTo": "2023-10-22T00:00:00Z",
  "page": 0,
  "size": 20,
  "sortBy": "string",
  "sortDirection": "string",
  "includeBusCoreSystems": true,
  "includeAgentCount": true
}
```

### PageResponseWrapperGroupAgentResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "code": "string",
      "name": "string",
      "description": "string",
      "externalSystemIdentifier": "string",
      "type": "STANDARD",
      "status": "ACTIVE",
      "contactPerson": "string",
      "contactEmail": "string",
      "contactPhone": "string",
      "businessName": "string",
      "businessAddress": "string",
      "taxId": "string",
      "licenseNumber": "string",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z",
      "activatedAt": "2023-10-22T00:00:00Z",
      "lastActivityDate": "2023-10-22T00:00:00Z",
      "notes": "string",
      "partnerId": 1,
      "partnerUid": "string",
      "partnerCode": "string",
      "partnerBusinessName": "string",
      "agentCount": 0,
      "busCoreSystemCount": 0,
      "activeBusCoreSystemCount": 0,
      "busCoreSystems": [
        {
          "id": 1,
          "uid": "string",
          "externalAgentIdentifier": "string",
          "username": "string",
          "isActive": true,
          "isPrimary": true,
          "externalSystemStatus": "string",
          "busCoreSystemId": 1,
          "busCoreSystemCode": "string",
          "busCoreSystemName": "string",
          "busCoreSystemProviderName": "string",
          "lastAuthenticationDate": "2023-10-22T00:00:00Z",
          "lastSyncDate": "2023-10-22T00:00:00Z"
        }
      ]
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### CreateBusCoreSystemRequestDto
```json
{
  "code": "string",
  "name": "string",
  "providerName": "string",
  "baseUrl": "string",
  "description": "string",
  "isDefault": true
}
```

### ResponseWrapperListAgentBusCoreSystemResponseDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "uid": "string",
      "agentId": 1,
      "agentName": "string",
      "agentContactPerson": "string",
      "agentBusinessName": "string",
      "agentPhoneNumber": "string",
      "agentEmail": "string",
      "busCoreSystemId": 1,
      "busCoreSystemName": "string",
      "busCoreSystemCode": "string",
      "agentLoginName": "string",
      "password": "string",
      "txnUserName": "string",
      "txnPassword": "string",
      "agentStatusInBusCore": "string",
      "isActive": true,
      "isPrimary": true,
      "busCoreAgentId": "string",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z",
      "createdBy": "string",
      "updatedBy": "string",
      "lastAuthenticationDate": "2023-10-22T00:00:00Z",
      "lastBookingDate": "2023-10-22T00:00:00Z",
      "activeInBusCore": true
    }
  ]
}
```

### AdminBookingDetailDto
```json
{
  "uid": "01HXYZ123456789ABCDEFGHIJK",
  "partnerUid": "01HXYZ123456789PARTNER001",
  "partnerName": "ABC Tours",
  "agentUid": "01HXYZ123456789AGENT0001",
  "agentUsername": "agent.john",
  "agentFullName": "John Smith",
  "busCoreSystemUid": "01HXYZ123456789SYSTEM001",
  "busCoreSystemName": "BMSLG",
  "companyName": "Express Bus Lines",
  "companyCode": "EBL001",
  "companyRegistrationNumber": "REG123456",
  "busNumber": "BUS-001",
  "busType": "EXPRESS",
  "busModel": "Scania Luxury",
  "busPlateNumber": "T123ABC",
  "busCapacity": 45,
  "routeName": "Dar es Salaam - Arusha",
  "departureStation": "Ubungo Terminal",
  "arrivalStation": "Arusha Terminal",
  "departureDate": "2024-01-15",
  "departureTime": {
    "hour": 0,
    "minute": 0,
    "second": 0,
    "nano": 0
  },
  "arrivalTime": {
    "hour": 0,
    "minute": 0,
    "second": 0,
    "nano": 0
  },
  "estimatedDurationMinutes": 420,
  "totalBookingFare": 100000,
  "baseFare": 90000,
  "taxAmount": 5000,
  "serviceCharge": 3000,
  "discountAmount": 0,
  "currency": "TZS",
  "paymentMethod": "MOBILE_MONEY",
  "paymentStatus": "PAID",
  "status": "CONFIRMED",
  "externalBookingId": "BMSLG-123456",
  "externalRouteId": "ROUTE-001",
  "externalBusId": "BUS-EXT-001",
  "externalReference": "REF-123456",
  "passengers": [
    {
      "uid": "01HXYZ123456789ABCDEFGHIJK",
      "fullName": "John Doe",
      "gender": "MALE",
      "category": "ADULT",
      "passportNumber": "A1234567",
      "nationalId": "123456789",
      "phoneNumber": "255700000000",
      "email": "john.doe@example.com",
      "boardingPoint": "Ubungo Terminal",
      "droppingPoint": "Arusha Terminal",
      "boardingTime": {
        "hour": 0,
        "minute": 0,
        "second": 0,
        "nano": 0
      },
      "droppingTime": {
        "hour": 0,
        "minute": 0,
        "second": 0,
        "nano": 0
      },
      "seatId": "A1",
      "individualFare": 25000,
      "ticketStatus": "ACTIVE",
      "ticketNumber": "TKT-123456",
      "ticketIssuedAt": "2023-10-22T00:00:00Z",
      "ticketExpiresAt": "2023-10-22T00:00:00Z",
      "isCancelled": false,
      "cancelledAt": "2023-10-22T00:00:00Z",
      "cancellationReason": "Change of travel plans",
      "cancellationType": "PASSENGER_REQUEST",
      "refundAmount": 20000,
      "refundStatus": "NONE",
      "refundProcessedAt": "2023-10-22T00:00:00Z",
      "refundReference": "REF-123456",
      "externalTicketId": "EXT-TKT-123",
      "externalPassengerId": "EXT-PASS-123",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z"
    }
  ],
  "notes": "Special request for window seat",
  "bookingSource": "API",
  "promoCode": "SUMMER2024",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z"
}
```

### AdminPassengerDetailDto
```json
{
  "uid": "01HXYZ123456789ABCDEFGHIJK",
  "fullName": "John Doe",
  "gender": "MALE",
  "category": "ADULT",
  "passportNumber": "A1234567",
  "nationalId": "123456789",
  "phoneNumber": "255700000000",
  "email": "john.doe@example.com",
  "boardingPoint": "Ubungo Terminal",
  "droppingPoint": "Arusha Terminal",
  "boardingTime": {
    "hour": 0,
    "minute": 0,
    "second": 0,
    "nano": 0
  },
  "droppingTime": {
    "hour": 0,
    "minute": 0,
    "second": 0,
    "nano": 0
  },
  "seatId": "A1",
  "individualFare": 25000,
  "ticketStatus": "ACTIVE",
  "ticketNumber": "TKT-123456",
  "ticketIssuedAt": "2023-10-22T00:00:00Z",
  "ticketExpiresAt": "2023-10-22T00:00:00Z",
  "isCancelled": false,
  "cancelledAt": "2023-10-22T00:00:00Z",
  "cancellationReason": "Change of travel plans",
  "cancellationType": "PASSENGER_REQUEST",
  "refundAmount": 20000,
  "refundStatus": "NONE",
  "refundProcessedAt": "2023-10-22T00:00:00Z",
  "refundReference": "REF-123456",
  "externalTicketId": "EXT-TKT-123",
  "externalPassengerId": "EXT-PASS-123",
  "createdAt": "2023-10-22T00:00:00Z",
  "updatedAt": "2023-10-22T00:00:00Z"
}
```

### LocalTime
```json
{
  "hour": 0,
  "minute": 0,
  "second": 0,
  "nano": 0
}
```

### PageResponseWrapperAdminBookingDetailDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "uid": "01HXYZ123456789ABCDEFGHIJK",
      "partnerUid": "01HXYZ123456789PARTNER001",
      "partnerName": "ABC Tours",
      "agentUid": "01HXYZ123456789AGENT0001",
      "agentUsername": "agent.john",
      "agentFullName": "John Smith",
      "busCoreSystemUid": "01HXYZ123456789SYSTEM001",
      "busCoreSystemName": "BMSLG",
      "companyName": "Express Bus Lines",
      "companyCode": "EBL001",
      "companyRegistrationNumber": "REG123456",
      "busNumber": "BUS-001",
      "busType": "EXPRESS",
      "busModel": "Scania Luxury",
      "busPlateNumber": "T123ABC",
      "busCapacity": 45,
      "routeName": "Dar es Salaam - Arusha",
      "departureStation": "Ubungo Terminal",
      "arrivalStation": "Arusha Terminal",
      "departureDate": "2024-01-15",
      "departureTime": {
        "hour": 0,
        "minute": 0,
        "second": 0,
        "nano": 0
      },
      "arrivalTime": {
        "hour": 0,
        "minute": 0,
        "second": 0,
        "nano": 0
      },
      "estimatedDurationMinutes": 420,
      "totalBookingFare": 100000,
      "baseFare": 90000,
      "taxAmount": 5000,
      "serviceCharge": 3000,
      "discountAmount": 0,
      "currency": "TZS",
      "paymentMethod": "MOBILE_MONEY",
      "paymentStatus": "PAID",
      "status": "CONFIRMED",
      "externalBookingId": "BMSLG-123456",
      "externalRouteId": "ROUTE-001",
      "externalBusId": "BUS-EXT-001",
      "externalReference": "REF-123456",
      "passengers": [
        {
          "uid": "01HXYZ123456789ABCDEFGHIJK",
          "fullName": "John Doe",
          "gender": "MALE",
          "category": "ADULT",
          "passportNumber": "A1234567",
          "nationalId": "123456789",
          "phoneNumber": "255700000000",
          "email": "john.doe@example.com",
          "boardingPoint": "Ubungo Terminal",
          "droppingPoint": "Arusha Terminal",
          "boardingTime": {
            "hour": 0,
            "minute": 0,
            "second": 0,
            "nano": 0
          },
          "droppingTime": {
            "hour": 0,
            "minute": 0,
            "second": 0,
            "nano": 0
          },
          "seatId": "A1",
          "individualFare": 25000,
          "ticketStatus": "ACTIVE",
          "ticketNumber": "TKT-123456",
          "ticketIssuedAt": "2023-10-22T00:00:00Z",
          "ticketExpiresAt": "2023-10-22T00:00:00Z",
          "isCancelled": false,
          "cancelledAt": "2023-10-22T00:00:00Z",
          "cancellationReason": "Change of travel plans",
          "cancellationType": "PASSENGER_REQUEST",
          "refundAmount": 20000,
          "refundStatus": "NONE",
          "refundProcessedAt": "2023-10-22T00:00:00Z",
          "refundReference": "REF-123456",
          "externalTicketId": "EXT-TKT-123",
          "externalPassengerId": "EXT-PASS-123",
          "createdAt": "2023-10-22T00:00:00Z",
          "updatedAt": "2023-10-22T00:00:00Z"
        }
      ],
      "notes": "Special request for window seat",
      "bookingSource": "API",
      "promoCode": "SUMMER2024",
      "createdAt": "2023-10-22T00:00:00Z",
      "updatedAt": "2023-10-22T00:00:00Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### ResponseWrapperAdminBookingDetailDto
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "uid": "01HXYZ123456789ABCDEFGHIJK",
    "partnerUid": "01HXYZ123456789PARTNER001",
    "partnerName": "ABC Tours",
    "agentUid": "01HXYZ123456789AGENT0001",
    "agentUsername": "agent.john",
    "agentFullName": "John Smith",
    "busCoreSystemUid": "01HXYZ123456789SYSTEM001",
    "busCoreSystemName": "BMSLG",
    "companyName": "Express Bus Lines",
    "companyCode": "EBL001",
    "companyRegistrationNumber": "REG123456",
    "busNumber": "BUS-001",
    "busType": "EXPRESS",
    "busModel": "Scania Luxury",
    "busPlateNumber": "T123ABC",
    "busCapacity": 45,
    "routeName": "Dar es Salaam - Arusha",
    "departureStation": "Ubungo Terminal",
    "arrivalStation": "Arusha Terminal",
    "departureDate": "2024-01-15",
    "departureTime": {
      "hour": 0,
      "minute": 0,
      "second": 0,
      "nano": 0
    },
    "arrivalTime": {
      "hour": 0,
      "minute": 0,
      "second": 0,
      "nano": 0
    },
    "estimatedDurationMinutes": 420,
    "totalBookingFare": 100000,
    "baseFare": 90000,
    "taxAmount": 5000,
    "serviceCharge": 3000,
    "discountAmount": 0,
    "currency": "TZS",
    "paymentMethod": "MOBILE_MONEY",
    "paymentStatus": "PAID",
    "status": "CONFIRMED",
    "externalBookingId": "BMSLG-123456",
    "externalRouteId": "ROUTE-001",
    "externalBusId": "BUS-EXT-001",
    "externalReference": "REF-123456",
    "passengers": [
      {
        "uid": "01HXYZ123456789ABCDEFGHIJK",
        "fullName": "John Doe",
        "gender": "MALE",
        "category": "ADULT",
        "passportNumber": "A1234567",
        "nationalId": "123456789",
        "phoneNumber": "255700000000",
        "email": "john.doe@example.com",
        "boardingPoint": "Ubungo Terminal",
        "droppingPoint": "Arusha Terminal",
        "boardingTime": {
          "hour": 0,
          "minute": 0,
          "second": 0,
          "nano": 0
        },
        "droppingTime": {
          "hour": 0,
          "minute": 0,
          "second": 0,
          "nano": 0
        },
        "seatId": "A1",
        "individualFare": 25000,
        "ticketStatus": "ACTIVE",
        "ticketNumber": "TKT-123456",
        "ticketIssuedAt": "2023-10-22T00:00:00Z",
        "ticketExpiresAt": "2023-10-22T00:00:00Z",
        "isCancelled": false,
        "cancelledAt": "2023-10-22T00:00:00Z",
        "cancellationReason": "Change of travel plans",
        "cancellationType": "PASSENGER_REQUEST",
        "refundAmount": 20000,
        "refundStatus": "NONE",
        "refundProcessedAt": "2023-10-22T00:00:00Z",
        "refundReference": "REF-123456",
        "externalTicketId": "EXT-TKT-123",
        "externalPassengerId": "EXT-PASS-123",
        "createdAt": "2023-10-22T00:00:00Z",
        "updatedAt": "2023-10-22T00:00:00Z"
      }
    ],
    "notes": "Special request for window seat",
    "bookingSource": "API",
    "promoCode": "SUMMER2024",
    "createdAt": "2023-10-22T00:00:00Z",
    "updatedAt": "2023-10-22T00:00:00Z"
  }
}
```

## Conclusion

This documentation covers all endpoints, requests, and responses from the provided OpenAPI spec. For UI integration, focus on authentication flows first (login, refresh), then administrative operations. Use the schemas for data validation and display. If you need code samples (e.g., in JavaScript for fetch/API calls) or further clarification, let me know.