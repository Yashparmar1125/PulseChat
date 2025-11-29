import { useState } from "react";
import { Search, Archive, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConversationCard from "./ConversationCard";
import type { Conversation } from "@/types/conversations";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation?: () => void;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-pulse-grey-subtle">
      {/* Header */}
      <div className="p-4 border-b border-pulse-grey-subtle">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pulse-black">Messages</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onCreateConversation}
              aria-label="New conversation"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Archived conversations"
            >
              <Archive className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-pulse-grey-light rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-pulse-grey-text" />
            </div>
            <p className="text-pulse-black/70 font-medium mb-1">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
            <p className="text-sm text-pulse-black/60">
              {searchQuery
                ? "Try a different search term"
                : "Start a new conversation to get started"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pulse-grey-subtle">
            {filteredConversations.map((conversation) => (
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

