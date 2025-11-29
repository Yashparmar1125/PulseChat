import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConversationCard from "@/features/conversations/components/ConversationCard";
import type { Conversation } from "@/types/conversations";
import { cn } from "@/lib/utils";

interface ChatListPanelProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation?: () => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function ChatListPanel({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  activeFilter = "all",
  onFilterChange,
}: ChatListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "favourites", label: "Favourites" },
    { id: "groups", label: "Groups" },
  ];

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    if (activeFilter === "unread") {
      return matchesSearch && conv.unreadCount > 0;
    }
    if (activeFilter === "groups") {
      return matchesSearch && conv.isGroup;
    }
    if (activeFilter === "favourites") {
      // For wireframing, assume pinned = favourites
      return matchesSearch && conv.isPinned;
    }
    return matchesSearch;
  });

  return (
    <div className="w-80 lg:w-96 flex flex-col bg-pulse-grey-light dark:bg-pulse-grey-light border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Chats</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onCreateConversation}
            aria-label="New chat"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text" />
          <Input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-pulse-grey-light dark:bg-pulse-grey-light border-0 dark:border-0 focus:bg-white dark:focus:bg-pulse-white text-pulse-black dark:text-pulse-black placeholder:text-pulse-grey-text dark:placeholder:text-pulse-grey-text"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange?.(filter.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeFilter === filter.id
                  ? "bg-pulse-cyan text-white"
                  : "bg-pulse-grey-subtle dark:bg-pulse-grey-subtle text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-subtle/80 dark:hover:bg-pulse-grey-subtle/80"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-pulse-white">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-32 h-32 mb-4 opacity-60 dark:opacity-50">
              <img 
                src="/assets/svg/chats.svg" 
                alt="No chats" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-pulse-black/70 dark:text-pulse-black/80 font-medium mb-1">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
            <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70">
              {searchQuery
                ? "Try a different search term"
                : "Start a new conversation to get started"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-pulse-grey-subtle dark:divide-pulse-grey-subtle">
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

