"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  RefreshCw,
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePartners } from "@/lib/contexts/PartnersContext";
import type { CreateApiKeyRequestDto } from "@/lib/api/types";

export default function PartnerApiKeysPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const partnerUid = params?.id as string;
  const loadingRef = useRef(false);
  const apiKeysLoadingRef = useRef(false);

  const {
    currentPartner,
    apiKeys,
    isApiKeysLoading,
    apiKeysError,
    loadPartnerByUid,
    loadPartnerApiKeys,
    generateApiKey,
    regenerateApiKey,
    enableApiKeyByUid,
    disableApiKeyByUid,
    deleteApiKey,
    clearError,
    clearCurrentPartner,
    clearApiKeysError,
  } = usePartners();

  const [showApiKey, setShowApiKey] = React.useState<Record<string, boolean>>(
    {}
  );
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [newApiKeyDialog, setNewApiKeyDialog] = React.useState(false);
  const [newApiKeyData, setNewApiKeyData] =
    React.useState<CreateApiKeyRequestDto>({
      keyName: "",
      description: "",
      environment: "production",
      permissions: [],
      expiresAt: "",
    });
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant: "default" | "destructive";
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    variant: "default",
  });
  const [viewDetailsDialog, setViewDetailsDialog] = React.useState<{
    isOpen: boolean;
    apiKey: any | null;
  }>({
    isOpen: false,
    apiKey: null,
  });

  // Load partner data when component mounts
  useEffect(() => {
    if (partnerUid && !loadingRef.current) {
      loadingRef.current = true;
      loadPartnerByUid(partnerUid).finally(() => {
        loadingRef.current = false;
      });
    }

    return () => {
      clearCurrentPartner();
    };
  }, [partnerUid, loadPartnerByUid, clearCurrentPartner]);

  // Load API keys when partner is loaded
  useEffect(() => {
    if (currentPartner && partnerUid && !apiKeysLoadingRef.current) {
      apiKeysLoadingRef.current = true;
      loadPartnerApiKeys(partnerUid).finally(() => {
        apiKeysLoadingRef.current = false;
      });
    }
  }, [currentPartner, partnerUid, loadPartnerApiKeys]);

  const handleRefresh = () => {
    if (partnerUid) {
      clearApiKeysError();
      loadPartnerApiKeys(partnerUid);
    }
  };

  const toggleApiKeyVisibility = (apiKeyUid: string) => {
    setShowApiKey((prev) => ({
      ...prev,
      [apiKeyUid]: !prev[apiKeyUid],
    }));
  };

  const copyToClipboard = async (text: string, apiKeyUid: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(apiKeyUid);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!partnerUid || !newApiKeyData.keyName.trim()) return;

    setIsGenerating(true);
    try {
      const response = await generateApiKey(partnerUid, newApiKeyData);
      if (response.status && response.data) {
        setNewApiKeyDialog(false);
        setNewApiKeyData({
          keyName: "",
          description: "",
          environment: "production",
          permissions: [],
          expiresAt: "",
        });
        await loadPartnerApiKeys(partnerUid);
      }
    } catch (error) {
      console.error("Error generating API key:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateApiKey = (apiKeyUid: string, apiKeyName: string) => {
    showConfirmDialog(
      "Regenerate API Key",
      `Are you sure you want to regenerate the API key "${apiKeyName}"? The current key will be invalidated.`,
      () => handleRegenerateAction(apiKeyUid),
      "destructive"
    );
  };

  const handleRegenerateAction = async (apiKeyUid: string) => {
    if (!partnerUid) return;

    try {
      const response = await regenerateApiKey(partnerUid);
      if (response.status && response.data) {
        await loadPartnerApiKeys(partnerUid);
      }
    } catch (error) {
      console.error("Error regenerating API key:", error);
    }
  };

  const handleEnableApiKey = async (apiKeyUid: string) => {
    try {
      await enableApiKeyByUid(apiKeyUid);
      await loadPartnerApiKeys(partnerUid!);
    } catch (error) {
      console.error("Error enabling API key:", error);
    }
  };

  const handleDisableApiKey = async (apiKeyUid: string) => {
    try {
      await disableApiKeyByUid(apiKeyUid);
      await loadPartnerApiKeys(partnerUid!);
    } catch (error) {
      console.error("Error disabling API key:", error);
    }
  };

  const handleDeleteApiKey = (apiKeyUid: string, apiKeyName: string) => {
    showConfirmDialog(
      "Delete API Key",
      `Are you sure you want to delete the API key "${apiKeyName}"? This action cannot be undone.`,
      () => handleDeleteAction(apiKeyUid),
      "destructive"
    );
  };

  const handleDeleteAction = async (apiKeyUid: string) => {
    try {
      await deleteApiKey(apiKeyUid);
      await loadPartnerApiKeys(partnerUid!);
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  const showConfirmDialog = (
    title: string,
    description: string,
    action: () => void,
    variant: "default" | "destructive" = "default"
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      action,
      variant,
    });
  };

  const handleViewDetails = (apiKey: any) => {
    setViewDetailsDialog({
      isOpen: true,
      apiKey,
    });
  };

  if (!currentPartner) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-h1">API Keys</h1>
              <p className="text-caption mt-2">Loading partner details...</p>
            </div>
          </div>
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-white/5">
            <div className="flex items-center justify-center gap-2 text-obus-text-secondary dark:text-obus-text-light">
              <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
              Loading partner details...
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-h1">API Keys</h1>
              <p className="text-caption mt-2">
                Manage API keys for {currentPartner.businessName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isApiKeysLoading}
              className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  isApiKeysLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => setNewApiKeyDialog(true)}
              className="bg-obus-accent hover:bg-obus-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate API Key
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {apiKeysError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error loading API keys
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearApiKeysError}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                ×
              </Button>
            </div>
            <p className="text-sm mt-1">{apiKeysError}</p>
          </div>
        )}

        {/* API Keys Table */}
        <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-obus-primary dark:text-white">
              <Key className="w-5 h-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage API keys for partner integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isApiKeysLoading ? (
              <div className="flex items-center justify-center gap-2 text-obus-text-secondary dark:text-obus-text-light py-8">
                <div className="w-4 h-4 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin" />
                Loading API keys...
              </div>
            ) : apiKeys.length > 0 ? (
              <div className="rounded-md border border-obus-primary/10 overflow-hidden dark:border-white/20">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-obus-primary/10 dark:border-white/20">
                      <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                        Name
                      </TableHead>
                      <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                        API Key
                      </TableHead>
                      <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                        Status
                      </TableHead>
                      <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                        Created
                      </TableHead>
                      <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                        Last Used
                      </TableHead>
                      <TableHead className="text-obus-text-secondary dark:text-obus-text-light">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow
                        key={apiKey.apiKeyUid}
                        className="border-obus-primary/10 hover:bg-obus-primary/5 dark:border-white/20 dark:hover:bg-obus-primary/20"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-obus-primary dark:text-white">
                              {apiKey.keyName}
                            </p>
                            {apiKey.description && (
                              <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                                {apiKey.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                              {showApiKey[apiKey.apiKeyUid]
                                ? `••••••••••••••••••••••••••••••••${apiKey.apiKeyUid.slice(
                                    -8
                                  )}`
                                : "•".repeat(32) + apiKey.apiKeyUid.slice(-8)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleApiKeyVisibility(apiKey.apiKeyUid)
                              }
                              className="h-6 w-6 p-0"
                            >
                              {showApiKey[apiKey.apiKeyUid] ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  apiKey.apiKeyUid,
                                  apiKey.apiKeyUid
                                )
                              }
                              className="h-6 w-6 p-0"
                            >
                              {copiedKey === apiKey.apiKeyUid ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={apiKey.active ? "default" : "secondary"}
                            className={
                              apiKey.active
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                                : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                            }
                          >
                            {apiKey.active ? "ACTIVE" : "INACTIVE"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                            {new Date(apiKey.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                            {apiKey.lastUsedAt
                              ? new Date(apiKey.lastUsedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "Never"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border border-obus-primary/10 bg-white text-obus-text-primary dark:border-white/20 dark:bg-obus-primary dark:text-white min-w-[180px]"
                            >
                              <DropdownMenuItem
                                className="text-obus-text-primary dark:text-white cursor-pointer"
                                onClick={() => handleViewDetails(apiKey)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {apiKey.active ? (
                                <DropdownMenuItem
                                  className="text-obus-text-primary dark:text-white cursor-pointer"
                                  onClick={() =>
                                    handleDisableApiKey(apiKey.apiKeyUid)
                                  }
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Disable
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-obus-text-primary dark:text-white cursor-pointer"
                                  onClick={() =>
                                    handleEnableApiKey(apiKey.apiKeyUid)
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Enable
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                className="text-obus-text-primary dark:text-white cursor-pointer"
                                onClick={() =>
                                  handleRegenerateApiKey(
                                    apiKey.apiKeyUid,
                                    apiKey.keyName
                                  )
                                }
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400 cursor-pointer"
                                onClick={() =>
                                  handleDeleteApiKey(
                                    apiKey.apiKeyUid,
                                    apiKey.keyName
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-obus-text-secondary dark:text-obus-text-light">
                <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No API Keys</p>
                <p className="text-sm mb-4">
                  This partner doesn't have any API keys yet.
                </p>
                <Button
                  onClick={() => setNewApiKeyDialog(true)}
                  className="bg-obus-accent hover:bg-obus-accent/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate First API Key
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate New API Key Dialog */}
        <Dialog open={newApiKeyDialog} onOpenChange={setNewApiKeyDialog}>
          <DialogContent className="border border-obus-primary/10 bg-white dark:border-white/20 dark:bg-obus-primary">
            <DialogHeader>
              <DialogTitle className="text-obus-primary dark:text-white">
                Generate New API Key
              </DialogTitle>
              <DialogDescription className="text-obus-text-secondary dark:text-obus-text-light">
                Create a new API key for {currentPartner.businessName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKeyName" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apiKeyName"
                  value={newApiKeyData.keyName}
                  onChange={(e) =>
                    setNewApiKeyData((prev) => ({
                      ...prev,
                      keyName: e.target.value,
                    }))
                  }
                  placeholder="e.g., Production API Key"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="apiKeyDescription"
                  className="text-sm font-medium"
                >
                  Description
                </Label>
                <Input
                  id="apiKeyDescription"
                  value={newApiKeyData.description}
                  onChange={(e) =>
                    setNewApiKeyData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description for this API key"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNewApiKeyDialog(false)}
                className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateApiKey}
                disabled={isGenerating || !newApiKeyData.keyName.trim()}
                className="bg-obus-accent hover:bg-obus-accent/90 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Generate API Key
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="border border-obus-primary/10 bg-white dark:border-white/20 dark:bg-obus-primary">
            <DialogHeader>
              <DialogTitle className="text-obus-primary dark:text-white">
                {confirmDialog.title}
              </DialogTitle>
              <DialogDescription className="text-obus-text-secondary dark:text-obus-text-light">
                {confirmDialog.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                variant={
                  confirmDialog.variant === "destructive"
                    ? "destructive"
                    : "default"
                }
                onClick={() => {
                  confirmDialog.action();
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }}
                className={
                  confirmDialog.variant === "destructive"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-obus-accent hover:bg-obus-accent/90 text-white"
                }
              >
                {confirmDialog.variant === "destructive" ? "Delete" : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog
          open={viewDetailsDialog.isOpen}
          onOpenChange={(open) =>
            setViewDetailsDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="border border-obus-primary/10 bg-white dark:border-white/20 dark:bg-obus-primary max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-obus-primary dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Key Details
              </DialogTitle>
              <DialogDescription className="text-obus-text-secondary dark:text-obus-text-light">
                Detailed information about this API key
              </DialogDescription>
            </DialogHeader>
            {viewDetailsDialog.apiKey && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-obus-primary dark:text-white">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Name
                      </Label>
                      <p className="text-sm text-obus-text-primary dark:text-white mt-1">
                        {viewDetailsDialog.apiKey.keyName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Status
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            viewDetailsDialog.apiKey.active
                              ? "default"
                              : "secondary"
                          }
                          className={
                            viewDetailsDialog.apiKey.active
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {viewDetailsDialog.apiKey.active
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Environment
                      </Label>
                      <p className="text-sm text-obus-text-primary dark:text-white mt-1">
                        {viewDetailsDialog.apiKey.environment || "production"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Primary Key
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            viewDetailsDialog.apiKey.primary
                              ? "default"
                              : "secondary"
                          }
                          className={
                            viewDetailsDialog.apiKey.primary
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/20"
                          }
                        >
                          {viewDetailsDialog.apiKey.primary ? "YES" : "NO"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {viewDetailsDialog.apiKey.description && (
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Description
                      </Label>
                      <p className="text-sm text-obus-text-primary dark:text-white mt-1">
                        {viewDetailsDialog.apiKey.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-obus-primary dark:text-white">
                    Permissions
                  </h4>
                  <div>
                    {viewDetailsDialog.apiKey.permissions &&
                    viewDetailsDialog.apiKey.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {viewDetailsDialog.apiKey.permissions.map(
                          (permission: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-obus-primary/20 text-obus-text-primary dark:border-white/20 dark:text-white"
                            >
                              {permission}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                        No specific permissions set
                      </p>
                    )}
                  </div>
                </div>

                {/* Usage Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-obus-primary dark:text-white">
                    Usage Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Usage Count
                      </Label>
                      <p className="text-sm text-obus-text-primary dark:text-white mt-1">
                        {viewDetailsDialog.apiKey.usageCount || 0} requests
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Last Used
                      </Label>
                      <p className="text-sm text-obus-text-primary dark:text-white mt-1">
                        {viewDetailsDialog.apiKey.lastUsedAt
                          ? new Date(
                              viewDetailsDialog.apiKey.lastUsedAt
                            ).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Never"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Created
                      </Label>
                      <p className="text-sm text-obus-text-primary dark:text-white mt-1">
                        {new Date(
                          viewDetailsDialog.apiKey.createdAt
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-obus-text-secondary dark:text-obus-text-light">
                        Expires
                      </Label>
                      <p className="text-sm text-obus-text-primary dark:text-white mt-1">
                        {viewDetailsDialog.apiKey.expiresAt
                          ? new Date(
                              viewDetailsDialog.apiKey.expiresAt
                            ).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* API Key UID */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-obus-primary dark:text-white">
                    API Key UID
                  </h4>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded font-mono flex-1">
                      {viewDetailsDialog.apiKey.apiKeyUid}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          viewDetailsDialog.apiKey.apiKeyUid,
                          viewDetailsDialog.apiKey.apiKeyUid
                        )
                      }
                      className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setViewDetailsDialog((prev) => ({ ...prev, isOpen: false }))
                }
                className="border-obus-primary/20 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
