import { useState, useEffect } from "react";
import type { Conversation } from "@/types/conversations";

// Mock conversations hook - replace with actual API
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockConversations: Conversation[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: undefined,
        lastMessage: {
          id: "m1",
          text: "Hey! How are you doing?",
          senderId: "user2",
          senderName: "Sarah Johnson",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          type: "text",
        },
        unreadCount: 2,
        isPinned: true,
        isArchived: false,
        isGroup: false,
        participants: [
          {
            id: "user2",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            isOnline: true,
          },
        ],
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "2",
        name: "Design Team",
        avatar: undefined,
        lastMessage: {
          id: "m2",
          text: "The new design looks great! 🎨",
          senderId: "user3",
          senderName: "Alex",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          type: "text",
        },
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        isGroup: true,
        participants: [
          {
            id: "user3",
            name: "Alex",
            email: "alex@example.com",
            isOnline: false,
          },
          {
            id: "user4",
            name: "Jordan",
            email: "jordan@example.com",
            isOnline: true,
          },
        ],
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: "3",
        name: "Mike Chen",
        avatar: undefined,
        lastMessage: {
          id: "m3",
          text: "Thanks for the help!",
          senderId: "current-user",
          senderName: "You",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          type: "text",
        },
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        isGroup: false,
        participants: [
          {
            id: "user5",
            name: "Mike Chen",
            email: "mike@example.com",
            isOnline: false,
            lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          },
        ],
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    conversations,
    isLoading,
    refetch: () => {
      setIsLoading(true);
      // Trigger refetch
      setTimeout(() => setIsLoading(false), 500);
    },
  };
}

