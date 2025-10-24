"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackPath?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  fallbackPath = "/login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(fallbackPath);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, fallbackPath, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-obus-primary/30 border-t-obus-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-obus-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if authentication is required but not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
