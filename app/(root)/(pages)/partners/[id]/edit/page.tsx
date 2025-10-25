"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
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
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  MapPin,
  FileText,
  Mail,
  Phone,
  Hash,
  Percent,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePartners } from "@/lib/contexts/PartnersContext";
import type { UpdatePartnerRequestDto } from "@/lib/api/types";

interface PartnerFormData {
  // Section 1: Basic Information
  code: string;
  businessName: string;
  legalName: string;
  email: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  businessAddress: string;

  // Section 2: Business Details
  type: "INDIVIDUAL" | "COMPANY" | "";
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "";
  commissionRate: string;

  // Section 3: Contact Person Details
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;

  // Section 4: Location Information
  city: string;
  state: string;
  country: string;
  postalCode: string;

  // Section 5: Additional Information
  description: string;
  notes: string;
}

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const partnerUid = params?.id as string;
  const loadingRef = useRef(false);

  const {
    currentPartner,
    isLoading,
    error,
    loadPartnerByUid,
    updatePartnerByUid,
    clearError,
    clearCurrentPartner,
  } = usePartners();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<PartnerFormData>({
    code: "",
    businessName: "",
    legalName: "",
    email: "",
    phoneNumber: "",
    businessRegistrationNumber: "",
    taxIdentificationNumber: "",
    businessAddress: "",
    type: "",
    tier: "",
    commissionRate: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    description: "",
    notes: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Load partner data when component mounts or partnerUid changes
  useEffect(() => {
    if (partnerUid && !loadingRef.current) {
      loadingRef.current = true;
      loadPartnerByUid(partnerUid).finally(() => {
        loadingRef.current = false;
      });
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentPartner();
    };
  }, [partnerUid, loadPartnerByUid, clearCurrentPartner]);

  // Populate form when partner data is loaded
  useEffect(() => {
    if (currentPartner) {
      setFormData({
        code: currentPartner.code || "",
        businessName: currentPartner.businessName || "",
        legalName: currentPartner.legalName || "",
        email: currentPartner.email || "",
        phoneNumber: currentPartner.phoneNumber || "",
        businessRegistrationNumber:
          currentPartner.businessRegistrationNumber || "",
        taxIdentificationNumber: currentPartner.taxIdentificationNumber || "",
        businessAddress: currentPartner.businessAddress || "",
        type: currentPartner.type || "",
        tier: currentPartner.tier || "",
        commissionRate: currentPartner.commissionRate?.toString() || "",
        contactPersonName: currentPartner.contactPerson?.name || "",
        contactPersonEmail: currentPartner.contactPerson?.email || "",
        contactPersonPhone: currentPartner.contactPerson?.phone || "",
        city: currentPartner.location?.city || "",
        state: currentPartner.location?.state || "",
        country: currentPartner.location?.country || "",
        postalCode: currentPartner.location?.postalCode || "",
        description: currentPartner.description || "",
        notes: currentPartner.notes || "",
      });
    }
  }, [currentPartner]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic Information validation
    if (!formData.code.trim()) newErrors.code = "Partner code is required";
    if (!formData.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!formData.legalName.trim())
      newErrors.legalName = "Legal name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    // Business Details validation
    if (!formData.type) newErrors.type = "Business type is required";
    if (!formData.tier) newErrors.tier = "Tier is required";
    if (!formData.commissionRate.trim())
      newErrors.commissionRate = "Commission rate is required";
    else if (
      isNaN(Number(formData.commissionRate)) ||
      Number(formData.commissionRate) < 0 ||
      Number(formData.commissionRate) > 100
    ) {
      newErrors.commissionRate = "Commission rate must be between 0 and 100";
    }

    // Contact Person validation
    if (!formData.contactPersonName.trim())
      newErrors.contactPersonName = "Contact person name is required";

    // Location validation
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm() || !partnerUid || !currentPartner) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the partner data for API
      const partnerData: UpdatePartnerRequestDto = {
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
        type: formData.type as "INDIVIDUAL" | "COMPANY",
        contactPersonName: formData.contactPersonName,
        contactPersonEmail: formData.contactPersonEmail,
        contactPersonPhone: formData.contactPersonPhone,
        description: formData.description,
        notes: formData.notes,
        status: currentPartner.status,
        tier: formData.tier as
          | "BRONZE"
          | "SILVER"
          | "GOLD"
          | "PLATINUM"
          | "DIAMOND",
        isActive: currentPartner.status === "ACTIVE",
        isVerified: currentPartner.verified,
        commissionRate: Number(formData.commissionRate),
      };

      // Update the partner via API
      const response = await updatePartnerByUid(partnerUid, partnerData);

      if (response.status && response.data) {
        // Redirect back to partner details
        router.push(`/partners/${partnerUid}`);
      } else {
        throw new Error(response.message || "Failed to update partner");
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      // Error is already handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
              <h1 className="text-h1">Edit Partner</h1>
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
              <h1 className="text-h1">Edit Partner</h1>
              <p className="text-caption mt-2">Partner not found</p>
            </div>
          </div>
          <div className="rounded-lg border border-obus-primary/10 bg-white p-6 shadow-sm text-obus-text-secondary dark:border-white/20 dark:bg-white/5 dark:text-obus-text-light">
            Partner not found.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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
            <h1 className="text-h1">Edit Partner</h1>
            <p className="text-caption mt-2">
              Update partner information for {currentPartner.businessName}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error updating partner
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

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Basic Information Section */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-obus-primary dark:text-white">
                <Building2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="code"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Hash className="w-4 h-4" />
                    Partner Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="e.g., SFC001"
                    className={errors.code ? "border-red-500" : ""}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium">
                    Business Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    placeholder="e.g., SafariLink Coaches"
                    className={errors.businessName ? "border-red-500" : ""}
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-500">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legalName" className="text-sm font-medium">
                    Legal Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="legalName"
                    value={formData.legalName}
                    onChange={(e) =>
                      handleInputChange("legalName", e.target.value)
                    }
                    placeholder="e.g., SafariLink Coaches Limited"
                    className={errors.legalName ? "border-red-500" : ""}
                  />
                  {errors.legalName && (
                    <p className="text-sm text-red-500">{errors.legalName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g., contact@safarilink.co.tz"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="e.g., +255-752-123-456"
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="businessRegistrationNumber"
                    className="text-sm font-medium"
                  >
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
                    placeholder="e.g., BRELA-123456"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="taxIdentificationNumber"
                    className="text-sm font-medium"
                  >
                    Tax Identification Number
                  </Label>
                  <Input
                    id="taxIdentificationNumber"
                    value={formData.taxIdentificationNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "taxIdentificationNumber",
                        e.target.value
                      )
                    }
                    placeholder="e.g., TIN-123-456-789"
                  />
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label
                    htmlFor="businessAddress"
                    className="text-sm font-medium"
                  >
                    Business Address
                  </Label>
                  <Input
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) =>
                      handleInputChange("businessAddress", e.target.value)
                    }
                    placeholder="e.g., 123 Bagamoyo Road, Dar es Salaam"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details Section */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-obus-primary dark:text-white">
                <User className="w-5 h-5" />
                Business Details
              </CardTitle>
              <CardDescription>
                Business type and commission structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Business Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) =>
                      handleInputChange("type", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.type ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMPANY">Company</SelectItem>
                      <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier" className="text-sm font-medium">
                    Tier <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.tier}
                    onValueChange={(value: string) =>
                      handleInputChange("tier", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.tier ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRONZE">Bronze</SelectItem>
                      <SelectItem value="SILVER">Silver</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                      <SelectItem value="PLATINUM">Platinum</SelectItem>
                      <SelectItem value="DIAMOND">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tier && (
                    <p className="text-sm text-red-500">{errors.tier}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="commissionRate"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Percent className="w-4 h-4" />
                    Commission Rate (%) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.commissionRate}
                    onChange={(e) =>
                      handleInputChange("commissionRate", e.target.value)
                    }
                    placeholder="e.g., 12.5"
                    className={errors.commissionRate ? "border-red-500" : ""}
                  />
                  {errors.commissionRate && (
                    <p className="text-sm text-red-500">
                      {errors.commissionRate}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person Section */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-obus-primary dark:text-white">
                <User className="w-5 h-5" />
                Contact Person
              </CardTitle>
              <CardDescription>Primary contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="contactPersonName"
                    className="text-sm font-medium"
                  >
                    Contact Person Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={(e) =>
                      handleInputChange("contactPersonName", e.target.value)
                    }
                    placeholder="e.g., Juma Mwakyusa"
                    className={errors.contactPersonName ? "border-red-500" : ""}
                  />
                  {errors.contactPersonName && (
                    <p className="text-sm text-red-500">
                      {errors.contactPersonName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contactPersonEmail"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Person Email
                  </Label>
                  <Input
                    id="contactPersonEmail"
                    type="email"
                    value={formData.contactPersonEmail}
                    onChange={(e) =>
                      handleInputChange("contactPersonEmail", e.target.value)
                    }
                    placeholder="e.g., juma@safarilink.co.tz"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contactPersonPhone"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Contact Person Phone
                  </Label>
                  <Input
                    id="contactPersonPhone"
                    value={formData.contactPersonPhone}
                    onChange={(e) =>
                      handleInputChange("contactPersonPhone", e.target.value)
                    }
                    placeholder="e.g., +255-752-123-456"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-obus-primary dark:text-white">
                <MapPin className="w-5 h-5" />
                Location Information
              </CardTitle>
              <CardDescription>Business location details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="e.g., Dar es Salaam"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="e.g., Dar es Salaam Region"
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    placeholder="e.g., Tanzania"
                    className={errors.country ? "border-red-500" : ""}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    placeholder="e.g., 101241"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Section */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-obus-primary dark:text-white">
                <FileText className="w-5 h-5" />
                Additional Information
              </CardTitle>
              <CardDescription>
                Additional notes and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Brief description of the partner's business..."
                    className="w-full min-h-[120px] px-3 py-2 border border-obus-primary/10 rounded-md bg-white text-obus-text-primary placeholder:text-obus-text-secondary focus:outline-none focus:ring-2 focus:ring-obus-accent focus:border-transparent dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-obus-text-light"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes or comments..."
                    className="w-full min-h-[120px] px-3 py-2 border border-obus-primary/10 rounded-md bg-white text-obus-text-primary placeholder:text-obus-text-secondary focus:outline-none focus:ring-2 focus:ring-obus-accent focus:border-transparent dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-obus-text-light"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-obus-accent hover:bg-obus-accent/90 min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating Partner...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Partner
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
