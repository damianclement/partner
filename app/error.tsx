"use client";

import { useEffect } from "react";
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
  RefreshCw,
  AlertCircle,
  Bug,
  Wifi,
  Server,
  Database,
  Mail,
} from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  const getErrorType = (error: Error) => {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return {
        type: "Network Error",
        icon: Wifi,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        description:
          "There seems to be a network connectivity issue. Please check your internet connection and try again.",
      };
    }

    if (message.includes("server") || message.includes("500")) {
      return {
        type: "Server Error",
        icon: Server,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        description:
          "Our servers are experiencing issues. Our team has been notified and is working to resolve this.",
      };
    }

    if (message.includes("database") || message.includes("db")) {
      return {
        type: "Database Error",
        icon: Database,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        description:
          "There's an issue with our database connection. Please try again in a few moments.",
      };
    }

    return {
      type: "Application Error",
      icon: Bug,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      description:
        "An unexpected error occurred. Our development team has been notified.",
    };
  };

  const errorInfo = getErrorType(error);
  const ErrorIcon = errorInfo.icon;

  const troubleshootingSteps = [
    {
      step: "1",
      title: "Check your connection",
      description: "Ensure you have a stable internet connection",
      icon: Wifi,
    },
    {
      step: "2",
      title: "Refresh the page",
      description: "Try reloading the page to resolve temporary issues",
      icon: RefreshCw,
    },
    {
      step: "3",
      title: "Clear browser cache",
      description: "Clear your browser cache and cookies",
      icon: Server,
    },
    {
      step: "4",
      title: "Contact support",
      description: "If the problem persists, contact our support team",
      icon: Mail,
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
                <div
                  className={`w-12 h-12 ${errorInfo.bgColor} rounded-full flex items-center justify-center`}
                >
                  <ErrorIcon className={`w-6 h-6 ${errorInfo.color}`} />
                </div>
                <CardTitle className="text-3xl font-bold text-obus-primary">
                  Something went wrong
                </CardTitle>
              </div>

              <CardDescription className="text-lg text-obus-text-secondary max-w-2xl mx-auto">
                We encountered an unexpected error. Don't worry, our team has
                been notified and we're working to fix this issue.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Error Details */}
            <div
              className={`p-4 rounded-lg border ${errorInfo.borderColor} ${errorInfo.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={`w-5 h-5 ${errorInfo.color} mt-0.5 shrink-0`}
                />
                <div>
                  <h3 className={`font-semibold ${errorInfo.color} mb-1`}>
                    {errorInfo.type}
                  </h3>
                  <p className="text-sm text-obus-text-secondary">
                    {errorInfo.description}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-obus-text-secondary mt-2 font-mono">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Troubleshooting Steps */}
            <div className="space-y-4">
              <h4 className="text-center font-semibold text-obus-primary">
                Troubleshooting Steps
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {troubleshootingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg border border-obus-primary/10 bg-white/50"
                    >
                      <div className="w-8 h-8 bg-obus-accent/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-obus-accent">
                          {step.step}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-obus-primary text-sm mb-1">
                          {step.title}
                        </h5>
                        <p className="text-xs text-obus-text-secondary">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={reset}
                className="w-full sm:w-auto bg-obus-accent hover:bg-obus-accent/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

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
                variant="outline"
                className="w-full sm:w-auto border-obus-primary/20 text-obus-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>

            {/* Support Section */}
            <div className="text-center pt-6 border-t border-obus-primary/10">
              <p className="text-sm text-obus-text-secondary mb-3">
                If this error persists, please contact our support team with the
                error details above.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <a
                  href="mailto:support@obus.co.tz"
                  className="inline-flex items-center gap-2 text-obus-accent hover:text-obus-accent/80 underline font-medium text-sm"
                >
                  <Mail className="w-4 h-4" />
                  support@obus.co.tz
                </a>
                <span className="hidden sm:inline text-obus-text-secondary">
                  •
                </span>
                <span className="text-obus-text-secondary text-sm">
                  Response time: Usually within 2 hours
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details Card (Collapsible) */}
        <Card className="mt-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <details className="group">
              <summary className="cursor-pointer flex items-center gap-2 text-obus-primary font-semibold hover:text-obus-accent transition-colors">
                <Bug className="w-4 h-4" />
                Technical Details (for developers)
                <span className="ml-auto group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-obus-primary">
                      Error Message:
                    </span>
                    <p className="font-mono text-red-600 dark:text-red-400 break-all">
                      {error.message}
                    </p>
                  </div>
                  {error.stack && (
                    <div>
                      <span className="font-semibold text-obus-primary">
                        Stack Trace:
                      </span>
                      <pre className="font-mono text-xs text-obus-text-secondary overflow-x-auto whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  {error.digest && (
                    <div>
                      <span className="font-semibold text-obus-primary">
                        Error Digest:
                      </span>
                      <p className="font-mono text-obus-text-secondary">
                        {error.digest}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
