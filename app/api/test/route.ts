import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/config";

export async function GET() {
  const baseUrl = getApiBaseUrl();

  return NextResponse.json({
    success: true,
    message: "API configuration test",
    data: {
      baseUrl,
      isDevelopment:
        typeof window !== "undefined"
          ? window.location.hostname === "localhost"
          : "server-side",
      timestamp: new Date().toISOString(),
      hostname:
        typeof window !== "undefined"
          ? window.location.hostname
          : "server-side",
      environment: process.env.NODE_ENV || "unknown",
      nextConfig: "rewrites configured for /api/* -> external API",
    },
  });
}
