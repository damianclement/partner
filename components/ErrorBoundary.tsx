"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Log to error reporting service
    if (typeof window !== "undefined") {
      // You can integrate with services like Sentry, LogRocket, etc.
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-obus-primary via-obus-primary/90 to-[#0b1645] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-obus-primary">
              Application Error
            </CardTitle>
            <CardDescription className="text-obus-text-secondary">
              Something went wrong in the application. Please try again or
              contact support if the issue persists.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={reset}
                className="bg-obus-accent hover:bg-obus-accent/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-obus-primary/20 text-obus-primary hover:bg-obus-primary/5"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>

              <Button
                onClick={() => router.back()}
                variant="outline"
                className="border-obus-primary/20 text-obus-primary hover:bg-obus-primary/5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-obus-primary/10">
              <p className="text-sm text-obus-text-secondary">
                Need help? Contact{" "}
                <a
                  href="mailto:support@obus.co.tz"
                  className="text-obus-accent hover:text-obus-accent/80 underline"
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

// Hook for functional components to trigger error boundary
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}
