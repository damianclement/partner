"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePartners } from "@/lib/contexts/PartnersContext";
import type { CreatePartnerRequestDto } from "@/lib/api/types";

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

export default function NewPartnerPage() {
  const router = useRouter();
  const { createPartner, error, clearError } = usePartners();
  const [currentSection, setCurrentSection] = React.useState(1);
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

  const sections = [
    {
      id: 1,
      title: "Basic Information",
      icon: Building2,
      description: "Company details and contact information",
    },
    {
      id: 2,
      title: "Business Details",
      icon: User,
      description: "Business type and commission structure",
    },
    {
      id: 3,
      title: "Contact Person",
      icon: User,
      description: "Primary contact information",
    },
    {
      id: 4,
      title: "Location",
      icon: MapPin,
      description: "Business location details",
    },
    {
      id: 5,
      title: "Additional Info",
      icon: FileText,
      description: "Additional notes and description",
    },
  ];

  const validateSection = (section: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (section) {
      case 1:
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
        break;
      case 2:
        if (!formData.type) newErrors.type = "Business type is required";
        if (!formData.tier) newErrors.tier = "Tier is required";
        if (!formData.commissionRate.trim())
          newErrors.commissionRate = "Commission rate is required";
        else if (
          isNaN(Number(formData.commissionRate)) ||
          Number(formData.commissionRate) < 0 ||
          Number(formData.commissionRate) > 100
        ) {
          newErrors.commissionRate =
            "Commission rate must be between 0 and 100";
        }
        break;
      case 3:
        if (!formData.contactPersonName.trim())
          newErrors.contactPersonName = "Contact person name is required";
        break;
      case 4:
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        break;
    }

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

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Validate all sections
    let isValid = true;
    for (let i = 1; i <= 5; i++) {
      if (!validateSection(i)) {
        isValid = false;
      }
    }

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the partner data for API
      const partnerData: CreatePartnerRequestDto = {
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
      };

      // Create the partner via API
      const response = await createPartner(partnerData);

      if (response.status && response.data) {
        // Redirect back to partners list
        router.push("/partners");
      } else {
        throw new Error(response.message || "Failed to create partner");
      }
    } catch (error) {
      console.error("Error saving partner:", error);
      // Error is already handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
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
                  <p className="text-sm text-red-500">{errors.businessName}</p>
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
                <Label htmlFor="email" className="text-sm font-medium">
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
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
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
                    handleInputChange("taxIdentificationNumber", e.target.value)
                  }
                  placeholder="e.g., TIN-123-456-789"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="commissionRate" className="text-sm font-medium">
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="text-sm font-medium"
                >
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
                  className="text-sm font-medium"
                >
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onChange={(e) => handleInputChange("country", e.target.value)}
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
          </div>
        );

      case 5:
        return (
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
        );

      default:
        return null;
    }
  };

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
            <h1 className="text-h1">Add New Partner</h1>
            <p className="text-caption mt-2">
              Create a new transportation partner in your network
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isCompleted = currentSection > section.id;
              const isCurrent = currentSection === section.id;

              return (
                <div key={section.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isCompleted
                        ? "bg-obus-accent border-obus-accent text-white"
                        : isCurrent
                        ? "border-obus-accent text-obus-accent bg-obus-accent/10"
                        : "border-obus-primary/20 text-obus-text-secondary dark:border-white/20 dark:text-obus-text-light"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-obus-primary dark:text-white"
                          : "text-obus-text-secondary dark:text-obus-text-light"
                      }`}
                    >
                      {section.title}
                    </p>
                    <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                      {section.description}
                    </p>
                  </div>
                  {index < sections.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-4 ${
                        isCompleted
                          ? "bg-obus-accent"
                          : "bg-obus-primary/20 dark:bg-white/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Error creating partner
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

        {/* Form Card */}
        <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
          <CardHeader>
            <CardTitle className="text-obus-primary dark:text-white">
              {sections[currentSection - 1].title}
            </CardTitle>
            <CardDescription>
              {sections[currentSection - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderSection()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 1}
            className="border-obus-primary/10 text-obus-text-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-obus-primary/20"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentSection < 5 ? (
              <Button
                onClick={handleNext}
                className="bg-obus-accent hover:bg-obus-accent/90"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-obus-accent hover:bg-obus-accent/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Partner...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Partner
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
