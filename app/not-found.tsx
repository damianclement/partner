"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  Users,
  Building2,
  Bus,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const quickActions = [
    {
      title: "Dashboard",
      description: "Return to main dashboard",
      href: "/",
      icon: Home,
      color: "bg-obus-primary/10 text-obus-primary border-obus-primary/20",
    },
    {
      title: "Agents",
      description: "Manage your agents",
      href: "/agents",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      title: "Partners",
      description: "View partner network",
      href: "/partners",
      icon: Building2,
      color: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    {
      title: "Bookings",
      description: "Check booking status",
      href: "/bookings",
      icon: Bus,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-obus-primary via-obus-primary/90 to-[#0b1645] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Main Error Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            {/* Logo/Brand Section */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-obus-primary/10 rounded-full mb-6">
              <div className="w-12 h-12 bg-obus-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">O</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <CardTitle className="text-4xl font-bold text-obus-primary">
                  404
                </CardTitle>
              </div>

              <CardDescription className="text-xl text-obus-text-secondary max-w-2xl mx-auto">
                Oops! The page you're looking for seems to have taken a detour.
                Don't worry, we'll help you get back on track.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Error Details */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-obus-primary">
                Page Not Found
              </h3>
              <p className="text-obus-text-secondary">
                The requested page could not be found. It may have been moved,
                deleted, or you may have entered an incorrect URL.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="text-center font-semibold text-obus-primary">
                Quick Actions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} href={action.href}>
                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${action.color}`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <Icon className="w-6 h-6" />
                          <h5 className="font-semibold text-sm">
                            {action.title}
                          </h5>
                          <p className="text-xs opacity-75">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full sm:w-auto border-obus-primary/20 text-obus-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>

              <Button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto bg-obus-accent hover:bg-obus-accent/90"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full sm:w-auto border-obus-primary/20 text-obus-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>

            {/* Help Section */}
            <div className="text-center pt-6 border-t border-obus-primary/10">
              <p className="text-sm text-obus-text-secondary">
                Still having trouble? Contact our support team at{" "}
                <a
                  href="mailto:support@obus.co.tz"
                  className="text-obus-accent hover:text-obus-accent/80 underline font-medium"
                >
                  support@obus.co.tz
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
