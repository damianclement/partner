"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "partner";

export interface User {
  id: number;
  displayName: string;
  username: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  userType: UserRole;
  partner?: {
    name: string;
    code: string;
  };
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data from API/localStorage
    const loadUser = async () => {
      try {
        // In a real app, this would be an API call or localStorage check
        // For demo purposes, we'll simulate different user types

        // Check if there's a stored user preference
        const storedUserType = localStorage.getItem(
          "demo-user-type"
        ) as UserRole | null;

        let mockUser: User;

        if (storedUserType === "partner") {
          mockUser = {
            id: 4,
            displayName: "Alice Brown",
            username: "abrown",
            email: "alice.brown@obus.com",
            employeeId: "EMP004",
            department: "Partner Relations",
            position: "Partner Manager",
            userType: "partner",
            partner: {
              name: "City Transport Ltd",
              code: "CT001",
            },
            status: "active",
            createdAt: "2024-02-10",
            lastLogin: "2 hours ago",
          };
        } else {
          // Default to admin user
          mockUser = {
            id: 1,
            displayName: "John Doe",
            username: "jdoe",
            email: "john.doe@obus.com",
            employeeId: "EMP001",
            department: "IT Administration",
            position: "System Administrator",
            userType: "admin",
            status: "active",
            createdAt: "2024-01-15",
            lastLogin: "2 hours ago",
          };
        }

        setUser(mockUser);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const hasRole = (role: UserRole): boolean => {
    return user?.userType === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.userType) : false;
  };

  const value: UserContextType = {
    user,
    isLoading,
    setUser,
    hasRole,
    hasAnyRole,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Helper function to switch user roles for demo purposes
export function switchUserRole(role: UserRole) {
  localStorage.setItem("demo-user-type", role);
  window.location.reload();
}
