import { MessageSquare, Phone, Video, Lock, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Message } from "@/types/messages";

interface StarredMessageDetailPanelProps {
  message: Message & { conversationName: string };
  onClose: () => void;
  onGoToConversation?: () => void;
}

export default function StarredMessageDetailPanel({
  message,
  onClose,
  onGoToConversation,
}: StarredMessageDetailPanelProps) {
  const initials = message.conversationName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col bg-white dark:bg-pulse-white"
    >
      {/* Header */}
      <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Message info</h2>
      </div>

      {/* Contact Info */}
      <div className="p-6 border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-pulse-black dark:text-pulse-black mb-1">
              {message.conversationName}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-pulse-cyan/10 dark:hover:bg-pulse-cyan/20">
                <MessageSquare className="w-5 h-5 text-pulse-cyan" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-pulse-cyan/10 dark:hover:bg-pulse-cyan/20">
                <Video className="w-5 h-5 text-pulse-cyan" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-pulse-cyan/10 dark:hover:bg-pulse-cyan/20">
                <Phone className="w-5 h-5 text-pulse-cyan" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-pulse-grey-text dark:text-pulse-grey-text uppercase mb-3">
              Starred Message
            </h3>
            <div className="bg-pulse-grey-light dark:bg-pulse-grey-light rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">
                    {message.senderName}
                  </span>
                  <span className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                    {format(new Date(message.timestamp), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <p className="text-sm text-pulse-black dark:text-pulse-black leading-relaxed mb-2">
                {message.text}
              </p>
              <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                {format(new Date(message.timestamp), "h:mm a")}
              </p>
            </div>
          </div>

          {onGoToConversation && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onGoToConversation}
                className="w-full bg-pulse-cyan hover:bg-pulse-cyan/90 text-white"
              >
                Go to Conversation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
          <Lock className="w-3 h-3" />
          <span>Your starred messages are end-to-end encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}

