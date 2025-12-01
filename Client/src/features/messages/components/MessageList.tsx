import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { Message } from "@/types/messages";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  typingUsers?: string[];
}

export default function MessageList({
  messages,
  currentUserId,
  isLoading = false,
  typingUsers = [],
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track previous message count to only scroll on new messages
  const prevMessageCountRef = useRef(messages.length);
  const prevScrollHeightRef = useRef(0);

  useEffect(() => {
    // Only auto-scroll when new messages are added, not on typing updates
    if (scrollRef.current) {
      const currentMessageCount = messages.length;
      const currentScrollHeight = scrollRef.current.scrollHeight;
      
      // Only scroll if:
      // 1. New messages were added (count increased)
      // 2. OR scroll height changed significantly (new content)
      const hasNewMessages = currentMessageCount > prevMessageCountRef.current;
      const scrollHeightChanged = Math.abs(currentScrollHeight - prevScrollHeightRef.current) > 50;
      
      if (hasNewMessages || scrollHeightChanged) {
        // Use requestAnimationFrame for smooth scrolling
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        });
      }
      
      prevMessageCountRef.current = currentMessageCount;
      prevScrollHeightRef.current = currentScrollHeight;
    }
  }, [messages]); // Removed typingUsers from dependencies

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
    <div 
      className="flex-1 overflow-y-auto bg-gradient-to-b from-pulse-grey-light/40 via-pulse-grey-light/20 to-transparent dark:from-pulse-grey-light/15 dark:via-pulse-grey-light/8 relative" 
      ref={scrollRef}
    >
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--pulse-grey-text)) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="py-4 px-4 relative z-10">
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
        
        {/* Typing Indicator - Memoized to prevent re-renders */}
        <TypingIndicator userIds={typingUsers || []} />
      </div>
    </div>
  );
}

