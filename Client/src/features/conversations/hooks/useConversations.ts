import { useState, useEffect, useCallback } from "react";
import type { Conversation } from "@/types/conversations";
import { conversationsApi } from "../api";
import { connectWebSocket, getSocket } from "@/services/websocket/ws-client";
import { useAuth } from "@/features/auth";
import type { Message } from "@/types/messages";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingStatus, setTypingStatus] = useState<Record<string, Set<string>>>({}); // conversationId -> Set of typing user IDs
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await conversationsApi.getConversations();
      setConversations(response.conversations);
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      setError(err.message || "Failed to fetch conversations");
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time WebSocket updates
  useEffect(() => {
    if (!user) return;

    let socket: any = null;
    let cleanup: (() => void) | null = null;

    const setupSocket = async () => {
      try {
        // Ensure WebSocket is connected
        socket = getSocket();
        if (!socket || !socket.connected) {
          console.log("[useConversations] Connecting WebSocket...");
          socket = await connectWebSocket();
          console.log("[useConversations] ✅ WebSocket connected:", socket.id);
        } else {
          console.log("[useConversations] ✅ WebSocket already connected:", socket.id);
        }

        const userIdStr = user._id?.toString() || user._id || "";

        // Listen for new messages - update conversation list
        const handleNewMessage = (message: Message) => {
          const msgConvId = message.conversationId?.toString() || message.conversationId;
          const msgSenderId = message.senderId?.toString() || message.senderId;
          const isFromCurrentUser = msgSenderId === userIdStr;
          const isAlreadyRead = message.readBy?.some((id: any) => {
            const readById = id?.toString() || id;
            return readById === userIdStr;
          }) || false;
          
          console.log("[useConversations] 📨 New message received, updating conversation list:", {
            conversationId: msgConvId,
            messageId: message.id,
            senderId: msgSenderId,
            isFromCurrentUser,
            isAlreadyRead,
            text: message.text?.substring(0, 30)
          });
          
          setConversations((prev) => {
            // Normalize conversation IDs for comparison
            const existingIndex = prev.findIndex((c) => {
              const cId = c.id?.toString() || c.id;
              return cId === msgConvId;
            });

            console.log("[useConversations] Found conversation at index:", existingIndex, "for convId:", msgConvId);

            if (existingIndex >= 0) {
              // Update existing conversation
              const updated = [...prev];
              const conv = updated[existingIndex];
              
              // Update last message
              const newLastMessage = {
                id: message.id,
                text: message.text || "",
                senderId: message.senderId,
                senderName: message.senderName || "Unknown",
                timestamp: message.timestamp,
                type: message.type,
              };

              // Update unread count if message is not from current user and not already read
              let newUnreadCount = conv.unreadCount;
              if (!isFromCurrentUser && !isAlreadyRead) {
                newUnreadCount = conv.unreadCount + 1;
                console.log("[useConversations] ➕ Incrementing unread count:", conv.unreadCount, "->", newUnreadCount);
              } else if (isFromCurrentUser) {
                // Don't increment for own messages
                newUnreadCount = conv.unreadCount;
                console.log("[useConversations] ℹ️ Own message, keeping unread count:", newUnreadCount);
              } else if (isAlreadyRead) {
                // Message already read, don't increment
                newUnreadCount = conv.unreadCount;
                console.log("[useConversations] ℹ️ Message already read, keeping unread count:", newUnreadCount);
              }

              updated[existingIndex] = {
                ...conv,
                lastMessage: newLastMessage,
                unreadCount: newUnreadCount,
                updatedAt: message.timestamp,
              };

              // Move updated conversation to top (most recent first)
              const [updatedConv] = updated.splice(existingIndex, 1);
              console.log("[useConversations] ✅ Updated conversation moved to top");
              return [updatedConv, ...updated];
            } else {
              // New conversation - refetch to get full details
              console.log("[useConversations] ⚠️ New conversation detected, refetching list...");
              // Use setTimeout to avoid state update during render
              setTimeout(() => {
                fetchConversations();
              }, 100);
              return prev;
            }
          });
        };

        // Listen for message read receipts - update unread count
        const handleReadReceipt = (data: { conversationId: string; messageIds: string[]; readerId: string }) => {
          const dataReaderId = data.readerId?.toString() || data.readerId;
          if (dataReaderId === userIdStr) {
            // Messages were read by current user - decrease unread count
            console.log("[useConversations] 📖 Messages read by current user, updating unread count");
            setConversations((prev) =>
              prev.map((conv) => {
                const convId = conv.id?.toString() || conv.id;
                const dataConvId = data.conversationId?.toString() || data.conversationId;
                if (convId === dataConvId) {
                  // If messageIds is empty, all messages were read
                  const readCount = data.messageIds.length > 0 ? data.messageIds.length : conv.unreadCount;
                  const newUnreadCount = Math.max(0, conv.unreadCount - readCount);
                  console.log(`[useConversations] Updated unread count for ${convId}: ${conv.unreadCount} -> ${newUnreadCount}`);
                  return { ...conv, unreadCount: newUnreadCount };
                }
                return conv;
              })
            );
          }
        };
        
        // Listen for conversation read events (for conversation list updates)
        const handleConversationRead = (data: { conversationId: string; readerId: string; readCount: number }) => {
          const dataReaderId = data.readerId?.toString() || data.readerId;
          if (dataReaderId === userIdStr) {
            console.log("[useConversations] 📖 Conversation read event, updating unread count");
            setConversations((prev) =>
              prev.map((conv) => {
                const convId = conv.id?.toString() || conv.id;
                const dataConvId = data.conversationId?.toString() || data.conversationId;
                if (convId === dataConvId) {
                  const newUnreadCount = Math.max(0, conv.unreadCount - (data.readCount || 0));
                  console.log(`[useConversations] Updated unread count for ${convId}: ${conv.unreadCount} -> ${newUnreadCount}`);
                  return { ...conv, unreadCount: newUnreadCount };
                }
                return conv;
              })
            );
          }
        };

        // Listen for presence updates - update online status
        const handlePresence = (data: { userId: string; isOnline: boolean; lastSeen?: string }) => {
          setConversations((prev) =>
            prev.map((conv) => ({
              ...conv,
              participants: conv.participants.map((p) =>
                p.id === data.userId ? { ...p, isOnline: data.isOnline, lastSeen: data.lastSeen } : p
              ),
            }))
          );
        };

        // Listen for typing indicators - update typing status in conversation list
        const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
          const dataConvId = data.conversationId?.toString() || data.conversationId;
          const dataUserId = data.userId?.toString() || data.userId;
          const currentUserId = userIdStr;
          
          // Don't show own typing status in conversation list
          if (dataUserId === currentUserId) return;
          
          console.log(`[useConversations] 📝 Typing event for conversation ${dataConvId}: user ${dataUserId} is ${data.isTyping ? "typing" : "not typing"}`);
          
          setTypingStatus((prev) => {
            const updated = { ...prev };
            if (!updated[dataConvId]) {
              updated[dataConvId] = new Set<string>();
            }
            
            if (data.isTyping) {
              updated[dataConvId].add(dataUserId);
            } else {
              updated[dataConvId].delete(dataUserId);
            }
            
            // Clean up empty sets
            if (updated[dataConvId].size === 0) {
              delete updated[dataConvId];
            }
            
            return updated;
          });
        };

        // Listen for conversation updates (when new conversations are created)
        const handleConversationUpdate = (data: { conversationId: string; type: "created" | "updated"; userId?: string }) => {
          console.log("[useConversations] Conversation updated:", data);
          // Only refetch if it's for the current user
          if (data.userId === userIdStr || !data.userId) {
            if (data.type === "created") {
              // Refetch to get the new conversation with all details
              console.log("[useConversations] New conversation created, refetching list...");
              fetchConversations();
            }
          }
        };
        
        // Also listen for global conversation:message events (for conversation list updates)
        const handleConversationMessage = (data: { conversationId: string; message: Message; timestamp: string }) => {
          console.log("[useConversations] 📬 Conversation message event received:", {
            conversationId: data.conversationId,
            messageId: data.message?.id,
            timestamp: data.timestamp,
            text: data.message?.text?.substring(0, 30)
          });
          // Update conversation list with new message
          if (data.message) {
            console.log("[useConversations] Processing conversation:message event for list update");
            handleNewMessage(data.message);
          } else {
            console.warn("[useConversations] ⚠️ conversation:message event received without message data");
          }
        };

        // Set up all event listeners
        console.log("[useConversations] Setting up event listeners...");
        socket.on("message", handleNewMessage);
        socket.on("conversation:message", handleConversationMessage);
        socket.on("message_read", handleReadReceipt);
        socket.on("conversation:read", handleConversationRead);
        socket.on("presence:update", handlePresence);
        socket.on("conversation:update", handleConversationUpdate);
        socket.on("typing", handleTyping);
        
        console.log("[useConversations] ✅ All event listeners registered");

        cleanup = () => {
          console.log("[useConversations] Cleaning up event listeners...");
          if (socket) {
            socket.off("message", handleNewMessage);
            socket.off("conversation:message", handleConversationMessage);
            socket.off("message_read", handleReadReceipt);
            socket.off("conversation:read", handleConversationRead);
            socket.off("presence:update", handlePresence);
            socket.off("conversation:update", handleConversationUpdate);
            socket.off("typing", handleTyping);
            console.log("[useConversations] ✅ Event listeners removed");
          }
        };
      } catch (err) {
        console.error("[useConversations] WebSocket setup error:", err);
      }
    };

    setupSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, [user, fetchConversations]);

  const refetch = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Merge typing status into conversations
  const conversationsWithTyping = conversations.map(conv => ({
    ...conv,
    typingUsers: Array.from(typingStatus[conv.id] || [])
  }));

  return {
    conversations: conversationsWithTyping,
    isLoading,
    error,
    refetch,
  };
}

