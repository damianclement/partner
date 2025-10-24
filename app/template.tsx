"use client";

import { useEffect, useState } from "react";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-obus-primary via-obus-primary/90 to-[#0b1645] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-obus-accent/10 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-obus-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
              </div>
              <div className="w-6 h-6 border-2 border-obus-primary/30 border-t-obus-accent rounded-full animate-spin"></div>
              <p className="text-sm text-obus-text-secondary">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
