import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "@/services/websocket/ws-client";
import { sendTyping } from "@/services/websocket/ws-events";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (text: string) => void;
  onAttachment?: () => void;
  placeholder?: string;
  disabled?: boolean;
  conversationId?: string | null;
}

export default function MessageInput({
  onSend,
  onAttachment,
  placeholder = "Type a message...",
  disabled = false,
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      // Clear typing indicator
      if (conversationId) {
        const socket = getSocket();
        if (socket?.connected && isTypingRef.current) {
          isTypingRef.current = false;
          sendTyping(socket, conversationId, false);
        }
      }
      
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle typing indicators - improved continuous typing detection
  useEffect(() => {
    if (!conversationId) return;
    
    const socket = getSocket();
    if (!socket?.connected) return;

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // If user is typing (message has content)
    if (message.trim()) {
      // Send typing indicator only if we haven't already sent it
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        sendTyping(socket, conversationId, true);
        console.log("[MessageInput] 📝 Started typing indicator");
      }
      
      // Reset the timeout - user is still typing
      typingTimeoutRef.current = setTimeout(() => {
        // User stopped typing (no input for 3 seconds)
        if (isTypingRef.current && socket?.connected) {
          isTypingRef.current = false;
          sendTyping(socket, conversationId, false);
          console.log("[MessageInput] ⏸️ Stopped typing indicator (3s timeout)");
        }
        typingTimeoutRef.current = null;
      }, 3000);
    } else {
      // Message is empty - stop typing immediately
      if (isTypingRef.current && socket?.connected) {
        isTypingRef.current = false;
        sendTyping(socket, conversationId, false);
        console.log("[MessageInput] ⏸️ Stopped typing indicator (message cleared)");
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      // Clear typing on unmount
      if (isTypingRef.current && socket?.connected) {
        sendTyping(socket, conversationId, false);
        isTypingRef.current = false;
      }
    };
  }, [message, conversationId]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  return (
    <div className="border-t border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30 bg-white/95 dark:bg-pulse-white/95 backdrop-blur-sm dark:backdrop-blur-sm p-4 shadow-lg shadow-black/5 dark:shadow-black/20">
      <div className="flex items-end gap-2.5">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 flex-shrink-0 rounded-xl hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 transition-all duration-200"
          onClick={onAttachment}
          disabled={disabled}
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5 text-pulse-grey-text dark:text-pulse-grey-text" />
        </Button>

        {/* Input Area */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[48px] max-h-[120px] resize-none pr-12 py-3.5 text-sm bg-pulse-grey-light/50 dark:bg-pulse-grey-light/30 border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30 text-pulse-black dark:text-pulse-black placeholder:text-pulse-grey-text dark:placeholder:text-pulse-grey-text rounded-2xl focus:ring-2 focus:ring-pulse-cyan/20 focus:border-pulse-cyan/50 transition-all duration-200 shadow-sm"
            rows={1}
          />
          <AnimatePresence>
            {isFocused && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 bottom-3.5 p-1.5 rounded-lg hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 transition-all duration-200"
                aria-label="Emoji picker"
              >
                <Smile className="w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            "h-11 w-11 flex-shrink-0 rounded-xl p-0 transition-all duration-200 shadow-lg",
            message.trim() && !disabled
              ? "bg-gradient-to-br from-pulse-cyan to-pulse-cyan/90 hover:from-pulse-cyan/90 hover:to-pulse-cyan/80 text-white shadow-pulse-cyan/30 hover:shadow-pulse-cyan/40 hover:scale-105"
              : "bg-pulse-grey-subtle dark:bg-pulse-grey-subtle text-pulse-grey-text dark:text-pulse-grey-text opacity-50 cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          {message.trim() ? (
            <Send className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-pulse-grey-text/70 dark:text-pulse-grey-text/70 mt-2.5 px-3">
        Press <kbd className="px-1.5 py-0.5 bg-pulse-grey-light dark:bg-pulse-grey-light rounded text-[10px] font-medium">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-pulse-grey-light dark:bg-pulse-grey-light rounded text-[10px] font-medium">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

