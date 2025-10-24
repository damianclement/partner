"use client";

import { useRouter } from "next/navigation";
import { ApiKeySetup } from "@/components/ApiKeySetup";
import { useUser } from "@/lib/contexts/UserContext";

export default function SetupPage() {
  const router = useRouter();
  const { hasRole } = useUser();

  const handleSetupComplete = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-obus-primary via-obus-primary/90 to-[#0b1645] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-obus-primary/10 rounded-full mb-4">
            <div className="w-8 h-8 bg-obus-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            OBUS Partner Dashboard
          </h1>
          <p className="text-white/80 text-sm">
            Complete your setup to continue
          </p>
        </div>

        <ApiKeySetup onComplete={handleSetupComplete} />
      </div>
    </div>
  );
}
