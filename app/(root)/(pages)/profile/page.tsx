"use client";

import * as React from "react";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Phone,
  Edit3,
  Save,
  X,
  Camera,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUser } from "@/lib/contexts/UserContext";
import { authService } from "@/lib/api/services";

interface ProfileData {
  // Personal Information
  displayName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employeeId: string;

  // Contact Information
  personalEmail: string;
  workPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Mock profile data - in real app this would come from API
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user?.displayName || "John Doe",
    email: user?.email || "john.doe@obus.co.tz",
    phone: "+255-752-123-456",
    department: "Operations",
    position: "System Administrator",
    employeeId: "EMP-001",
    personalEmail: "john.doe.personal@gmail.com",
    workPhone: "+255-22-123-456",
    address: "123 Bagamoyo Road",
    city: "Dar es Salaam",
    state: "Dar es Salaam Region",
    country: "Tanzania",
  });

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "password", label: "Change Password", icon: Key },
  ];

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsChangingPassword(true);
      try {
        await authService.changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        });

        // Reset form on success
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});

        // You could add a success toast here
        console.log("Password changed successfully");
      } catch (error) {
        console.error("Error changing password:", error);
        // You could add error handling/toast here
      } finally {
        setIsChangingPassword(false);
      }
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-obus-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileData.displayName.charAt(0).toUpperCase()}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
            onClick={() => setShowAvatarDialog(true)}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
            {profileData.displayName}
          </h3>
          <p className="text-obus-text-secondary dark:text-obus-text-light">
            {profileData.position} • {profileData.department}
          </p>
          <Badge
            variant="outline"
            className="mt-2 bg-green-500/20 text-green-400 border-green-500/30"
          >
            {user?.userType === "ROOT_USER"
              ? "Root User"
              : user?.userType === "SYSTEM_USER"
              ? "System User"
              : user?.userType === "PARTNER_USER"
              ? "Partner User"
              : user?.userType === "PARTNER_AGENT"
              ? "Partner Agent"
              : "User"}
          </Badge>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-sm font-medium">
            Display Name
          </Label>
          <Input
            id="displayName"
            value={profileData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            disabled={!isEditing}
            className="bg-white dark:bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Work Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!isEditing}
            className="bg-white dark:bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={!isEditing}
            className="bg-white dark:bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeId" className="text-sm font-medium">
            Employee ID
          </Label>
          <Input
            id="employeeId"
            value={profileData.employeeId}
            onChange={(e) => handleInputChange("employeeId", e.target.value)}
            disabled={!isEditing}
            className="bg-white dark:bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-medium">
            Department
          </Label>
          <Input
            id="department"
            value={profileData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            disabled={!isEditing}
            className="bg-white dark:bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position" className="text-sm font-medium">
            Position
          </Label>
          <Input
            id="position"
            value={profileData.position}
            onChange={(e) => handleInputChange("position", e.target.value)}
            disabled={!isEditing}
            className="bg-white dark:bg-white/5"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-obus-primary dark:text-white flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="personalEmail" className="text-sm font-medium">
              Personal Email
            </Label>
            <Input
              id="personalEmail"
              type="email"
              value={profileData.personalEmail}
              onChange={(e) =>
                handleInputChange("personalEmail", e.target.value)
              }
              disabled={!isEditing}
              className="bg-white dark:bg-white/5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workPhone" className="text-sm font-medium">
              Work Phone
            </Label>
            <Input
              id="workPhone"
              value={profileData.workPhone}
              onChange={(e) => handleInputChange("workPhone", e.target.value)}
              disabled={!isEditing}
              className="bg-white dark:bg-white/5"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Input
              id="address"
              value={profileData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={!isEditing}
              className="bg-white dark:bg-white/5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              City
            </Label>
            <Input
              id="city"
              value={profileData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              disabled={!isEditing}
              className="bg-white dark:bg-white/5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">
              State/Region
            </Label>
            <Input
              id="state"
              value={profileData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              disabled={!isEditing}
              className="bg-white dark:bg-white/5"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordChange = () => (
    <div className="space-y-6">
      <Card className="border border-obus-primary/10 bg-white dark:border-white/20 dark:bg-white/5">
        <CardHeader>
          <CardTitle className="text-obus-primary dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="bg-white dark:bg-white/5 pr-10"
                placeholder="Enter your current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-sm text-red-500">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="bg-white dark:bg-white/5 pr-10"
                placeholder="Enter your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-sm text-red-500">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="bg-white dark:bg-white/5 pr-10"
                placeholder="Confirm your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-sm text-red-500">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="bg-obus-accent hover:bg-obus-accent/90"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h1">Profile Settings</h1>
            <p className="text-caption mt-2">
              Manage your personal information, security settings, and
              preferences
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-obus-primary/20"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-obus-accent hover:bg-obus-accent/90"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-obus-accent hover:bg-obus-accent/90"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/50 dark:bg-white/5 p-1 rounded-lg border border-obus-primary/10 dark:border-white/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-obus-accent text-white"
                    : "text-obus-text-secondary hover:text-obus-primary hover:bg-obus-primary/5 dark:text-obus-text-light dark:hover:text-white dark:hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "password" && renderPasswordChange()}
        </div>

        {/* Avatar Upload Dialog */}
        <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
          <DialogContent className="sm:max-w-md bg-white border-obus-primary/20 dark:bg-obus-primary dark:border-white/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-obus-text-primary dark:text-white">
                <Camera className="w-5 h-5 text-obus-accent" />
                Update Profile Picture
              </DialogTitle>
              <DialogDescription className="text-obus-text-secondary dark:text-obus-text-light">
                Upload a new profile picture for your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-obus-accent rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                  Avatar upload functionality will be implemented with file
                  upload service
                </p>
              </div>
            </div>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowAvatarDialog(false)}
                className="flex-1 sm:flex-none border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowAvatarDialog(false)}
                className="flex-1 sm:flex-none bg-obus-accent hover:bg-obus-accent/90"
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
