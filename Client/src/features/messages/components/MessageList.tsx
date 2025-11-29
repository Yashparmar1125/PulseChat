import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import type { Message } from "@/types/messages";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  isLoading = false,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pulse-cyan border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-pulse-grey-light dark:bg-pulse-grey-light rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-pulse-black dark:text-pulse-black mb-2">
            No messages yet
          </h3>
          <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
            Start the conversation by sending a message below
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" ref={scrollRef}>
      <div className="py-4">
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const showAvatar =
            !prevMessage ||
            prevMessage.senderId !== message.senderId ||
            new Date(message.timestamp).getTime() -
              new Date(prevMessage.timestamp).getTime() >
              300000; // 5 minutes

          const showTimestamp =
            !prevMessage ||
            new Date(message.timestamp).getTime() -
              new Date(prevMessage.timestamp).getTime() >
              300000; // 5 minutes

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
              showAvatar={showAvatar}
              showTimestamp={showTimestamp}
            />
          );
        })}
      </div>
    </div>
  );
}

