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
  Phone,
  Building2,
  MapPin,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormData {
  // Section 1: Basic Information
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  employeeId: string;

  // Section 2: Contact Information
  phoneNumber: string;
  personalEmail: string;
  workPhone: string;
  workEmail: string;

  // Section 3: Work Information
  department: string;
  position: string;
  officeLocation: string;
  gender: "Male" | "Female" | "Other" | "";

  // Section 4: Address Information
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  timezone: string;

  // Section 5: Additional Information
  nationalId: string;
  passportNumber: string;
  preferredLanguage: "English" | "Swahili" | "French" | "";

  // Section 6: Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
}

// Mock timezone data
const timezones = [
  { value: "Africa/Dar_es_Salaam", label: "Africa/Dar es Salaam (EAT)" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
  { value: "Africa/Kampala", label: "Africa/Kampala (EAT)" },
  { value: "Africa/Kigali", label: "Africa/Kigali (CAT)" },
  { value: "Africa/Bujumbura", label: "Africa/Bujumbura (CAT)" },
  { value: "UTC", label: "UTC (GMT)" },
];

export default function NewUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<UserFormData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    displayName: "",
    employeeId: "",
    phoneNumber: "",
    personalEmail: "",
    workPhone: "",
    workEmail: "",
    department: "",
    position: "",
    officeLocation: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    timezone: "",
    nationalId: "",
    passportNumber: "",
    preferredLanguage: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Only validate required fields: Username, Email, First Name, Last Name, Display Name, Phone Number
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.displayName.trim())
      newErrors.displayName = "Display name is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    // Validate email format for optional email fields if they are filled
    if (
      formData.personalEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)
    )
      newErrors.personalEmail = "Invalid email format";
    if (
      formData.workEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)
    )
      newErrors.workEmail = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically make an API call to save the user
      console.log("User data:", formData);

      // Redirect back to users list
      router.push("/users");
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-h1">Add New User</h1>
            <p className="text-caption mt-2">
              Create a new user account in the system
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-obus-primary dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Personal details and identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    placeholder="e.g., jmwakyusa"
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
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
                    placeholder="e.g., john@obus.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="e.g., John"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="e.g., Mwakyusa"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium">
                    Display Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                    placeholder="e.g., John Mwakyusa"
                    className={errors.displayName ? "border-red-500" : ""}
                  />
                  {errors.displayName && (
                    <p className="text-sm text-red-500">{errors.displayName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-sm font-medium">
                    Employee ID
                  </Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) =>
                      handleInputChange("employeeId", e.target.value)
                    }
                    placeholder="e.g., EMP001"
                    className={errors.employeeId ? "border-red-500" : ""}
                  />
                  {errors.employeeId && (
                    <p className="text-sm text-red-500">{errors.employeeId}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Contact Information */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-obus-primary dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Phone numbers and email addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    htmlFor="personalEmail"
                    className="text-sm font-medium"
                  >
                    Personal Email
                  </Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) =>
                      handleInputChange("personalEmail", e.target.value)
                    }
                    placeholder="e.g., john.mwakyusa@gmail.com"
                    className={errors.personalEmail ? "border-red-500" : ""}
                  />
                  {errors.personalEmail && (
                    <p className="text-sm text-red-500">
                      {errors.personalEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workPhone" className="text-sm font-medium">
                    Work Phone
                  </Label>
                  <Input
                    id="workPhone"
                    value={formData.workPhone}
                    onChange={(e) =>
                      handleInputChange("workPhone", e.target.value)
                    }
                    placeholder="e.g., +255-22-123-456"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workEmail" className="text-sm font-medium">
                    Work Email
                  </Label>
                  <Input
                    id="workEmail"
                    type="email"
                    value={formData.workEmail}
                    onChange={(e) =>
                      handleInputChange("workEmail", e.target.value)
                    }
                    placeholder="e.g., john.mwakyusa@obus.com"
                    className={errors.workEmail ? "border-red-500" : ""}
                  />
                  {errors.workEmail && (
                    <p className="text-sm text-red-500">{errors.workEmail}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Work Information */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-obus-primary dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Work Information
              </CardTitle>
              <CardDescription>
                Job details and workplace information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    placeholder="e.g., IT Administration"
                    className={errors.department ? "border-red-500" : ""}
                  />
                  {errors.department && (
                    <p className="text-sm text-red-500">{errors.department}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium">
                    Position
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    placeholder="e.g., System Administrator"
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && (
                    <p className="text-sm text-red-500">{errors.position}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="officeLocation"
                    className="text-sm font-medium"
                  >
                    Office Location
                  </Label>
                  <Input
                    id="officeLocation"
                    value={formData.officeLocation}
                    onChange={(e) =>
                      handleInputChange("officeLocation", e.target.value)
                    }
                    placeholder="e.g., Dar es Salaam Office"
                    className={errors.officeLocation ? "border-red-500" : ""}
                  />
                  {errors.officeLocation && (
                    <p className="text-sm text-red-500">
                      {errors.officeLocation}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: string) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.gender ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Address Information */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-obus-primary dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
              <CardDescription>
                Residential address and location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="e.g., 123 Bagamoyo Road, Kinondoni"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
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
                    State
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
                    Country
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
                    placeholder="e.g., 14110"
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500">{errors.postalCode}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium">
                    Timezone
                  </Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value: string) =>
                      handleInputChange("timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Additional Information */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-obus-primary dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Additional Information
              </CardTitle>
              <CardDescription>Documentation and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nationalId" className="text-sm font-medium">
                    National ID
                  </Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) =>
                      handleInputChange("nationalId", e.target.value)
                    }
                    placeholder="e.g., 1234567890123456"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="passportNumber"
                    className="text-sm font-medium"
                  >
                    Passport Number
                  </Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) =>
                      handleInputChange("passportNumber", e.target.value)
                    }
                    placeholder="e.g., A1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="preferredLanguage"
                    className="text-sm font-medium"
                  >
                    Preferred Language
                  </Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value: string) =>
                      handleInputChange("preferredLanguage", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Swahili">Swahili</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Emergency Contact */}
          <Card className="border border-obus-primary/10 bg-white shadow-sm transition-colors dark:border-white/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-obus-primary dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Emergency Contact
              </CardTitle>
              <CardDescription>Emergency contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="emergencyContactName"
                    className="text-sm font-medium"
                  >
                    Emergency Contact Name
                  </Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                    placeholder="e.g., Mary Mwakyusa"
                    className={
                      errors.emergencyContactName ? "border-red-500" : ""
                    }
                  />
                  {errors.emergencyContactName && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContactName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="emergencyContactPhone"
                    className="text-sm font-medium"
                  >
                    Emergency Contact Phone
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyContactPhone", e.target.value)
                    }
                    placeholder="e.g., +255-752-987-654"
                    className={
                      errors.emergencyContactPhone ? "border-red-500" : ""
                    }
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContactPhone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-obus-accent hover:bg-obus-accent/90"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating User...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
