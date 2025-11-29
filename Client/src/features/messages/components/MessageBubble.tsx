import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "@/types/messages";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

export default function MessageBubble({
  message,
  isCurrentUser,
  showAvatar = true,
  showTimestamp = true,
}: MessageBubbleProps) {
  const initials = message.senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getStatusIcon = () => {
    if (!isCurrentUser) return null;
    
    switch (message.status) {
      case "sending":
        return <div className="w-3 h-3 border-2 border-pulse-grey-text border-t-transparent rounded-full animate-spin" />;
      case "sent":
        return <Check className="w-3 h-3 text-pulse-grey-text" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-pulse-grey-text" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-pulse-cyan" />;
      case "failed":
        return <span className="text-xs text-red-500">!</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3 px-4 py-2 group hover:bg-pulse-grey-light/30 dark:hover:bg-pulse-grey-light/30 transition-colors",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {showAvatar && !isCurrentUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle text-pulse-black dark:text-pulse-black text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[70%]",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {/* Sender Name (only for other users) */}
        {!isCurrentUser && showAvatar && (
          <span className="text-xs font-semibold text-pulse-black dark:text-pulse-black px-1">
            {message.senderName}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 relative",
            isCurrentUser
              ? "bg-pulse-cyan text-white rounded-br-sm shadow-md"
              : "bg-white dark:bg-pulse-white text-pulse-black dark:text-pulse-black border border-pulse-grey-subtle dark:border-pulse-grey-subtle rounded-bl-sm shadow-sm"
          )}
        >
          {/* Reply Preview */}
          {message.replyTo && (
            <div
              className={cn(
                "mb-2 pl-3 border-l-2 rounded text-xs py-1",
                isCurrentUser
                  ? "border-white/50 text-white/80"
                  : "border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black/60 dark:text-pulse-black/70"
              )}
            >
              <div className="font-semibold">{message.replyTo.senderName}</div>
              <div className="truncate">{message.replyTo.text}</div>
            </div>
          )}

          {/* Message Text */}
          {message.text && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.text}
            </p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="rounded-lg overflow-hidden bg-pulse-grey-light dark:bg-pulse-grey-light"
                >
                  {attachment.type === "image" && attachment.thumbnailUrl ? (
                    <img
                      src={attachment.thumbnailUrl}
                      alt={attachment.name}
                      className="max-w-full h-auto"
                    />
                  ) : (
                    <div className="p-3 flex items-center gap-2">
                      <div className="w-10 h-10 bg-pulse-cyan/10 rounded flex items-center justify-center">
                        <span className="text-xs">📎</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-pulse-grey-text">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message Footer */}
          <div
            className={cn(
              "flex items-center gap-1.5 mt-1.5",
              isCurrentUser ? "justify-end" : "justify-start"
            )}
          >
            {showTimestamp && (
              <span
                className={cn(
                  "text-[10px]",
                  isCurrentUser ? "text-white/70" : "text-pulse-grey-text dark:text-pulse-grey-text"
                )}
              >
                {format(new Date(message.timestamp), "h:mm a")}
              </span>
            )}
            {isCurrentUser && getStatusIcon()}
            {message.editedAt && (
              <span
                className={cn(
                  "text-[10px] italic",
                  isCurrentUser ? "text-white/70" : "text-pulse-grey-text dark:text-pulse-grey-text"
                )}
              >
                edited
              </span>
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1 px-1">
            {message.reactions.map((reaction, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-pulse-white border border-pulse-grey-subtle dark:border-pulse-grey-subtle rounded-full px-2 py-0.5 text-xs flex items-center gap-1"
              >
                <span>{reaction.emoji}</span>
                <span className="text-pulse-grey-text dark:text-pulse-grey-text">
                  {reaction.userIds.length}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions Menu (on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start pt-1">
        <button
          className="p-1 rounded hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light text-pulse-grey-text dark:text-pulse-grey-text hover:text-pulse-black dark:hover:text-pulse-black transition-colors"
          aria-label="Message options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

