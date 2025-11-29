import { useState, useEffect } from "react";
import type { User, LoginCredentials, SignUpData } from "@/types/auth";

// Mock auth hook - replace with actual auth implementation
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("auth_token");
    if (token) {
      // In real app, validate token and fetch user
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Extract name from email for demo purposes
      const nameFromEmail = credentials.email.split("@")[0];
      const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      const mockUser: User = {
        id: "1",
        email: credentials.email,
        name: displayName || "Demo User",
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = "mock_jwt_token";
      
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return { user: mockUser, token: mockToken };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: "1",
        email: data.email,
        name: data.name,
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = "mock_jwt_token";
      
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return { user: mockUser, token: mockToken };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
  };
}

