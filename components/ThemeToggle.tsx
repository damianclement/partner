"use client";

import { useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();
  const nextThemeLabel = useMemo(() => (theme === "light" ? "dark" : "light"), [theme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-md border border-obus-primary/15 bg-white text-obus-text-secondary shadow-sm transition-colors hover:bg-obus-primary/5 hover:text-obus-primary focus:outline-none focus:ring-2 focus:ring-obus-accent/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-obus-text-light dark:hover:bg-white/10 dark:hover:text-white dark:focus:ring-white/30"
      aria-label={`Switch to ${nextThemeLabel} mode`}
      title={`Switch to ${nextThemeLabel} mode`}
      disabled={!isReady}
    >
      <Sun
        className={cn(
          "h-5 w-5 transition-all duration-300",
          theme === "dark" ? "scale-0 opacity-0 absolute" : "scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "h-5 w-5 transition-all duration-300",
          theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0 absolute"
        )}
      />
    </button>
  );
}
