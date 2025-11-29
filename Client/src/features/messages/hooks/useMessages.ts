import { useState, useEffect } from "react";
import type { Message, SendMessagePayload } from "@/types/messages";

// Mock messages hook - replace with actual API
export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    
    // Mock messages - replace with actual API call
    const mockMessages: Message[] = [
      {
        id: "msg1",
        conversationId,
        senderId: "user2",
        senderName: "Sarah Johnson",
        text: "Hey! How are you doing?",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        readBy: [],
        status: "read",
      },
      {
        id: "msg2",
        conversationId,
        senderId: "current-user",
        senderName: "You",
        text: "I'm doing great, thanks for asking! How about you?",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
        readBy: ["user2"],
        status: "read",
      },
      {
        id: "msg3",
        conversationId,
        senderId: "user2",
        senderName: "Sarah Johnson",
        text: "Awesome! Just finished a big project 🎉",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        readBy: [],
        status: "read",
      },
      {
        id: "msg4",
        conversationId,
        senderId: "current-user",
        senderName: "You",
        text: "That's amazing! Congratulations! 🎊",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        readBy: ["user2"],
        status: "read",
      },
    ];

    setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
    }, 500);
  }, [conversationId]);

  const sendMessage = async (payload: SendMessagePayload) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: payload.conversationId,
      senderId: "current-user",
      senderName: "You",
      text: payload.text,
      type: payload.type,
      timestamp: new Date().toISOString(),
      readBy: [],
      status: "sending",
      replyTo: payload.replyToId
        ? messages.find((m) => m.id === payload.replyToId)
          ? {
              messageId: payload.replyToId,
              senderName: "User",
              text: "Previous message",
            }
          : undefined
        : undefined,
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);

    // Simulate sending
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "sent" as Message["status"] }
            : msg
        )
      );
    }, 500);

    // Simulate delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "delivered" as Message["status"] }
            : msg
        )
      );
    }, 1000);

    // Simulate read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "read" as Message["status"] }
            : msg
        )
      );
    }, 2000);
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}

