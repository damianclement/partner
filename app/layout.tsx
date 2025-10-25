import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UserProvider } from "@/lib/contexts/UserContext";
import { AgentsProvider } from "@/lib/contexts/AgentsContext";
import { PartnersProvider } from "@/lib/contexts/PartnersContext";
import { SuperAgentsProvider } from "@/lib/contexts/SuperAgentsContext";
import { UsersProvider } from "@/lib/contexts/UsersContext";
import { RolesProvider } from "@/lib/contexts/RolesContext";
import { BookingsProvider } from "@/lib/contexts/BookingsContext";
import { BusCoreSystemsProvider } from "@/lib/contexts/BusCoreSystemsContext";
import { GroupAgentsProvider } from "@/lib/contexts/GroupAgentsContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const themeScript = `(() => {
  const storageKey = 'obus-dashboard-theme';
  const root = document.documentElement;

  try {
    const storedTheme = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');

    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  } catch {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
})();
`;

export const metadata: Metadata = {
  title: "OBUS PARTNER Dashboard",
  description: "Professional partner management dashboard for OBUS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body
        className={`${inter.variable} min-h-screen font-inter antialiased bg-obus-bg text-obus-text-primary transition-colors duration-300 dark:bg-obus-primary dark:text-white`}
      >
        <ThemeProvider defaultTheme="light">
          <ErrorBoundary>
            <UserProvider>
              <AgentsProvider>
                <PartnersProvider>
                  <SuperAgentsProvider>
                    <UsersProvider>
                      <RolesProvider>
                        <BookingsProvider>
                          <BusCoreSystemsProvider>
                            <GroupAgentsProvider>
                              {children}
                            </GroupAgentsProvider>
                          </BusCoreSystemsProvider>
                        </BookingsProvider>
                      </RolesProvider>
                    </UsersProvider>
                  </SuperAgentsProvider>
                </PartnersProvider>
              </AgentsProvider>
            </UserProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
