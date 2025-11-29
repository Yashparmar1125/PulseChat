// Status API endpoints

import { api } from "@/services/api.client";

export interface Status {
  id: string;
  text: string;
  mediaUrl?: string;
  type: "text" | "image" | "video";
  createdAt: string;
  views: string[];
}

export interface UserStatus {
  userId: string;
  username: string;
  profilePicUrl?: string;
  statuses: Status[];
}

export interface CreateStatusRequest {
  text?: string;
  mediaUrl?: string;
  type?: "text" | "image" | "video";
}

export const statusApi = {
  // Get all statuses
  getStatuses: async (): Promise<{ statuses: UserStatus[] }> => {
    return api.get<{ statuses: UserStatus[] }>("/status");
  },

  // Create status
  createStatus: async (data: CreateStatusRequest): Promise<{ id: string; message: string }> => {
    return api.post<{ id: string; message: string }>("/status", data);
  },

  // View status
  viewStatus: async (statusId: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/status/${statusId}/view`);
  },

  // Delete status
  deleteStatus: async (statusId: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/status/${statusId}`);
  },
};



