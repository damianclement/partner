"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [bookingConfirmations, setBookingConfirmations] = useState(true);
  const [partnerRegistrations, setPartnerRegistrations] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [encryptionAtRest, setEncryptionAtRest] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-h1">System Settings</h1>
          <p className="text-caption mt-2">
            Configure system preferences, security settings, and application
            behavior
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              General Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-obus-text-light">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  defaultValue="OBUS Partner Network"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-obus-text-light">
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  defaultValue="Africa/Lagos (WAT)"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-obus-text-light">
                  Default Currency
                </Label>
                <Input
                  id="currency"
                  defaultValue="Tsh"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">
                    Maintenance Mode
                  </Label>
                  <p className="text-xs text-obus-text-light">
                    Enable maintenance mode for system updates
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-obus-text-light">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-xs text-obus-text-light">
                    Require 2FA for all admin accounts
                  </p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">
                    Session Timeout
                  </Label>
                  <p className="text-xs text-obus-text-light">
                    Auto-logout inactive users after 30 minutes
                  </p>
                </div>
                <Switch
                  checked={sessionTimeout}
                  onCheckedChange={setSessionTimeout}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password-policy"
                  className="text-obus-text-light"
                >
                  Password Policy
                </Label>
                <Input
                  id="password-policy"
                  defaultValue="Strong (8+ chars, mixed case, numbers, symbols)"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">IP Whitelist</Label>
                  <p className="text-xs text-obus-text-light">
                    Restrict access to specific IP addresses
                  </p>
                </div>
                <Switch
                  checked={ipWhitelist}
                  onCheckedChange={setIpWhitelist}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowed-ips" className="text-obus-text-light">
                  Allowed IP Addresses
                </Label>
                <Input
                  id="allowed-ips"
                  placeholder="192.168.1.1, 10.0.0.1"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">
                    Booking Confirmations
                  </Label>
                  <p className="text-xs text-obus-text-light">
                    Notify on new booking confirmations
                  </p>
                </div>
                <Switch
                  checked={bookingConfirmations}
                  onCheckedChange={setBookingConfirmations}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">
                    Partner Registrations
                  </Label>
                  <p className="text-xs text-obus-text-light">
                    Alert on new partner registrations
                  </p>
                </div>
                <Switch
                  checked={partnerRegistrations}
                  onCheckedChange={setPartnerRegistrations}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">System Alerts</Label>
                  <p className="text-xs text-obus-text-light">
                    Critical system notifications
                  </p>
                </div>
                <Switch
                  checked={systemAlerts}
                  onCheckedChange={setSystemAlerts}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">Weekly Reports</Label>
                  <p className="text-xs text-obus-text-light">
                    Automated weekly performance reports
                  </p>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="notification-email"
                  className="text-obus-text-light"
                >
                  Notification Email
                </Label>
                <Input
                  id="notification-email"
                  type="email"
                  defaultValue="admin@obus.com"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Database Settings */}
          <div className="p-6 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="backup-frequency"
                  className="text-obus-text-light"
                >
                  Backup Frequency
                </Label>
                <Input
                  id="backup-frequency"
                  defaultValue="Daily at 2:00 AM"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="retention-period"
                  className="text-obus-text-light"
                >
                  Data Retention Period
                </Label>
                <Input
                  id="retention-period"
                  defaultValue="7 years"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">Auto Backup</Label>
                  <p className="text-xs text-obus-text-light">
                    Automatic daily database backups
                  </p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-obus-text-light">
                    Encryption at Rest
                  </Label>
                  <p className="text-xs text-obus-text-light">
                    Encrypt sensitive data at rest
                  </p>
                </div>
                <Switch
                  checked={encryptionAtRest}
                  onCheckedChange={setEncryptionAtRest}
                />
              </div>

              <Button className="w-full bg-obus-accent hover:bg-obus-accent/90">
                <Database className="w-4 h-4 mr-2" />
                Run Manual Backup
              </Button>
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end">
          <Button className="bg-obus-accent hover:bg-obus-accent/90">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
