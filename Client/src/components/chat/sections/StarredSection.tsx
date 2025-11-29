import { Star, Lock } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "@/types/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarredMessageDetailPanel from "./StarredMessageDetailPanel";

// Mock starred messages
const mockStarredMessages: (Message & { conversationName: string })[] = [
  {
    id: "starred-1",
    conversationId: "1",
    conversationName: "Sarah Johnson",
    senderId: "user1",
    senderName: "Sarah Johnson",
    text: "This is an important message that I starred!",
    type: "text",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    readBy: [],
    status: "read",
  },
  {
    id: "starred-2",
    conversationId: "2",
    conversationName: "Design Team",
    senderId: "user2",
    senderName: "Alex",
    text: "Remember to review the design mockups",
    type: "text",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    readBy: [],
    status: "read",
  },
  {
    id: "starred-3",
    conversationId: "3",
    conversationName: "Mike Chen",
    senderId: "current-user",
    senderName: "You",
    text: "Meeting notes from today's discussion",
    type: "text",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    readBy: [],
    status: "read",
  },
];

export default function StarredSection() {
  const [selectedMessage, setSelectedMessage] = useState<(Message & { conversationName: string }) | null>(null);

  const handleMessageClick = (message: Message & { conversationName: string }) => {
    setSelectedMessage(message);
  };

  return (
    <div className="flex flex-1 h-full w-full">
      {/* Left Pane - Starred Messages List */}
      <div className="w-80 lg:w-96 flex flex-col bg-white dark:bg-pulse-white border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
          <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Starred Messages</h2>
          <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80 mt-1">
            {mockStarredMessages.length} starred message
            {mockStarredMessages.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Starred Messages List */}
        <div className="flex-1 overflow-y-auto">
          {mockStarredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-pulse-grey-light dark:bg-pulse-grey-light rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-pulse-grey-text dark:text-pulse-grey-text" />
              </div>
              <p className="text-pulse-black/70 dark:text-pulse-black/80 font-medium mb-1">
                No starred messages
              </p>
              <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70">
                Star messages to find them easily later
              </p>
            </div>
          ) : (
            <div className="divide-y divide-pulse-grey-subtle dark:divide-pulse-grey-subtle">
              {mockStarredMessages.map((message) => {
                const initials = message.conversationName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const isSelected = selectedMessage?.id === message.id;

                return (
                  <motion.div
                    key={message.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleMessageClick(message)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-pulse-cyan/10 dark:bg-pulse-cyan/20 border-l-4 border-pulse-cyan"
                        : "hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-pulse-black dark:text-pulse-black text-sm">
                            {message.conversationName}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-pulse-grey-text dark:text-pulse-grey-text whitespace-nowrap">
                              {format(new Date(message.timestamp), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80 line-clamp-2">
                          {message.text}
                        </p>
                        <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text mt-1">
                          {format(new Date(message.timestamp), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane - Message Detail or Info */}
      <AnimatePresence mode="wait">
        {selectedMessage ? (
          <StarredMessageDetailPanel
            key={selectedMessage.id}
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
          />
        ) : (
          <motion.div
            key="starred-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-pulse-white p-8"
          >
            <div className="max-w-md w-full text-center">
              {/* Large Icon */}
              <div className="w-48 h-48 mx-auto mb-6 rounded-full border-4 border-pulse-grey-subtle dark:border-pulse-grey-subtle flex items-center justify-center bg-pulse-grey-light dark:bg-pulse-grey-light">
                <div className="w-32 h-32 rounded-full border-2 border-pulse-grey-subtle dark:border-pulse-grey-subtle bg-white dark:bg-pulse-white flex items-center justify-center">
                  <Star className="w-16 h-16 text-yellow-500 fill-yellow-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-pulse-black dark:text-pulse-black mb-3">
                Starred Messages
              </h2>

              {/* Description */}
              <p className="text-pulse-black/70 dark:text-pulse-black/80 mb-8 leading-relaxed">
                Star important messages to find them quickly. Tap and hold on any message to star it.
              </p>

              {/* Footer */}
              <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                <Lock className="w-3 h-3" />
                <span>Your starred messages are end-to-end encrypted</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
