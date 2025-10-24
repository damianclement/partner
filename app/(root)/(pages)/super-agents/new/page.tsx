"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Building2,
  User2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useSuperAgents } from "@/lib/contexts/SuperAgentsContext";
import { usePartners } from "@/lib/contexts/PartnersContext";
import type { CreateSuperAgentRequestDto } from "@/lib/api/types";

interface SuperAgentFormData {
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

export default function CreateSuperAgentPage() {
  const router = useRouter();
  const { createSuperAgent, error, clearError } = useSuperAgents();
  const { partners } = usePartners();

  const [formData, setFormData] = useState<SuperAgentFormData>({
    businessName: "",
    legalName: "",
    email: "",
    phoneNumber: "",
    businessRegistrationNumber: "",
    taxIdentificationNumber: "",
    businessAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    description: "",
    partnerUid: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof SuperAgentFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      const superAgentData: CreateSuperAgentRequestDto = {
        businessName: formData.businessName,
        legalName: formData.legalName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        taxIdentificationNumber: formData.taxIdentificationNumber,
        businessAddress: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        contactPersonName: formData.contactPersonName,
        contactPersonEmail: formData.contactPersonEmail,
        contactPersonPhone: formData.contactPersonPhone,
        description: formData.description,
        partnerUid: formData.partnerUid,
      };

      const response = await createSuperAgent(superAgentData);

      if (response.status && response.data) {
        router.push(`/super-agents/${response.data.uid}`);
      }
    } catch (err) {
      console.error("Error creating super agent:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">Create Super Agent</h1>
            <p className="text-caption mt-2">
              Add a new super agent to the system
            </p>
          </div>
          <Link href="/super-agents">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Super Agents
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error creating super agent
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                ×
              </Button>
            </div>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-obus-primary" />
                <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
                  Business Information
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name *</Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) =>
                    handleInputChange("legalName", e.target.value)
                  }
                  placeholder="Enter legal name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter business email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessRegistrationNumber">
                  Business Registration Number
                </Label>
                <Input
                  id="businessRegistrationNumber"
                  value={formData.businessRegistrationNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "businessRegistrationNumber",
                      e.target.value
                    )
                  }
                  placeholder="Enter business registration number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxIdentificationNumber">
                  Tax Identification Number
                </Label>
                <Input
                  id="taxIdentificationNumber"
                  value={formData.taxIdentificationNumber}
                  onChange={(e) =>
                    handleInputChange("taxIdentificationNumber", e.target.value)
                  }
                  placeholder="Enter tax identification number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("businessAddress", e.target.value)
                  }
                  placeholder="Enter business address"
                  rows={3}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-obus-primary" />
                <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
                  Location Information
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Enter country"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  placeholder="Enter postal code"
                />
              </div>

              {/* Contact Person Information */}
              <div className="flex items-center gap-2 mb-4 mt-8">
                <User2 className="w-5 h-5 text-obus-primary" />
                <h3 className="text-lg font-semibold text-obus-primary dark:text-white">
                  Contact Person
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                <Input
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    handleInputChange("contactPersonName", e.target.value)
                  }
                  placeholder="Enter contact person name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonEmail">Contact Person Email</Label>
                <Input
                  id="contactPersonEmail"
                  type="email"
                  value={formData.contactPersonEmail}
                  onChange={(e) =>
                    handleInputChange("contactPersonEmail", e.target.value)
                  }
                  placeholder="Enter contact person email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonPhone">Contact Person Phone</Label>
                <Input
                  id="contactPersonPhone"
                  value={formData.contactPersonPhone}
                  onChange={(e) =>
                    handleInputChange("contactPersonPhone", e.target.value)
                  }
                  placeholder="Enter contact person phone"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partnerUid">Partner *</Label>
              <Select
                value={formData.partnerUid}
                onValueChange={(value) =>
                  handleInputChange("partnerUid", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((partner) => (
                    <SelectItem key={partner.uid} value={partner.uid}>
                      {partner.businessName} ({partner.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/super-agents">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-obus-accent hover:bg-obus-accent/90"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Super Agent
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
