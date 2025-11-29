import { useState, useEffect, useCallback, useRef } from "react";
import type { Message, SendMessagePayload } from "@/types/messages";
import { messagesApi } from "../api";
import { useAuth } from "@/features/auth";
import { connectWebSocket, getSocket } from "@/services/websocket/ws-client";
import {
  joinConversation,
  leaveConversation,
  sendMessageViaSocket,
  onMessage,
  onTyping,
  markMessagesRead,
  removeAllListeners,
} from "@/services/websocket/ws-events";

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("[useMessages] Fetching messages for conversation:", conversationId);
      const response = await messagesApi.getMessages(conversationId, 50);
      console.log("[useMessages] Received messages:", response.messages.length);
      
      // Normalize and update message status based on readBy
      const userIdStr = user?._id?.toString() || user?._id || "";
      
      const updatedMessages = response.messages
        .map((msg) => {
          // Normalize IDs to strings for consistent comparison
          const normalizedMsg = {
            ...msg,
            id: msg.id?.toString() || msg._id?.toString() || "",
            senderId: msg.senderId?.toString() || msg.senderId,
            conversationId: msg.conversationId?.toString() || msg.conversationId,
            readBy: Array.isArray(msg.readBy) 
              ? msg.readBy.map((id: any) => id?.toString() || id)
              : [],
          };
          
          // Check if message is read by current user
          const isReadByMe = normalizedMsg.readBy.some((id: any) => 
            (id?.toString() || id) === userIdStr
          );
          
          // Check if message is sent by current user
          const isSent = normalizedMsg.senderId === userIdStr;
          
          // Determine status
          let status: Message["status"] = "sent";
          if (isSent) {
            // For messages I sent: check if read by recipient
            const otherParticipants = normalizedMsg.readBy.filter((id: any) => {
              const readById = id?.toString() || id;
              return readById !== userIdStr;
            });
            status = otherParticipants.length > 0 ? "read" : "delivered";
          } else {
            // For incoming messages: "sent" if not read by me, "read" if read by me
            status = isReadByMe ? "read" : "sent";
          }
          
          return { ...normalizedMsg, status };
        })
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort chronologically
      
      console.log("[useMessages] Setting messages:", updatedMessages.length);
      setMessages(updatedMessages);
    } catch (err: any) {
      console.error("[useMessages] Error fetching messages:", err);
      console.error("[useMessages] Error details:", {
        message: err.message,
        status: err.status,
        conversationId,
      });
      setError(err.message || "Failed to fetch messages");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, user?._id]);

  // WebSocket integration
  useEffect(() => {
    if (!conversationId || !user) return;

    let socket: any = null;
    let cleanup: (() => void) | null = null;

    const setupSocket = async () => {
      try {
        console.log("[useMessages] Setting up WebSocket for conversation:", conversationId);
        
        // Get or create socket connection
        const currentSocket = getSocket();
        if (!currentSocket || !currentSocket.connected) {
          console.log("[useMessages] WebSocket not connected, connecting...");
          socket = await connectWebSocket();
          console.log("[useMessages] ✅ WebSocket connected:", socket?.id);
        } else {
          socket = currentSocket;
          console.log("[useMessages] ✅ WebSocket already connected:", socket.id);
        }
        
        // Join conversation room
        try {
          await joinConversation(socket, conversationId);
          console.log("[useMessages] ✅ Joined conversation room:", conversationId);
        } catch (joinErr: any) {
          console.error("[useMessages] ❌ Failed to join conversation:", joinErr);
          // Don't throw - continue without WebSocket if join fails
        }
        
        // Listen for new messages
        const handleNewMessage = (newMessage: any) => {
          console.log("[useMessages] 📨 Received new message via WebSocket:", {
            id: newMessage.id || newMessage._id,
            conversationId: newMessage.conversationId,
            senderId: newMessage.senderId,
            text: newMessage.text || newMessage.body
          });
          
          // Normalize conversationId for comparison
          const msgConvId = newMessage.conversationId?.toString() || newMessage.conversationId;
          const currentConvId = conversationId?.toString() || conversationId;
          
          console.log("[useMessages] Comparing conversation IDs - message:", msgConvId, "current:", currentConvId);
          
          if (msgConvId === currentConvId) {
            console.log("[useMessages] ✅ Message belongs to current conversation, adding to state");
            
            // Normalize message format
            const normalizedMessage: Message = {
              id: newMessage.id || newMessage._id?.toString() || '',
              conversationId: msgConvId,
              senderId: newMessage.senderId?.toString() || newMessage.senderId,
              senderName: newMessage.senderName || 'Unknown',
              senderAvatar: newMessage.senderAvatar,
              text: newMessage.text || newMessage.body || '',
              type: (newMessage.type || 'text') as Message["type"],
              timestamp: newMessage.timestamp || newMessage.createdAt || new Date().toISOString(),
              editedAt: newMessage.editedAt,
              readBy: Array.isArray(newMessage.readBy) ? newMessage.readBy.map((id: any) => id?.toString() || id) : [],
              attachments: newMessage.attachments || [],
              status: 'sent' as Message["status"],
            };
            
            setMessages((prev) => {
              // Avoid duplicates by checking ID (including temp IDs)
              const existingIndex = prev.findIndex((m) => {
                const mId = m.id?.toString() || m.id;
                const newId = normalizedMessage.id?.toString() || normalizedMessage.id;
                // Also check if it's the same message by timestamp and sender (for temp IDs)
                return mId === newId || 
                       (mId.startsWith('temp-') && 
                        m.timestamp === normalizedMessage.timestamp &&
                        m.senderId === normalizedMessage.senderId &&
                        m.text === normalizedMessage.text);
              });
              
              if (existingIndex >= 0) {
                console.log("[useMessages] Message already exists, updating:", normalizedMessage.id);
                // Update existing message, preserve status if it's better
                const existing = prev[existingIndex];
                const updatedStatus = existing.status === "read" || existing.status === "delivered" 
                  ? existing.status 
                  : normalizedMessage.status || "sent";
                
                return prev.map((m, idx) => 
                  idx === existingIndex 
                    ? { ...normalizedMessage, status: updatedStatus }
                    : m
                );
              }
              
              console.log("[useMessages] ➕ Adding new message to state:", normalizedMessage.id);
              
              // Determine status for new message based on readBy
              const userIdStr = user?._id?.toString() || user?._id || '';
              const isSent = normalizedMessage.senderId === userIdStr;
              
              // Check if message is read
              const isRead = normalizedMessage.readBy?.some((id: any) => {
                const readById = id?.toString() || id;
                return readById === userIdStr;
              }) || false;
              
              let status: Message["status"] = "sent";
              if (isSent) {
                // For messages I sent: check if read by recipient
                const otherParticipants = normalizedMessage.readBy?.filter((id: any) => {
                  const readById = id?.toString() || id;
                  return readById !== userIdStr;
                }) || [];
                status = otherParticipants.length > 0 ? "read" : "delivered";
              } else {
                // For incoming messages: "sent" (from receiver's perspective)
                status = isRead ? "read" : "sent";
              }
              
              // Insert in correct position (sorted by timestamp)
              const newMessages = [...prev, { ...normalizedMessage, status }];
              return newMessages.sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            });
          } else {
            console.log("[useMessages] ⚠️ Message belongs to different conversation, ignoring");
          }
        };
        
        socket.on("message", handleNewMessage);
        console.log("[useMessages] ✅ Registered 'message' event listener for conversation:", conversationId);
        
        // Listen for read receipts
        const handleReadReceipt = (data: { conversationId: string; messageIds: string[]; readerId: string }) => {
          const dataConvId = data.conversationId?.toString();
          const currentConvId = conversationId?.toString();
          const dataReaderId = data.readerId?.toString() || data.readerId;
          const currentUserId = user._id?.toString() || user._id;
          
          if (dataConvId === currentConvId) {
            console.log("[useMessages] 📖 Read receipt received:", {
              conversationId: dataConvId,
              messageIds: data.messageIds.length,
              readerId: dataReaderId,
              isCurrentUser: dataReaderId === currentUserId
            });
            
            setMessages((prev) =>
              prev.map((msg) => {
                const msgId = msg.id?.toString() || msg.id;
                const msgSenderId = msg.senderId?.toString() || msg.senderId;
                
                // If messageIds is empty, all messages in conversation were read
                const wasRead = data.messageIds.length === 0 || 
                               data.messageIds.includes(msgId) || 
                               data.messageIds.includes(msg.id);
                
                if (wasRead) {
                  // If current user read messages (not sent by them), mark as read
                  if (dataReaderId === currentUserId && msgSenderId !== currentUserId) {
                    const currentReadBy = msg.readBy || [];
                    const alreadyRead = currentReadBy.some((id: any) => 
                      (id?.toString() || id) === currentUserId
                    );
                    
                    if (!alreadyRead) {
                      console.log(`[useMessages] Marking message ${msgId} as read by current user`);
                      return {
                        ...msg,
                        readBy: [...currentReadBy, currentUserId],
                        status: "read" as Message["status"],
                      };
                    }
                  }
                  
                  // If someone else read my messages, update status to "read"
                  if (dataReaderId !== currentUserId && msgSenderId === currentUserId) {
                    const currentReadBy = msg.readBy || [];
                    const alreadyReadByThisUser = currentReadBy.some((id: any) => 
                      (id?.toString() || id) === dataReaderId
                    );
                    
                    if (!alreadyReadByThisUser) {
                      console.log(`[useMessages] Message ${msgId} was read by ${dataReaderId}`);
                      const updatedReadBy = [...currentReadBy, dataReaderId];
                      // Check if all participants have read (for status)
                      return {
                        ...msg,
                        readBy: updatedReadBy,
                        status: "read" as Message["status"],
                      };
                    }
                  }
                }
                return msg;
              })
            );
          }
        };
        
        socket.on("message_read", handleReadReceipt);
        
        // Listen for typing indicators
        const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
          const dataConvId = data.conversationId?.toString();
          const currentConvId = conversationId?.toString();
          const dataUserId = data.userId?.toString() || data.userId;
          const currentUserId = user._id?.toString() || user._id;
          
          if (dataConvId === currentConvId && dataUserId !== currentUserId) {
            console.log(`[useMessages] User ${dataUserId} is ${data.isTyping ? "typing" : "not typing"}`);
            setTypingUsers((prev) => {
              const updated = new Set(prev);
              if (data.isTyping) {
                updated.add(dataUserId);
              } else {
                updated.delete(dataUserId);
              }
              return updated;
            });
          }
        };
        
        socket.on("typing", handleTyping);
        
        // Listen for presence updates
        const handlePresence = (data: { userId: string; isOnline: boolean; lastSeen?: string }) => {
          // Update presence for users in this conversation
          // This can be used to show online/offline status
          console.log(`User ${data.userId} is ${data.isOnline ? "online" : "offline"}`);
        };
        
        socket.on("presence:update", handlePresence);

        cleanup = () => {
          if (socket) {
            leaveConversation(socket, conversationId);
            socket.off("message", handleNewMessage);
            socket.off("message_read", handleReadReceipt);
            socket.off("typing", handleTyping);
            socket.off("presence:update", handlePresence);
          }
        };
      } catch (err) {
        console.error("WebSocket connection error:", err);
      }
    };
    
    setupSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto-mark messages as read when conversation is viewed
  useEffect(() => {
    if (!conversationId || !user?._id || messages.length === 0) return;
    
    // Mark as read after a short delay to ensure messages are loaded
    const timer = setTimeout(() => {
      markAsRead();
    }, 1000);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user?._id]); // Only re-run when conversation or user changes

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    if (!conversationId || !payload.text?.trim()) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userIdStr = user?._id?.toString() || user?._id || "";
    
    const optimisticMessage: Message = {
      id: tempId,
      conversationId: conversationId,
      senderId: userIdStr,
      senderName: user?.username || user?.email || "You",
      senderAvatar: user?.profilePicUrl,
      text: payload.text.trim(),
      type: payload.type || "text",
      timestamp: new Date().toISOString(),
      readBy: [userIdStr],
      status: "sending",
      attachments: payload.attachments || [],
      replyTo: payload.replyToId
        ? (() => {
            const repliedTo = messages.find((m) => m.id === payload.replyToId);
            return repliedTo ? {
              messageId: payload.replyToId,
              senderName: repliedTo.senderName || "User",
              text: repliedTo.text || "",
            } : undefined;
          })()
        : undefined,
    };

    // Optimistic update - add to end and sort
    setMessages((prev) => {
      const updated = [...prev, optimisticMessage];
      return updated.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });

    try {
      const socket = getSocket();
      console.log("[sendMessage] Socket status:", socket ? (socket.connected ? "connected" : "disconnected") : "null");
      
      if (socket?.connected) {
        console.log("[sendMessage] 📤 Sending message via WebSocket...");
        // Try WebSocket first
        const response = await sendMessageViaSocket(socket, {
          conversationId,
          body: payload.text.trim(),
          type: payload.type || "text",
          attachments: payload.attachments || [],
          tempId,
        });

        console.log("[sendMessage] WebSocket response:", response);

        if (response.ok && response.messageId) {
          console.log("[sendMessage] ✅ Message sent via WebSocket, messageId:", response.messageId);
          // Replace optimistic message with real one
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...optimisticMessage,
                    id: response.messageId!,
                    status: "delivered" as Message["status"],
                  }
                : msg
            )
          );
        } else {
          console.error("[sendMessage] ❌ WebSocket send failed:", response.error);
          throw new Error(response.error || "Failed to send message");
        }
      } else {
        console.log("[sendMessage] 📤 WebSocket not connected, using REST API fallback...");
        // Fallback to HTTP API
        const response = await messagesApi.sendMessage(conversationId, {
          text: payload.text.trim(),
          type: payload.type || "text",
          replyToId: payload.replyToId,
          attachments: payload.attachments || [],
        });

        console.log("[sendMessage] ✅ Message sent via REST API, messageId:", response.message.id);

        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...response.message, status: "delivered" as Message["status"] }
              : msg
          )
        );
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      // Update failed message status instead of removing
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, status: "failed" as Message["status"] }
            : msg
        )
      );
      setError(err.message || "Failed to send message");
      
      // Show toast notification
      try {
        const { toast } = await import("sonner");
        toast.error(err.message || "Failed to send message. Please try again.");
      } catch {
        // Sonner might not be available
      }
    }
  }, [conversationId, user, messages]);

  const markAsRead = useCallback(async () => {
    if (!conversationId || !user?._id) return;
    
    try {
      const userIdStr = user._id?.toString() || user._id;
      const convIdStr = conversationId?.toString() || conversationId;
      
      // Get unread message IDs (normalize for comparison)
      const unreadMessageIds = messages
        .filter(msg => {
          const msgConvId = msg.conversationId?.toString() || msg.conversationId;
          const msgSenderId = msg.senderId?.toString() || msg.senderId;
          const isRead = msg.readBy?.some((id: any) => 
            (id?.toString() || id) === userIdStr
          ) || false;
          
          return msgConvId === convIdStr && 
                 msgSenderId !== userIdStr && 
                 !isRead;
        })
        .map(msg => msg.id?.toString() || msg.id);
      
      if (unreadMessageIds.length === 0) return;
      
      const socket = getSocket();
      if (socket?.connected) {
        // Use WebSocket to mark as read
        await markMessagesRead(socket, { conversationId: convIdStr, messageIds: unreadMessageIds });
      } else {
        // Fallback to HTTP API
        await messagesApi.markAsRead(convIdStr);
      }
      
      // Optimistically update local messages to mark as read
      setMessages((prev) =>
        prev.map((msg) => {
          const msgId = msg.id?.toString() || msg.id;
          const msgSenderId = msg.senderId?.toString() || msg.senderId;
          
          if (unreadMessageIds.includes(msgId) && msgSenderId !== userIdStr) {
            const currentReadBy = msg.readBy || [];
            const alreadyRead = currentReadBy.some((id: any) => 
              (id?.toString() || id) === userIdStr
            );
            
            if (!alreadyRead) {
              return {
                ...msg,
                readBy: [...currentReadBy, userIdStr],
                status: "read" as Message["status"],
              };
            }
          }
          return msg;
        })
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [conversationId, user?._id, messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
    typingUsers: Array.from(typingUsers),
  };
}

