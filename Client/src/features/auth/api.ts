// Auth API endpoints

import { api } from "@/services/api.client";
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  User,
} from "@/types/auth";

export const authApi = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/register", data);
  },

  // Login with existing user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/login", data);
  },

  // Social authentication
  socialAuth: async (
    provider: "google" | "microsoft" | "linkedin",
    idToken: string,
    fcmToken?: string
  ): Promise<AuthResponse> => {
    return api.post<AuthResponse>(`/auth/social/${provider}`, {
      idToken,
      fcmToken,
    });
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    return api.post<{ accessToken: string }>("/auth/refresh-token", {
      refreshToken,
    });
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>("/auth/user");
  },

  // Logout
  logout: async (fcmToken?: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/logout", { fcmToken });
  },

  // Complete tutorial
  completeTutorial: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>("/auth/tutorial/complete");
  },
};
