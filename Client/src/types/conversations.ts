// Conversation types and interfaces

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: MessagePreview;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isGroup: boolean;
  participants: Participant[];
  updatedAt: string;
  createdAt: string;
  typingUsers?: string[]; // User IDs who are currently typing
}

export interface MessagePreview {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type: "text" | "image" | "file" | "system";
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ConversationFilters {
  search?: string;
  isArchived?: boolean;
  isGroup?: boolean;
}

