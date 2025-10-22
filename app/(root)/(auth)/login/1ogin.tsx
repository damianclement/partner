"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    remember: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (key: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formState.email || !formState.password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-obus-bg/70 px-4 py-10 dark:bg-obus-primary/95">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-obus-primary/10 bg-white/90 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative hidden flex-col justify-between bg-linear-to-br from-obus-primary via-obus-primary/90 to-[#0b1645] p-10 text-white lg:flex">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/70">
              OBUS Partner Network
            </p>
            <h1 className="mt-6 text-3xl font-semibold leading-tight">
              Welcome back to your Tanzanian operations hub
            </h1>
            <p className="mt-4 text-sm text-white/80">
              Monitor partner performance, approvals, and booking trends across
              Dar es Salaam, Dodoma, Mwanza, and beyond in one control centre.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-obus-accent" />
              <p className="text-sm text-white/90">
                Real-time visibility on partner compliance and agent activity
                across the network.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-white/60" />
              <p className="text-sm text-white/90">
                Streamlined approvals for new partners joining from all
                Tanzanian corridors.
              </p>
            </div>
          </div>
          <div className="pt-6 text-xs text-white/60">
            Need help? Email support@obus.co.tz
          </div>
          <div className="absolute inset-x-8 bottom-8 h-px bg-white/20" />
        </div>

        <div className="flex items-center justify-center bg-white/80 p-8 dark:bg-white/10">
          <Card className="w-full border-none bg-transparent shadow-none dark:bg-transparent">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-obus-primary dark:text-white">
                Sign in
              </CardTitle>
              <CardDescription className="text-obus-text-secondary dark:text-obus-text-light">
                Enter your details to access the OBUS partner dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-obus-text-secondary dark:text-obus-text-light"
                  >
                    Work email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.co.tz"
                    value={formState.email}
                    onChange={(event) =>
                      handleInputChange("email", event.target.value)
                    }
                    className="border-obus-primary/15 bg-white text-obus-text-primary placeholder:text-obus-text-secondary/70 focus:border-obus-accent/60 focus:ring-obus-accent/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-obus-text-secondary dark:text-obus-text-light"
                    >
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="text-xs font-medium text-obus-accent hover:text-obus-accent/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={formState.password}
                    onChange={(event) =>
                      handleInputChange("password", event.target.value)
                    }
                    className="border-obus-primary/15 bg-white text-obus-text-primary placeholder:text-obus-text-secondary/70 focus:border-obus-accent/60 focus:ring-obus-accent/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={formState.remember}
                      onCheckedChange={(checked) =>
                        handleInputChange("remember", !!checked)
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-obus-text-secondary dark:text-obus-text-light"
                    >
                      Keep me signed in on this device
                    </Label>
                  </div>
                </div>

                {error ? (
                  <div className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-500 dark:border-red-300/30 dark:bg-red-500/10 dark:text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-obus-accent text-white hover:bg-obus-accent/90 focus-visible:ring-obus-accent/40"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4">
              <div className="h-px w-full bg-obus-primary/10 dark:bg-white/10" />
              <p className="text-xs text-obus-text-secondary dark:text-obus-text-light">
                By signing in you agree to the OBUS partner terms and privacy
                policy.
              </p>
              <p className="text-sm text-obus-text-secondary dark:text-obus-text-light">
                Not onboarded yet?{" "}
                <Link
                  href="#"
                  className="font-medium text-obus-accent hover:text-obus-accent/80"
                >
                  Request partner access
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
