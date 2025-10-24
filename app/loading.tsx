"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-obus-primary via-obus-primary/90 to-[#0b1645] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Logo/Brand Section */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-obus-primary/10 rounded-full">
                <div className="w-10 h-10 bg-obus-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
              </div>

              {/* Loading Animation */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-obus-primary/30 border-t-obus-accent rounded-full animate-spin"></div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-obus-primary mb-1">
                    Loading OBUS Partner
                  </h2>
                  <p className="text-sm text-obus-text-secondary">
                    Please wait while we prepare your dashboard...
                  </p>
                </div>
              </div>

              {/* Loading Steps */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs text-obus-text-secondary">
                  <span>Initializing...</span>
                  <div className="w-2 h-2 bg-obus-accent rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-obus-text-secondary">
                  <span>Loading data...</span>
                  <div className="w-2 h-2 bg-obus-primary/30 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-obus-text-secondary">
                  <span>Preparing interface...</span>
                  <div className="w-2 h-2 bg-obus-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
