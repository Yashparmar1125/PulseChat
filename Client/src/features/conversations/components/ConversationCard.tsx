import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pin, CheckCheck, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/types/conversations";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onPin?: (conversationId: string, pinned: boolean) => void;
}

export default function ConversationCard({
  conversation,
  isSelected,
  onClick,
  onPin,
}: ConversationCardProps) {
  const [isPinning, setIsPinning] = useState(false);

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (!onPin || isPinning) return;
    
    setIsPinning(true);
    try {
      await onPin(conversation.id, !conversation.isPinned);
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    } finally {
      setIsPinning(false);
    }
  };
  const getInitials = (name: string) => {
    if (!name || name === 'Unknown' || name === 'Unnamed Conversation') {
      return 'U';
    }
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(conversation.name);

  return (
    <motion.div
      whileHover={{ backgroundColor: "hsl(var(--pulse-grey-light))" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-3.5 cursor-pointer transition-all duration-200 border-l-4 relative group",
        isSelected 
          ? "bg-pulse-grey-light dark:bg-pulse-grey-light border-l-pulse-cyan shadow-sm" 
          : "hover:bg-pulse-grey-light/60 dark:hover:bg-pulse-grey-light/60 border-l-transparent hover:border-l-pulse-cyan/30"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-12 h-12 ring-2 ring-pulse-grey-light dark:ring-pulse-grey-light">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className="bg-gradient-to-br from-pulse-cyan/20 to-pulse-cyan/10 text-pulse-cyan font-semibold border border-pulse-cyan/20">
              {initials}
            </AvatarFallback>
          </Avatar>
          {conversation.participants.some((p) => p.isOnline) && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-pulse-white shadow-sm animate-pulse"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-semibold text-pulse-black dark:text-pulse-black truncate text-sm">
                {conversation.name}
              </h3>
              {conversation.isPinned && (
                <Pin className="w-3.5 h-3.5 text-pulse-cyan flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {conversation.lastMessage && (
              <span className="text-xs font-medium text-pulse-grey-text dark:text-pulse-grey-text whitespace-nowrap">
                {(() => {
                  const date = new Date(conversation.lastMessage.timestamp);
                  const now = new Date();
                  const diffMs = now.getTime() - date.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                  if (diffMins < 1) return "now";
                  if (diffMins < 60) return `${diffMins}m`;
                  if (diffHours < 24) return `${diffHours}h`;
                  if (diffDays < 7) return `${diffDays}d`;
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                })()}
              </span>
            )}
            {/* Pin/More Menu Button */}
            {onPin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handlePinToggle}
                    disabled={isPinning}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Pin className={cn(
                      "w-4 h-4",
                      conversation.isPinned ? "text-pulse-cyan" : "text-pulse-grey-text"
                    )} />
                    <span>{conversation.isPinned ? "Unpin Conversation" : "Pin Conversation"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {conversation.typingUsers && conversation.typingUsers.length > 0 ? (
              <p className="text-sm text-pulse-cyan italic truncate flex-1 font-medium flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-pulse-cyan rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1 h-1 bg-pulse-cyan rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1 h-1 bg-pulse-cyan rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
                {(() => {
                  const typingParticipantNames = conversation.typingUsers
                    .map(userId => {
                      const participant = conversation.participants.find(p => 
                        (p.id?.toString() || p.id) === (userId?.toString() || userId)
                      );
                      return participant?.name || "Someone";
                    })
                    .filter(Boolean);
                  
                  if (typingParticipantNames.length === 1) {
                    return `${typingParticipantNames[0]} is typing...`;
                  } else if (typingParticipantNames.length === 2) {
                    return `${typingParticipantNames[0]} and ${typingParticipantNames[1]} are typing...`;
                  } else if (typingParticipantNames.length > 2) {
                    return `${typingParticipantNames[0]} and ${typingParticipantNames.length - 1} others are typing...`;
                  }
                  return "typing...";
                })()}
              </p>
            ) : conversation.lastMessage ? (
              <p className="text-sm text-pulse-black/80 dark:text-pulse-black/90 truncate flex-1 font-medium">
                {(() => {
                  // Check if message is from current user (need to get current user ID from context)
                  const isFromCurrentUser = conversation.lastMessage.senderName === "You" || 
                                           conversation.lastMessage.senderId === "current-user";
                  
                  if (isFromCurrentUser) {
                    return (
                      <span className="flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-pulse-cyan flex-shrink-0" />
                        <span className="truncate">{conversation.lastMessage.text}</span>
                      </span>
                    );
                  }
                  
                  // Don't show sender name if it's "Unknown" or empty
                  if (conversation.lastMessage.senderName && 
                      conversation.lastMessage.senderName !== "Unknown" && 
                      conversation.lastMessage.senderName.trim() !== "") {
                    return (
                      <span className="truncate">
                        <span className="font-semibold">{conversation.lastMessage.senderName}:</span> {conversation.lastMessage.text}
                      </span>
                    );
                  }
                  
                  return <span className="truncate">{conversation.lastMessage.text}</span>;
                })()}
              </p>
            ) : (
              <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text italic">No messages yet</p>
            )}

            {conversation.unreadCount > 0 && (
              <Badge className="bg-gradient-to-br from-pulse-cyan to-pulse-cyan/90 text-white flex-shrink-0 min-w-[22px] h-6 px-2 justify-center text-xs font-bold rounded-full shadow-md shadow-pulse-cyan/30">
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

