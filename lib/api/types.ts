/**
 * TypeScript types for OBUS Partner API responses
 * Based on the API documentation schemas
 */

// Base types
export type UserType =
  | "ROOT_USER"
  | "SYSTEM_USER"
  | "PARTNER_USER"
  | "PARTNER_AGENT";

// User roles from session-config endpoint
export type UserRole =
  | "ROOT_ADMIN"
  | "SYSTEM_ADMIN"
  | "SYSTEM_SUPPORT"
  | "PARTNER_ADMIN"
  | "PARTNER_ONBOARDING_STAFF"
  | "PARTNER_CUSTOMER_SUPPORT"
  | "PARTNER_AGENT";
export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING_VERIFICATION"
  | "LOCKED";
export type PartnerType = "INDIVIDUAL" | "COMPANY";
export type PartnerTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
export type PartnerStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING_VERIFICATION"
  | "REJECTED"
  | "TERMINATED";
export type AgentType = "INDIVIDUAL" | "COMPANY";
export type AgentStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type PaymentMethod =
  | "CASH"
  | "MOBILE_MONEY"
  | "BANK_TRANSFER"
  | "CREDIT_CARD";
export type PaymentStatus =
  | "PAID"
  | "PENDING"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";
export type BookingStatus =
  | "CONFIRMED"
  | "PENDING"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";
export type BookingSource =
  | "WEB"
  | "MOBILE_APP"
  | "API"
  | "AGENT"
  | "CALL_CENTER";
export type TicketStatus = "ACTIVE" | "USED" | "CANCELLED" | "EXPIRED";

// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  type: string;
  username: string;
  email: string;
  userType: string;
  requireResetPassword: boolean;
  partnerId: number;
  partnerUid: string;
  partnerCode: string;
  partnerBusinessName: string;
  displayName: string;
  roles: string[];
  tokenExpiresAt: string;
  agentId: number;
  agentStatus: string;
  lastLoginAt: string;
  permissions: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmPasswordResetRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Session Config types
export interface EnumItem {
  value: string;
  displayName: string;
  description: string;
}

export interface AdminConfigResponse {
  userTypes: EnumItem[];
  userRoles: EnumItem[];
}

export interface SessionConfigResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: AdminConfigResponse;
}

// System User types
export interface SystemUserResponseDto {
  id: number;
  uid: string;
  userId: number;
  userUid?: string;
  username: string;
  email: string;
  displayName: string;
  userType: UserType | "ROOT_USER";
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
  dateOfBirth?: string | null;
  gender: string;
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
  status?: string;
  preferredLanguage: string;
  timezone: string;
  profilePictureUrl?: string | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  registrationDate?: string;
  lastLoginDate?: string | null;
  passwordChangedDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verified?: boolean;
  active?: boolean;
  fullName?: string;
}

export interface CreatePartnerUserRequestDto {
  username: string;
  email: string;
  displayName: string;
  partnerId: number;
  firstName: string;
  lastName: string;
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
  timezone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface CreateAdminUserRequestDto {
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
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
  timezone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface UpdateSystemUserRequestDto {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
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
  timezone: string;
  profilePictureUrl: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: UserStatus;
}

// Partner types
export interface PartnerResponseDto {
  id: number;
  uid: string;
  code: string;
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: PartnerStatus;
  type: PartnerType;
  tier: PartnerTier;
  isActive: boolean;
  isVerified: boolean;
  commissionRate: number;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdByUsername: string;
  createdByEmail: string;
  updatedByUsername: string;
  updatedByEmail: string;
}

export interface PartnerSummaryDto {
  id: number;
  uid: string;
  code: string;
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  status: PartnerStatus;
  type: PartnerType;
  tier: PartnerTier;
  isActive: boolean;
  isVerified: boolean;
  commissionRate: number;
  contactPersonName: string;
  createdAt: string;
}

export interface UpdatePartnerRequestDto {
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: PartnerStatus;
  type: PartnerType;
  tier: PartnerTier;
  isActive: boolean;
  isVerified: boolean;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  commissionRate: number;
  description: string;
  notes: string;
}

export interface CreatePartnerRequestDto {
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: PartnerType;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  description: string;
  notes: string;
}

export interface PartnerSearchRequestDto {
  searchTerm?: string;
  status?: PartnerStatus;
  type?: PartnerType;
  tier?: PartnerTier;
  city?: string;
  state?: string;
  country?: string;
  isActive?: boolean;
  isVerified?: boolean;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface PartnerStatistics {
  totalPartners: number;
  activePartners: number;
  verifiedPartners: number;
  pendingApproval: number;
  partnersByType: number;
  partnersByTier: number;
}

// Agent types
export interface AgentResponseDto {
  id: number;
  uid: string;
  code: string;
  partnerAgentNumber: string;
  passName: string;
  passCode: string;
  businessName: string;
  contactPerson: string;
  phoneNumber: string;
  msisdn: string;
  businessEmail: string;
  businessAddress: string;
  taxId: string;
  licenseNumber: string;
  name: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  nationality: string;
  phoneNo: string;
  email: string;
  personalAddress: string;
  nidaNo: string;
  agentType: AgentType;
  status: AgentStatus;
  registrationDate: string;
  approvalDate: string;
  lastActivityDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  partnerId: number;
  partnerUid: string;
  partnerCode: string;
  partnerBusinessName: string;
  superAgentId: number;
  superAgentUid: string;
  superAgentCode: string;
  superAgentBusinessName: string;
  userId: number;
  userUsername: string;
  userEmail: string;
}

export interface AgentSummaryDto {
  id: number;
  uid: string;
  code: string;
  partnerAgentNumber: string;
  passName: string;
  businessName: string;
  contactPerson: string;
  agentType: AgentType;
  status: AgentStatus;
  registrationDate: string;
  partnerId: number;
  partnerCode: string;
  partnerBusinessName: string;
  superAgentId: number;
  superAgentCode: string;
  superAgentBusinessName: string;
}

export interface UpdateAgentStatusRequestDto {
  status: AgentStatus;
  reason: string;
  notes: string;
}

export interface AgentPasswordResetResponseDto {
  agentUid: string;
  agentPassName: string;
  agentPartnerNumber: string;
  newPassword: string;
  emailSent: boolean;
  smsSent: boolean;
  resetAt: string;
}

// Additional types for agents management
export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  pendingApproval: number;
  averageRating: number;
}

export interface AgentFilters {
  status?: AgentStatus;
  agentType?: AgentType;
  partnerId?: number;
  search?: string;
}

export interface AgentListParams extends PageRequest {
  filters?: AgentFilters;
}

// Super Agent types
export interface SuperAgentStatistics {
  totalSuperAgents: number;
  activeSuperAgents: number;
  pendingSuperAgents: number;
  suspendedSuperAgents: number;
  totalSubAgents: number;
  activeSubAgents: number;
}

// Group Agent types
export interface GroupAgentResponseDto {
  id: number;
  uid: string;
  code: string;
  name: string;
  description: string;
  externalSystemIdentifier: string;
  type: string;
  status: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
  activatedAt: string;
  lastActivityDate: string;
  notes: string;
  partnerId: number;
  partnerUid: string;
  partnerCode: string;
  partnerBusinessName: string;
  agentCount: number;
  busCoreSystemCount: number;
  activeBusCoreSystemCount: number;
  busCoreSystems: GroupAgentCoreBusSystemSummaryDto[];
}

export interface GroupAgentCoreBusSystemSummaryDto {
  id: number;
  uid: string;
  externalAgentIdentifier: string;
  username: string;
  isActive: boolean;
  isPrimary: boolean;
  externalSystemStatus: string;
  busCoreSystemId: number;
  busCoreSystemCode: string;
  busCoreSystemName: string;
  busCoreSystemProviderName: string;
  lastAuthenticationDate: string;
  lastSyncDate: string;
}

export interface CreateGroupAgentRequestDto {
  partnerId: number;
  code: string;
  name: string;
  description: string;
  externalSystemIdentifier: string;
  type: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  licenseNumber: string;
  notes: string;
}

export interface UpdateGroupAgentRequestDto {
  code: string;
  name: string;
  description: string;
  externalSystemIdentifier: string;
  type: string;
  status: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  licenseNumber: string;
  notes: string;
}

export interface GroupAgentSearchRequestDto {
  partnerId: number;
  partnerUid: string;
  searchTerm: string;
  status: string;
  type: string;
  createdFrom: string;
  createdTo: string;
  lastActivityFrom: string;
  lastActivityTo: string;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: string;
  includeBusCoreSystems: boolean;
  includeAgentCount: boolean;
}

export interface GroupAgentStatsDto {
  totalGroupAgents: number;
  activeGroupAgents: number;
  suspendedGroupAgents: number;
  inactiveGroupAgents: number;
  standardGroupAgents: number;
  premiumGroupAgents: number;
  enterpriseGroupAgents: number;
  franchiseGroupAgents: number;
  corporateGroupAgents: number;
  totalBusCoreSystemAssignments: number;
  activeBusCoreSystemAssignments: number;
  totalAssignedAgents: number;
  activeAssignedAgents: number;
  groupAgentsWithRecentActivity: number;
  recentBusCoreSystemAuthentications: number;
  recentBusCoreSystemSyncs: number;
}

// Role and Permission types
export interface RoleResponseDto {
  id: number;
  uid: string;
  name: string;
  displayName: string;
  description: string;
  active: boolean;
  permissionCount: number;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionResponseDto {
  id: number;
  uid: string;
  name: string;
  action: string;
  resource: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionSummaryDto {
  uid: string;
  name: string;
  action: string;
  resource: string;
}

export interface RoleWithPermissionsDto {
  id: number;
  uid: string;
  name: string;
  displayName: string;
  description: string;
  active: boolean;
  permissions: PermissionSummaryDto[];
  totalPermissions: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissionsResponseDto {
  userUid: string;
  username: string;
  userType: string;
  partnerUid: string;
  partnerName: string;
  roles: string[];
  permissions: PermissionResponseDto[];
  totalPermissions: number;
  groupedByResource: Record<string, number>;
}

// Booking types
export interface AdminBookingDetailDto {
  uid: string;
  partnerUid: string;
  partnerName: string;
  agentUid: string;
  agentUsername: string;
  agentFullName: string;
  busCoreSystemUid: string;
  busCoreSystemName: string;
  companyName: string;
  companyCode: string;
  companyRegistrationNumber: string;
  busNumber: string;
  busType: string;
  busModel: string;
  busPlateNumber: string;
  busCapacity: number;
  routeName: string;
  departureStation: string;
  arrivalStation: string;
  departureDate: string;
  departureTime: LocalTime;
  arrivalTime: LocalTime;
  estimatedDurationMinutes: number;
  totalBookingFare: number;
  baseFare: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  externalBookingId: string;
  externalRouteId: string;
  externalBusId: string;
  externalReference: string;
  passengers: AdminPassengerDetailDto[];
  notes: string;
  bookingSource: string;
  promoCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPassengerDetailDto {
  uid: string;
  fullName: string;
  gender: string;
  category: string;
  passportNumber: string;
  nationalId: string;
  phoneNumber: string;
  email: string;
  boardingPoint: string;
  droppingPoint: string;
  boardingTime: LocalTime;
  droppingTime: LocalTime;
  seatId: string;
  individualFare: number;
  ticketStatus: TicketStatus;
  ticketNumber: string;
  ticketIssuedAt: string;
  ticketExpiresAt: string;
  isCancelled: boolean;
  cancelledAt: string;
  cancellationReason: string;
  cancellationType: string;
  refundAmount: number;
  refundStatus: string;
  refundProcessedAt: string;
  refundReference: string;
  externalTicketId: string;
  externalPassengerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

// Bus Core System types
export interface BusCoreSystemResponseDto {
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
  createdBy: string;
  updatedBy: string;
}

export interface CreateBusCoreSystemRequestDto {
  code: string;
  name: string;
  providerName: string;
  baseUrl: string;
  description: string;
  isDefault: boolean;
}

export interface UpdateBusCoreSystemRequestDto {
  code: string;
  name: string;
  providerName: string;
  baseUrl: string;
  description: string;
  isDefault: boolean;
}

// API Key types
export interface ApiKeySummary {
  apiKeyUid: string;
  keyName: string;
  description: string;
  environment: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  usageCount: number;
  active: boolean;
  primary: boolean;
}

export interface CreateApiKeyRequestDto {
  keyName: string;
  description: string;
  environment: string;
  permissions: string[];
  expiresAt: string;
}

export interface ApiKeyStatus {
  exists: boolean;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  usageCount: number;
  keyName: string;
  environment: string;
  permissions: string[];
  expired: boolean;
  usable: boolean;
  active: boolean;
}

// Session Config types
export interface AdminConfigResponse {
  userTypes: EnumItem[];
  userRoles: EnumItem[];
}

export interface EnumItem {
  value: string;
  displayName: string;
  description: string;
}

// Pagination and Response types
export interface PageRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface BulkUpdateTierRequestDto {
  partnerIds: number[];
  tier: PartnerTier;
}

export interface BulkUpdateStatusRequestDto {
  partnerIds: number[];
  status: PartnerStatus;
}

// Super Agents API Types
export interface SuperAgentStatistics {
  totalSuperAgents: number;
  activeSuperAgents: number;
  pendingSuperAgents: number;
  suspendedSuperAgents: number;
  inactiveSuperAgents: number;
  totalSubAgents: number;
  averageSubAgentsPerSuperAgent: number;
  topPerformingSuperAgents: number;
}

export interface CreateSuperAgentRequestDto {
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  description: string;
  partnerUid: string;
}

export interface SuperAgentSearchRequestDto {
  businessName?: string;
  status?: AgentStatus;
  partnerUid?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

// User Management Types

export interface CreateAdminUserRequestDto {
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
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
}

export interface CreatePartnerUserRequestDto {
  username: string;
  email: string;
  displayName: string;
  partnerId: number;
  firstName: string;
  lastName: string;
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
}

export interface UpdateSystemUserRequestDto {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
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
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  pendingVerificationUsers: number;
  lockedUsers: number;
  adminUsers: number;
  partnerUsers: number;
  partnerAgents: number;
  totalDepartments: number;
  averageUsersPerDepartment: number;
}

// Role types
export interface RoleResponseDto {
  id: number;
  uid: string;
  name: string;
  displayName: string;
  description: string;
  active: boolean;
  permissionCount: number;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionDto {
  uid: string;
  name: string;
  action: string;
  resource: string;
}

export interface RoleWithPermissionsDto {
  id: number;
  uid: string;
  name: string;
  displayName: string;
  description: string;
  active: boolean;
  permissions: PermissionDto[];
  totalPermissions: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserRolesResponseDto {
  userUid: string;
  username: string;
  userType: string;
  partnerUid?: string;
  partnerName?: string;
  roles: RoleResponseDto[];
  totalRoles: number;
}

export interface AssignRoleRequest {
  roleName?: string;
  roleId?: number;
  valid: boolean;
}

export interface RoleStatistics {
  totalRoles: number;
  activeRoles: number;
  rolesByType: Record<string, number>;
  totalUsers: number;
}

// Booking-related interfaces
export interface CustomerDto {
  name: string;
  phone: string;
  email?: string;
  idNumber?: string;
}

export interface RouteDto {
  name: string;
  fromLocation: string;
  toLocation: string;
  distance?: number;
  estimatedDuration?: number;
}

export interface BusDto {
  id: number;
  busNumber: string;
  capacity: number;
  busType?: string;
  operator?: string;
}

export interface SeatDto {
  seatNumber: string;
  isAvailable: boolean;
  seatType?: string;
  price?: number;
}

export interface TicketDto {
  id: number;
  uid: string;
  ticketNumber: string;
  seatNumber: string;
  passengerName: string;
  passengerPhone: string;
  ticketStatus: TicketStatus;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatistics {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
  currency: string;
  bookingsByStatus: Record<BookingStatus, number>;
  bookingsBySource: Record<BookingSource, number>;
  averageBookingValue: number;
}

export interface BookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  partnerUid?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Bus Core System types
export interface BusCoreSystemResponseDto {
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

export interface CreateBusCoreSystemRequestDto {
  code: string;
  name: string;
  providerName: string;
  baseUrl: string;
  description: string;
  isDefault: boolean;
}

export interface UpdateBusCoreSystemRequestDto {
  code: string;
  name: string;
  providerName: string;
  baseUrl: string;
  description: string;
  isDefault: boolean;
}

export interface BusCoreSystemFilters {
  search?: string;
  providerName?: string;
  isDefault?: boolean;
}

// Group Agent types
export interface GroupAgentResponseDto {
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
  busCoreSystems?: GroupAgentCoreBusSystemSummaryDto[];
}

export interface GroupAgentCoreBusSystemSummaryDto {
  id: number;
  uid: string;
  externalAgentIdentifier: string;
  username: string;
  isActive: boolean;
  isPrimary: boolean;
  externalSystemStatus: string;
  busCoreSystemId: number;
  busCoreSystemCode: string;
  busCoreSystemName: string;
  busCoreSystemProviderName: string;
  lastAuthenticationDate?: string;
  lastSyncDate?: string;
}

export interface CreateGroupAgentRequestDto {
  partnerId: number;
  code: string;
  name: string;
  description?: string;
  externalSystemIdentifier: string;
  type: "STANDARD" | "CORPORATE" | "AGENCY" | "INDIVIDUAL" | "FRANCHISE";
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessName?: string;
  businessAddress?: string;
  taxId?: string;
  licenseNumber?: string;
  notes?: string;
}

export interface UpdateGroupAgentRequestDto {
  code: string;
  name: string;
  description?: string;
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
  notes?: string;
}

export interface GroupAgentSearchRequestDto {
  partnerId?: number;
  partnerUid?: string;
  searchTerm?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  type?: "STANDARD" | "CORPORATE" | "AGENCY" | "INDIVIDUAL" | "FRANCHISE";
  createdFrom?: string;
  createdTo?: string;
  lastActivityFrom?: string;
  lastActivityTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
  includeBusCoreSystems?: boolean;
  includeAgentCount?: boolean;
}

export interface GroupAgentFilters {
  search?: string;
  partnerId?: number;
  partnerUid?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  type?: "STANDARD" | "CORPORATE" | "AGENCY" | "INDIVIDUAL" | "FRANCHISE";
  createdFrom?: string;
  createdTo?: string;
}

export interface GroupAgentStatsDto {
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
}
