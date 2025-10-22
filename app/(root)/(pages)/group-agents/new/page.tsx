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
  Building2,
  User,
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

interface GroupAgentFormData {
  // Section 1: Basic Information
  partnerId: string;
  code: string;
  name: string;
  type: "Corporate" | "Agency" | "Individual" | "Franchise" | "";
  externalSystemIdentifier: string;
  description: string;

  // Section 2: Contact Information
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;

  // Section 3: Business Information
  businessName: string;
  businessAddress: string;
  taxId: string;
  licenseNumber: string;
  notes: string;
}

// Mock partners data - in real app this would come from API
const mockPartners = [
  { id: "1", name: "SafariLink Coaches", code: "SFC001" },
  { id: "2", name: "Coastal Express Ltd", code: "CEX002" },
  { id: "3", name: "Highland Transit", code: "HLT003" },
  { id: "4", name: "LakeZone Shuttles", code: "LZS004" },
  { id: "5", name: "Zanzibar Coastal Lines", code: "ZCL005" },
];

export default function NewGroupAgentPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<GroupAgentFormData>({
    partnerId: "",
    code: "",
    name: "",
    type: "",
    externalSystemIdentifier: "",
    description: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    businessName: "",
    businessAddress: "",
    taxId: "",
    licenseNumber: "",
    notes: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const sections = [
    {
      id: 1,
      title: "Basic Information",
      icon: Building2,
      description: "Group details and partner selection",
    },
    {
      id: 2,
      title: "Contact Information",
      icon: User,
      description: "Primary contact details",
    },
    {
      id: 3,
      title: "Business Information",
      icon: FileText,
      description: "Business details and documentation",
    },
  ];

  const validateSection = (section: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (section) {
      case 1:
        if (!formData.partnerId)
          newErrors.partnerId = "Partner selection is required";
        if (!formData.code.trim()) newErrors.code = "Group code is required";
        if (!formData.name.trim()) newErrors.name = "Group name is required";
        if (!formData.externalSystemIdentifier.trim())
          newErrors.externalSystemIdentifier =
            "External system identifier is required";
        break;
      case 2:
        // No required fields in contact section
        break;
      case 3:
        // No required fields in business section
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof GroupAgentFormData,
    value: string
  ) => {
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
      setCurrentSection((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Validate all sections
    let isValid = true;
    for (let i = 1; i <= 3; i++) {
      if (!validateSection(i)) {
        isValid = false;
      }
    }

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically make an API call to save the group agent
      console.log("Group agent data:", formData);

      // Redirect back to group agents list
      router.push("/group-agents");
    } catch (error) {
      console.error("Error saving group agent:", error);
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="partnerId" className="text-sm font-medium">
                  Partner <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.partnerId}
                  onValueChange={(value: string) =>
                    handleInputChange("partnerId", value)
                  }
                >
                  <SelectTrigger
                    className={errors.partnerId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPartners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name} ({partner.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.partnerId && (
                  <p className="text-sm text-red-500">{errors.partnerId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Group Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="e.g., GAG001"
                  className={errors.code ? "border-red-500" : ""}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Group Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Dar Corridor Elite"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Group Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: string) =>
                    handleInputChange("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Agency">Agency</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Franchise">Franchise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="externalSystemIdentifier"
                  className="text-sm font-medium"
                >
                  External System ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="externalSystemIdentifier"
                  value={formData.externalSystemIdentifier}
                  onChange={(e) =>
                    handleInputChange(
                      "externalSystemIdentifier",
                      e.target.value
                    )
                  }
                  placeholder="e.g., EXT-DAR-001"
                  className={
                    errors.externalSystemIdentifier ? "border-red-500" : ""
                  }
                />
                {errors.externalSystemIdentifier && (
                  <p className="text-sm text-red-500">
                    {errors.externalSystemIdentifier}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of the group agent..."
                  className="w-full min-h-[120px] px-3 py-2 border border-obus-primary/10 rounded-md bg-white text-obus-text-primary placeholder:text-obus-text-secondary focus:outline-none focus:ring-2 focus:ring-obus-accent focus:border-transparent dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-obus-text-light"
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
                <Label htmlFor="contactPerson" className="text-sm font-medium">
                  Contact Person
                </Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                  placeholder="e.g., Juma Mwakyusa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-sm font-medium">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  placeholder="e.g., juma@safarilink.co.tz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-sm font-medium">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="e.g., +255-752-123-456"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="e.g., Dar Corridor Elite Ltd"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId" className="text-sm font-medium">
                  Tax ID
                </Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  placeholder="e.g., TIN-123-456-789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber" className="text-sm font-medium">
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  placeholder="e.g., BRELA-123456"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="businessAddress"
                  className="text-sm font-medium"
                >
                  Business Address
                </Label>
                <textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    handleInputChange("businessAddress", e.target.value)
                  }
                  placeholder="e.g., 123 Bagamoyo Road, Dar es Salaam, Tanzania"
                  className="w-full min-h-[120px] px-3 py-2 border border-obus-primary/10 rounded-md bg-white text-obus-text-primary placeholder:text-obus-text-secondary focus:outline-none focus:ring-2 focus:ring-obus-accent focus:border-transparent dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-obus-text-light"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
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
            <h1 className="text-h1">Create New Group Agent</h1>
            <p className="text-caption mt-2">
              Create a new group agent in your transportation network
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
            {currentSection < 3 ? (
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
                    Creating Group...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Group Agent
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
