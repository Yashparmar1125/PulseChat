// Users API endpoints

import { api } from "@/services/api.client";
import type { User } from "@/types/auth";

export interface SearchUsersResponse {
  users: Array<{
    id: string;
    username: string;
    email: string;
    profilePicUrl?: string;
    statusText?: string;
    isOnline: boolean;
  }>;
}

export interface UpdateProfileRequest {
  username?: string;
  statusText?: string;
  profilePicUrl?: string;
  privacySettings?: {
    lastSeen: string;
    profilePhoto: string;
    status: string;
    readReceipts: boolean;
  };
}

export const usersApi = {
  // Search users
  searchUsers: async (query: string, limit?: number): Promise<SearchUsersResponse> => {
    const params = new URLSearchParams({ query });
    if (limit) params.append("limit", limit.toString());
    return api.get<SearchUsersResponse>(`/users/search?${params.toString()}`);
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<{ user: User }> => {
    return api.get<{ user: User }>(`/users/${userId}`);
  },

  // Update own profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ user: User; message: string }> => {
    return api.patch<{ user: User; message: string }>("/users/profile", data);
  },
};



