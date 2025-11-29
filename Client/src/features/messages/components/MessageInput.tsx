import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageInputProps {
  onSend: (text: string) => void;
  onAttachment?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  onAttachment,
  placeholder = "Type a message...",
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
    <div className="border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle bg-white dark:bg-pulse-white p-4">
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0"
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
            className="min-h-[44px] max-h-[120px] resize-none pr-10 py-3 text-sm bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black placeholder:text-pulse-grey-text dark:placeholder:text-pulse-grey-text"
            rows={1}
          />
          <AnimatePresence>
            {isFocused && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-2 bottom-2 p-1.5 rounded hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-colors"
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
          className="h-10 w-10 flex-shrink-0 bg-pulse-cyan hover:bg-pulse-cyan/90 text-white rounded-lg p-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
      <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text mt-2 px-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}

