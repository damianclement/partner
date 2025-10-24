"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/lib/contexts/UserContext";
import { apiKeyManager } from "@/lib/api/client";
import { partnersService } from "@/lib/api/services";
// Simple toast implementation - will be replaced with proper toast system later
const toast = {
  success: (message: string) => console.log("SUCCESS:", message),
  info: (message: string) => console.log("INFO:", message),
  error: (message: string) => console.log("ERROR:", message),
};

interface ApiKeySetupProps {
  onComplete?: () => void;
}

export function ApiKeySetup({ onComplete }: ApiKeySetupProps) {
  const { user, hasRole } = useUser();
  const [formData, setFormData] = useState({
    apiKey: "",
    apiSecret: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Only show for admin users or when user has admin role
  if (!hasRole("admin")) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.apiKey || !formData.apiSecret) {
      setError("Please enter both API Key and API Secret");
      return;
    }

    setIsLoading(true);

    try {
      // Store the API credentials
      apiKeyManager.setApiCredentials(formData.apiKey, formData.apiSecret);

      // Test the credentials by making a simple API call
      await partnersService.getPartners({ page: 0, size: 1 });

      toast.success("API credentials configured successfully!");
      onComplete?.();
    } catch (err) {
      console.error("API credentials test failed:", err);
      setError(
        "Invalid API credentials. Please check your API Key and Secret."
      );
      apiKeyManager.clearApiCredentials();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCredentials = () => {
    apiKeyManager.clearApiCredentials();
    setFormData({ apiKey: "", apiSecret: "" });
    setError("");
    toast.info("API credentials cleared");
  };

  const hasExistingCredentials = apiKeyManager.hasApiCredentials();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">API Configuration</CardTitle>
        <CardDescription>
          Configure your API Key and Secret for admin access to the OBUS Partner
          API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasExistingCredentials ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  API credentials are configured
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Your API Key and Secret are stored securely in your browser.
              </p>
            </div>

            <div className="space-y-2">
              <Button onClick={onComplete} className="w-full" variant="default">
                Continue to Dashboard
              </Button>
              <Button
                onClick={handleClearCredentials}
                className="w-full"
                variant="outline"
              >
                Clear Credentials
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                name="apiKey"
                type="password"
                placeholder="Enter your API Key"
                value={formData.apiKey}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                name="apiSecret"
                type="password"
                placeholder="Enter your API Secret"
                value={formData.apiSecret}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Testing..." : "Configure API"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ apiKey: "", apiSecret: "" })}
              >
                Clear
              </Button>
            </div>

            <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium mb-1">How to get API credentials:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Contact OBUS support team</li>
                <li>Request API access for your partner account</li>
                <li>You'll receive an API Key and Secret via email</li>
                <li>Enter them above to access the admin features</li>
              </ol>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
