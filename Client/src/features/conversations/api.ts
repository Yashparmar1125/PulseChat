// Conversations API endpoints

import { api } from "@/services/api.client";
import type { Conversation } from "@/types/conversations";

export interface CreateConversationRequest {
  participantIds: string[];
  name?: string;
  type?: "private" | "group";
}

export interface ArchiveConversationRequest {
  archived: boolean;
}

export interface PinConversationRequest {
  pinned: boolean;
}

export const conversationsApi = {
  // Get all conversations for current user
  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    return api.get<{ conversations: Conversation[] }>("/conversations");
  },

  // Get a single conversation
  getConversation: async (conversationId: string): Promise<Conversation> => {
    return api.get<Conversation>(`/conversations/${conversationId}`);
  },

  // Create a new conversation
  createConversation: async (
    data: CreateConversationRequest
  ): Promise<{ id: string; message: string }> => {
    return api.post<{ id: string; message: string }>("/conversations", data);
  },

  // Archive/Unarchive conversation
  archiveConversation: async (
    conversationId: string,
    data: ArchiveConversationRequest
  ): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(
      `/conversations/${conversationId}/archive`,
      data
    );
  },

  // Pin/Unpin conversation
  pinConversation: async (
    conversationId: string,
    data: PinConversationRequest
  ): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(
      `/conversations/${conversationId}/pin`,
      data
    );
  },

  // Delete conversation
  deleteConversation: async (
    conversationId: string
  ): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/conversations/${conversationId}`);
  },
};
