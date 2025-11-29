// Messages API endpoints

import { api } from "@/services/api.client";
import type { Message, SendMessagePayload } from "@/types/messages";

export const messagesApi = {
  // Get messages for a conversation
  getMessages: async (
    conversationId: string,
    limit?: number,
    before?: string
  ): Promise<{ messages: Message[] }> => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (before) params.append("before", before);
    
    const query = params.toString();
    return api.get<{ messages: Message[] }>(
      `/messages/conversation/${conversationId}${query ? `?${query}` : ""}`
    );
  },

  // Send a message
  sendMessage: async (
    conversationId: string,
    data: Omit<SendMessagePayload, "conversationId">
  ): Promise<{ message: Message }> => {
    return api.post<{ message: Message }>(
      `/messages/conversation/${conversationId}`,
      data
    );
  },

  // Update a message
  updateMessage: async (
    messageId: string,
    text: string
  ): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(`/messages/${messageId}`, { text });
  },

  // Delete a message
  deleteMessage: async (messageId: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/messages/${messageId}`);
  },

  // Mark messages as read
  markAsRead: async (
    conversationId: string
  ): Promise<{ message: string }> => {
    return api.post<{ message: string }>(
      `/messages/conversation/${conversationId}/read`
    );
  },
};
