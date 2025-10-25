"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  Mail,
  User2,
  Phone,
  IdCard,
  Briefcase,
  AlertTriangle,
  MapPin,
  Globe,
  Calendar,
  Activity,
  FileText,
  User,
} from "lucide-react";
import { useUsers } from "@/lib/contexts/UsersContext";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params?.id;

  const { currentUser, isLoading, error, loadUserByUid } = useUsers();
  const [userError, setUserError] = React.useState<string | null>(null);

  // Load user data when component mounts
  React.useEffect(() => {
    console.log("UserDetailPage - userId from params:", userId);
    if (userId) {
      console.log("UserDetailPage - Loading user with UID:", userId);
      loadUserByUid(userId as string);
    } else {
      console.warn("UserDetailPage - No userId found in params");
    }
  }, [userId]);

  // Get user type badge styling
  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case "ROOT_USER":
        return "bg-purple-500/20 text-purple-400 hover:bg-purple-500/20";
      case "SYSTEM_USER":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/20";
      case "PARTNER_USER":
        return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20";
      case "PARTNER_AGENT":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/20";
      default:
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20";
    }
  };

  // Get user type display name
  const getUserTypeDisplay = (userType: string) => {
    switch (userType) {
      case "ROOT_USER":
        return "Root Admin";
      case "SYSTEM_USER":
        return "System Admin";
      case "PARTNER_USER":
        return "Partner User";
      case "PARTNER_AGENT":
        return "Partner Agent";
      default:
        return "Unknown";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">User Details</h1>
            <p className="text-caption mt-2">
              User profile, role and organization information
            </p>
          </div>
          <Link href="/users">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {(error || userError) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {error || userError || "Failed to load user details"}
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
            <span className="ml-3 text-obus-text-secondary dark:text-obus-text-light">
              Loading user details...
            </span>
          </div>
        )}

        {/* User Details */}
        {!isLoading && !currentUser && !error && (
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            User not found.
          </div>
        )}

        {!isLoading && currentUser && (
          <div className="space-y-6">
            {/* Actions Row - First Row */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
              <h3 className="font-semibold text-obus-primary dark:text-white mb-4">
                Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/users/${userId}/edit`)}
                >
                  Edit User
                </Button>
              </div>
            </div>

            {/* Summary Card - Second Row */}
            <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-linear-to-br from-obus-accent to-obus-accent/80 rounded-full flex items-center justify-center text-white font-semibold text-2xl shadow-md ring-2 ring-obus-accent/20 hover:ring-obus-accent/40 transition-all duration-200">
                    {currentUser.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-obus-primary dark:text-white">
                      {currentUser.displayName}
                    </div>
                    <div className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                      UID: {currentUser.uid}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={currentUser.enabled ? "default" : "secondary"}
                  className={
                    currentUser.enabled
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                      : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                  }
                >
                  {currentUser.enabled ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Type */}
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>User Type</span>
                  </div>
                  <Badge className={getUserTypeBadge(currentUser.userType)}>
                    {getUserTypeDisplay(currentUser.userType)}
                  </Badge>
                </div>

                {/* Contact */}
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </div>
                  <div className="text-obus-primary dark:text-white font-medium text-sm">
                    {currentUser.email}
                  </div>
                  <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                    Username: {currentUser.username}
                  </div>
                </div>

                {/* Phone Number */}
                {currentUser.phoneNumber && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </div>
                    <div className="text-obus-primary dark:text-white font-medium text-sm">
                      {currentUser.phoneNumber}
                    </div>
                    {currentUser.workPhone && (
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                        Work: {currentUser.workPhone}
                      </div>
                    )}
                  </div>
                )}

                {/* Identity */}
                {currentUser.employeeId && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <IdCard className="w-4 h-4" />
                      <span>Employee ID</span>
                    </div>
                    <div className="text-obus-primary dark:text-white font-medium text-sm">
                      {currentUser.employeeId}
                    </div>
                  </div>
                )}

                {/* Organization */}
                {(currentUser.department || currentUser.position) && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Organization</span>
                    </div>
                    {currentUser.department && (
                      <div className="text-obus-primary dark:text-white font-medium text-sm">
                        {currentUser.department}
                      </div>
                    )}
                    {currentUser.position && (
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                        {currentUser.position}
                      </div>
                    )}
                    {currentUser.officeLocation && (
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                        {currentUser.officeLocation}
                      </div>
                    )}
                  </div>
                )}

                {/* Partner */}
                {currentUser.partnerName && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>Partner</span>
                    </div>
                    <div className="text-obus-primary dark:text-white font-medium text-sm">
                      {currentUser.partnerName}
                    </div>
                    {currentUser.partnerCode && (
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                        Code: {currentUser.partnerCode}
                      </div>
                    )}
                  </div>
                )}

                {/* Address */}
                {(currentUser.address ||
                  currentUser.city ||
                  currentUser.country) && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0 md:col-span-2">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>Address</span>
                    </div>
                    <div className="text-obus-primary dark:text-white text-sm">
                      {currentUser.address && <div>{currentUser.address}</div>}
                      <div className="mt-1">
                        {[
                          currentUser.city,
                          currentUser.state,
                          currentUser.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      {currentUser.postalCode && (
                        <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                          {currentUser.postalCode}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {(currentUser.personalEmail ||
                  currentUser.workEmail ||
                  currentUser.gender ||
                  currentUser.preferredLanguage) && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0 md:col-span-2">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <FileText className="w-4 h-4" />
                      <span>Additional Information</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {currentUser.personalEmail && (
                        <div>
                          <span className="text-obus-text-secondary dark:text-obus-text-light">
                            Personal Email:{" "}
                          </span>
                          <span className="text-obus-primary dark:text-white">
                            {currentUser.personalEmail}
                          </span>
                        </div>
                      )}
                      {currentUser.workEmail && (
                        <div>
                          <span className="text-obus-text-secondary dark:text-obus-text-light">
                            Work Email:{" "}
                          </span>
                          <span className="text-obus-primary dark:text-white">
                            {currentUser.workEmail}
                          </span>
                        </div>
                      )}
                      {currentUser.gender && (
                        <div>
                          <span className="text-obus-text-secondary dark:text-obus-text-light">
                            Gender:{" "}
                          </span>
                          <span className="text-obus-primary dark:text-white">
                            {currentUser.gender}
                          </span>
                        </div>
                      )}
                      {currentUser.preferredLanguage && (
                        <div>
                          <span className="text-obus-text-secondary dark:text-obus-text-light">
                            Preferred Language:{" "}
                          </span>
                          <span className="text-obus-primary dark:text-white">
                            {currentUser.preferredLanguage}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {(currentUser.emergencyContactName ||
                  currentUser.emergencyContactPhone) && (
                  <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0 md:col-span-2">
                    <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Emergency Contact</span>
                    </div>
                    <div className="text-obus-primary dark:text-white text-sm">
                      {currentUser.emergencyContactName}
                    </div>
                    {currentUser.emergencyContactPhone && (
                      <div className="text-xs text-obus-text-secondary dark:text-obus-text-light mt-1">
                        {currentUser.emergencyContactPhone}
                      </div>
                    )}
                  </div>
                )}

                {/* Timestamps */}
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0 md:col-span-2">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Timestamps</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {currentUser.createdAt && (
                      <div>
                        <span className="text-obus-text-secondary dark:text-obus-text-light">
                          Created:{" "}
                        </span>
                        <span className="text-obus-primary dark:text-white">
                          {new Date(currentUser.createdAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {currentUser.updatedAt && (
                      <div>
                        <span className="text-obus-text-secondary dark:text-obus-text-light">
                          Updated:{" "}
                        </span>
                        <span className="text-obus-primary dark:text-white">
                          {new Date(currentUser.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {currentUser.lastLoginAt && (
                      <div>
                        <span className="text-obus-text-secondary dark:text-obus-text-light">
                          Last Login:{" "}
                        </span>
                        <span className="text-obus-primary dark:text-white">
                          {new Date(currentUser.lastLoginAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Status */}
                <div className="rounded-md border border-obus-primary/10 bg-white p-4 dark:border-white/20 dark:bg-white/0 md:col-span-2">
                  <div className="flex items-center gap-2 text-obus-text-secondary dark:text-obus-text-light mb-2">
                    <Activity className="w-4 h-4" />
                    <span>Account Status</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          currentUser.enabled ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        {currentUser.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          currentUser.accountNonExpired
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        Non-Expired
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          currentUser.accountNonLocked
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        Non-Locked
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          currentUser.credentialsNonExpired
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                        Credentials Valid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
