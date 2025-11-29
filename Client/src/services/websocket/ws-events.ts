// WebSocket event handlers

import { Socket } from "socket.io-client";
import type { Message } from "@/types/messages";

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface PresenceUpdate {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

// Join a conversation room
export function joinConversation(socket: Socket, conversationId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.emit("join", conversationId, (response: { ok: boolean; error?: string }) => {
      if (response.ok) {
        resolve();
      } else {
        reject(new Error(response.error || "Failed to join conversation"));
      }
    });
  });
}

// Leave a conversation room
export function leaveConversation(socket: Socket, conversationId: string) {
  socket.emit("leave", conversationId);
}

// Send typing indicator
export function sendTyping(socket: Socket, conversationId: string, isTyping: boolean) {
  socket.emit("typing", { conversationId, isTyping });
}

// Send message via WebSocket
export function sendMessageViaSocket(
  socket: Socket,
  payload: {
    conversationId: string;
    body: string;
    type?: string;
    attachments?: any[];
    tempId?: string;
  }
): Promise<{
  ok: boolean;
  messageId?: string;
  tempId?: string;
  error?: string;
}> {
  return new Promise((resolve, reject) => {
    socket.emit(
      "send_message",
      {
        conversationId: payload.conversationId,
        body: payload.body,
        type: payload.type || "text",
        attachments: payload.attachments || [],
        tempId: payload.tempId,
        clientTs: Date.now(),
      },
      (response: {
        ok: boolean;
        messageId?: string;
        tempId?: string;
        error?: string;
      }) => {
        if (response.ok) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to send message"));
        }
      }
    );
  });
}

// Mark messages as read
export function markMessagesRead(socket: Socket, data: { conversationId: string; messageIds?: string[] }): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.emit("mark_read", data, (response: { ok: boolean; error?: string }) => {
      if (response.ok) {
        resolve();
      } else {
        reject(new Error(response.error || "Failed to mark as read"));
      }
    });
  });
}

// Listen for new messages
export function onMessage(socket: Socket, callback: (message: Message) => void) {
  socket.on("message", (data: any) => {
    // Normalize the message format to match our Message interface
    const message: Message = {
      id: data.id || data._id || data.messageId || `msg-${Date.now()}`,
      conversationId: data.conversationId?.toString() || data.conversationId,
      senderId: data.senderId?.toString() || data.senderId,
      senderName: data.senderName || data.sender?.username || data.sender?.email || "Unknown",
      senderAvatar: data.senderAvatar || data.sender?.profilePicUrl,
      text: data.text || data.body || "",
      type: (data.type || "text") as Message["type"],
      timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
      readBy: Array.isArray(data.readBy) ? data.readBy.map((id: any) => id?.toString() || id) : [],
      attachments: data.attachments || [],
      status: "sent" as Message["status"],
      replyTo: data.replyTo ? {
        messageId: data.replyTo.messageId || data.replyTo._id?.toString() || data.replyTo,
        senderName: data.replyTo.senderName || "Unknown",
        text: data.replyTo.text || data.replyTo.body || "",
      } : undefined,
    };
    callback(message);
  });
}

// Listen for typing indicators
export function onTyping(socket: Socket, callback: (data: TypingIndicator) => void) {
  socket.on("typing", callback);
}

// Listen for presence updates
export function onPresence(socket: Socket, callback: (data: PresenceUpdate) => void) {
  socket.on("presence", callback);
}

// Remove all listeners
export function removeAllListeners(socket: Socket) {
  socket.removeAllListeners("message");
  socket.removeAllListeners("typing");
  socket.removeAllListeners("presence");
}
