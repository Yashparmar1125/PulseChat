import ConversationCard from "@/features/conversations/components/ConversationCard";
import type { Conversation } from "@/types/conversations";

// Mock archived conversations
const mockArchivedConversations: Conversation[] = [
  {
    id: "archived-1",
    name: "Old Project",
    lastMessage: {
      id: "m1",
      text: "Thanks for the update!",
      senderId: "user1",
      senderName: "John",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      type: "text",
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: true,
    isGroup: false,
    participants: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "archived-2",
    name: "Completed Task",
    lastMessage: {
      id: "m2",
      text: "Task completed successfully",
      senderId: "user2",
      senderName: "Sarah",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      type: "text",
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: true,
    isGroup: false,
    participants: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
];

interface ArchivedSectionProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

export default function ArchivedSection({
  selectedConversationId,
  onSelectConversation,
}: ArchivedSectionProps) {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-pulse-white">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Archived</h2>
        <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80 mt-1">
          {mockArchivedConversations.length} archived conversation
          {mockArchivedConversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Archived Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {mockArchivedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-32 h-32 mb-4 opacity-60 dark:opacity-50">
              <img 
                src="/assets/svg/arhive.svg" 
                alt="No archived chats" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-pulse-black/70 dark:text-pulse-black/80 font-medium mb-1">
              No archived conversations
            </p>
            <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70">
              Long press on a conversation to archive it
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pulse-grey-subtle dark:divide-pulse-grey-subtle">
            {mockArchivedConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
