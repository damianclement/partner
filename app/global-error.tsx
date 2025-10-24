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
  RefreshCw,
  AlertTriangle,
  Bug,
  Mail,
  ArrowLeft,
} from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-br from-obus-primary via-obus-primary/90 to-[#0b1645] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
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
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-obus-primary">
                    Critical Error
                  </CardTitle>
                </div>

                <CardDescription className="text-lg text-obus-text-secondary max-w-2xl mx-auto">
                  A critical error has occurred in the application. Our
                  technical team has been automatically notified and is working
                  to resolve this issue.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Error Details */}
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                      Critical Application Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                      The application encountered a critical error that
                      prevented it from loading properly.
                    </p>
                    {error.digest && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-mono">
                        Error ID: {error.digest}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recovery Steps */}
              <div className="space-y-4">
                <h4 className="text-center font-semibold text-obus-primary">
                  Recovery Steps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-obus-primary/10 bg-white/50">
                    <div className="w-8 h-8 bg-obus-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-obus-accent">
                        1
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-obus-primary text-sm mb-1">
                        Refresh the Application
                      </h5>
                      <p className="text-xs text-obus-text-secondary">
                        Try refreshing the page to reload the application
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-obus-primary/10 bg-white/50">
                    <div className="w-8 h-8 bg-obus-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-obus-accent">
                        2
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-obus-primary text-sm mb-1">
                        Clear Browser Cache
                      </h5>
                      <p className="text-xs text-obus-text-secondary">
                        Clear your browser cache and cookies
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-obus-primary/10 bg-white/50">
                    <div className="w-8 h-8 bg-obus-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-obus-accent">
                        3
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-obus-primary text-sm mb-1">
                        Try Different Browser
                      </h5>
                      <p className="text-xs text-obus-text-secondary">
                        Try accessing the application in a different browser
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-obus-primary/10 bg-white/50">
                    <div className="w-8 h-8 bg-obus-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-obus-accent">
                        4
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-obus-primary text-sm mb-1">
                        Contact Support
                      </h5>
                      <p className="text-xs text-obus-text-secondary">
                        If the issue persists, contact our support team
                      </p>
                    </div>
                  </div>
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
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full sm:w-auto border-obus-primary/20 text-obus-primary hover:bg-obus-primary/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
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
                  This error has been automatically reported to our technical
                  team. If you continue to experience issues, please contact
                  support.
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
                    Emergency support available 24/7
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details Card */}
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
                        <pre className="font-mono text-xs text-obus-text-secondary overflow-x-auto whitespace-pre-wrap max-h-40">
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
      </body>
    </html>
  );
}
