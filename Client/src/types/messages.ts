// Message types and interfaces

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text?: string;
  type: MessageType;
  timestamp: string;
  editedAt?: string;
  readBy: string[]; // User IDs who have read the message
  reactions?: MessageReaction[];
  replyTo?: MessageReply;
  attachments?: MessageAttachment[];
  status: MessageStatus;
}

export type MessageType = "text" | "image" | "file" | "audio" | "video" | "system";
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface MessageReply {
  messageId: string;
  senderName: string;
  text: string;
}

export interface MessageAttachment {
  id: string;
  type: "image" | "file" | "audio" | "video";
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  text?: string;
  type: MessageType;
  replyToId?: string;
  attachments?: Omit<MessageAttachment, "id">[];
}

