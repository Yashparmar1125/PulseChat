import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pin, CheckCheck } from "lucide-react";
import type { Conversation } from "@/types/conversations";
import { formatDistanceToNow } from "date-fns";

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export default function ConversationCard({
  conversation,
  isSelected,
  onClick,
}: ConversationCardProps) {
  const initials = conversation.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      whileHover={{ backgroundColor: "hsl(var(--pulse-grey-light))" }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 cursor-pointer transition-colors ${
        isSelected ? "bg-pulse-grey-light dark:bg-pulse-grey-light" : "hover:bg-pulse-grey-light/50 dark:hover:bg-pulse-grey-light/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-12 h-12">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className="bg-pulse-cyan text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {conversation.participants.some((p) => p.isOnline) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-pulse-white"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-medium text-pulse-black dark:text-pulse-black truncate text-sm">
                {conversation.name}
              </h3>
              {conversation.isPinned && (
                <Pin className="w-3 h-3 text-pulse-grey-text dark:text-pulse-grey-text flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {conversation.lastMessage && (
              <span className="text-xs text-pulse-grey-text dark:text-pulse-grey-text whitespace-nowrap">
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
              {conversation.isPinned && (
                <Pin className="w-3 h-3 text-pulse-grey-text dark:text-pulse-grey-text" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {conversation.lastMessage ? (
              <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80 truncate flex-1">
                {conversation.lastMessage.senderId === "current-user" ? (
                  <span className="flex items-center gap-1">
                    <CheckCheck className="w-3 h-3 text-pulse-cyan" />
                    {conversation.lastMessage.text}
                  </span>
                ) : (
                  <span>
                    {conversation.lastMessage.senderName}:{" "}
                    {conversation.lastMessage.text}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text italic">No messages yet</p>
            )}

            {conversation.unreadCount > 0 && (
              <Badge className="bg-pulse-cyan text-white flex-shrink-0 min-w-[20px] h-5 px-1.5 justify-center text-xs font-semibold rounded-full">
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

