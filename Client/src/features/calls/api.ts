// Calls API endpoints

import { api } from "@/services/api.client";

export interface CallLog {
  id: string;
  type: "voice" | "video";
  status: "completed" | "missed" | "canceled" | "ringing" | "answered";
  duration: number;
  startedAt: string;
  endedAt?: string;
  participants: Array<{
    id: string;
    username: string;
    profilePicUrl?: string;
  }>;
}

export interface InitiateCallRequest {
  conversationId: string;
  type?: "voice" | "video";
}

export interface UpdateCallRequest {
  status: "answered" | "ended" | "missed" | "declined";
  duration?: number;
}

export const callsApi = {
  // Get call logs
  getCallLogs: async (limit?: number): Promise<{ callLogs: CallLog[] }> => {
    const params = limit ? `?limit=${limit}` : "";
    return api.get<{ callLogs: CallLog[] }>(`/calls${params}`);
  },

  // Initiate call
  initiateCall: async (data: InitiateCallRequest): Promise<{ id: string; message: string }> => {
    return api.post<{ id: string; message: string }>("/calls", data);
  },

  // Update call status
  updateCall: async (callId: string, data: UpdateCallRequest): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(`/calls/${callId}`, data);
  },
};



