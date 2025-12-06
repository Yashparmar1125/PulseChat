import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "@/services/websocket/ws-client";
import { sendTyping } from "@/services/websocket/ws-events";
import { cn } from "@/lib/utils";
import AttachmentPicker, { type PendingAttachment } from "./AttachmentPicker";
import AttachmentMenu, { type AttachmentOption } from "./AttachmentMenu";
import ContactShareModal from "./modals/ContactShareModal";
import PollModal from "./modals/PollModal";
import EventModal from "./modals/EventModal";
import StickerPickerModal from "./modals/StickerPickerModal";
import { mediaApi } from "@/features/media/api";
import type { MessageAttachment } from "@/types/messages";
import type { Participant } from "@/types/conversations";

interface MessageInputProps {
  onSend: (text: string, attachments?: Omit<MessageAttachment, "id">[]) => void;
  placeholder?: string;
  disabled?: boolean;
  conversationId?: string | null;
}

export default function MessageInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const handleSend = async () => {
    const hasText = message.trim().length > 0;
    const hasAttachments = attachments.length > 0 && 
      attachments.every(a => a.uploadedAttachment && !a.error && !a.isUploading);
    
    if ((hasText || hasAttachments) && !disabled && !isUploading) {
      // Clear typing indicator
      if (conversationId) {
        const socket = getSocket();
        if (socket?.connected && isTypingRef.current) {
          isTypingRef.current = false;
          sendTyping(socket, conversationId, false);
        }
      }
      
      // Get uploaded attachments
      const uploadedAttachments = attachments
        .filter(a => a.uploadedAttachment)
        .map(a => a.uploadedAttachment!);
      
      // Determine message type based on attachments
      let messageType: "text" | "image" | "file" | "audio" | "video" = "text";
      if (uploadedAttachments.length > 0) {
        const firstAttachment = uploadedAttachments[0];
        if (firstAttachment.type === "image") messageType = "image";
        else if (firstAttachment.type === "video") messageType = "video";
        else if (firstAttachment.type === "audio") messageType = "audio";
        else messageType = "file";
      }
      
      onSend(message.trim() || undefined, uploadedAttachments.length > 0 ? uploadedAttachments : undefined);
      
      // Clear state
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create preview attachments
    const newAttachments: PendingAttachment[] = await Promise.all(
      files.map(async (file) => {
        let preview: string | undefined;
        
        // Create preview for images and videos
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          preview = URL.createObjectURL(file);
        }

        return {
          file,
          preview,
          isUploading: false,
        };
      })
    );

    setAttachments((prev) => [...prev, ...newAttachments]);

    // Upload files
    uploadAttachments(newAttachments, attachments.length);
  };

  const uploadAttachments = async (
    attachmentsToUpload: PendingAttachment[],
    startIndex: number
  ) => {
    setIsUploading(true);

    const uploadPromises = attachmentsToUpload.map(async (attachment, index) => {
      const actualIndex = startIndex + index;
      
      // Update to uploading state
      setAttachments((prev) => {
        const updated = [...prev];
        updated[actualIndex] = { ...updated[actualIndex], isUploading: true, uploadProgress: 0 };
        return updated;
      });

      try {
        // Upload file
        const response = await mediaApi.uploadFile(attachment.file);

        // Determine attachment type
        let attachmentType: "image" | "file" | "audio" | "video" = "file";
        if (attachment.file.type.startsWith("image/")) attachmentType = "image";
        else if (attachment.file.type.startsWith("video/")) attachmentType = "video";
        else if (attachment.file.type.startsWith("audio/")) attachmentType = "audio";

        // Create attachment object
        const uploadedAttachment: Omit<MessageAttachment, "id"> = {
          type: attachmentType,
          url: response.url,
          name: response.originalName,
          size: response.size,
          mimeType: response.mimeType,
        };

        // Update with uploaded attachment
        setAttachments((prev) => {
          const updated = [...prev];
          updated[actualIndex] = {
            ...updated[actualIndex],
            isUploading: false,
            uploadProgress: 100,
            uploadedAttachment,
          };
          return updated;
        });
      } catch (error: any) {
        console.error("Error uploading file:", error);
        setAttachments((prev) => {
          const updated = [...prev];
          updated[actualIndex] = {
            ...updated[actualIndex],
            isUploading: false,
            error: error.message || "Upload failed",
          };
          return updated;
        });
      }
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => {
      const attachment = prev[index];
      // Revoke object URL if it exists
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAttachments = () => {
    // Revoke all object URLs
    attachments.forEach((attachment) => {
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
    });
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleAttachmentOption = (option: AttachmentOption) => {
    switch (option) {
      case "document":
        documentInputRef.current?.click();
        break;
      case "photos":
        imageInputRef.current?.click();
        break;
      case "camera":
        // For camera, we'll use the video input with capture attribute
        const cameraInput = document.createElement("input");
        cameraInput.type = "file";
        cameraInput.accept = "image/*";
        cameraInput.capture = "environment";
        cameraInput.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          if (target.files && target.files.length > 0) {
            handleFileSelect({ target } as any);
          }
        };
        cameraInput.click();
        break;
      case "audio":
        audioInputRef.current?.click();
        break;
      case "contact":
        setShowContactModal(true);
        break;
      case "poll":
        setShowPollModal(true);
        break;
      case "event":
        setShowEventModal(true);
        break;
      case "sticker":
        setShowStickerModal(true);
        break;
    }
  };

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[aria-label="Attach file"]')
      ) {
        setShowAttachmentMenu(false);
      }
    };

    if (showAttachmentMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showAttachmentMenu]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, []);

  return (
    <div className="border-t border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30 bg-white/95 dark:bg-pulse-white/95 backdrop-blur-sm dark:backdrop-blur-sm p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-lg shadow-black/5 dark:shadow-black/20 relative z-10">
      <div className="flex items-end gap-2.5">
        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*"
        />
        <input
          ref={videoInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="video/*"
        />
        <input
          ref={audioInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="audio/*"
        />
        <input
          ref={documentInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z"
        />

        {/* Attachment Button with Menu */}
        <div className="relative" ref={attachmentMenuRef}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-11 w-11 flex-shrink-0 rounded-xl transition-all duration-200",
              showAttachmentMenu
                ? "bg-pulse-cyan/10 dark:bg-pulse-cyan/10"
                : "hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80"
            )}
            onClick={handleAttachmentClick}
            disabled={disabled || isUploading}
            aria-label="Attach file"
          >
            <Paperclip
              className={cn(
                "w-5 h-5 transition-colors",
                showAttachmentMenu
                  ? "text-pulse-cyan"
                  : "text-pulse-grey-text dark:text-pulse-grey-text"
              )}
            />
          </Button>

          {/* Attachment Menu */}
          <AnimatePresence>
            {showAttachmentMenu && (
              <AttachmentMenu
                onSelect={handleAttachmentOption}
                onClose={() => setShowAttachmentMenu(false)}
              />
            )}
          </AnimatePresence>
        </div>

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
          disabled={
            (!message.trim() && 
             !(attachments.length > 0 && attachments.every(a => a.uploadedAttachment && !a.error && !a.isUploading))) ||
            disabled ||
            isUploading
          }
          className={cn(
            "h-11 w-11 flex-shrink-0 rounded-xl p-0 transition-all duration-200 shadow-lg",
            (message.trim() || (attachments.length > 0 && attachments.every(a => a.uploadedAttachment && !a.error && !a.isUploading))) && !disabled && !isUploading
              ? "bg-gradient-to-br from-pulse-cyan to-pulse-cyan/90 hover:from-pulse-cyan/90 hover:to-pulse-cyan/80 text-white shadow-pulse-cyan/30 hover:shadow-pulse-cyan/40 hover:scale-105"
              : "bg-pulse-grey-subtle dark:bg-pulse-grey-subtle text-pulse-grey-text dark:text-pulse-grey-text opacity-50 cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          {message.trim() || attachments.length > 0 ? (
            <Send className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Attachment Picker */}
      <AttachmentPicker
        attachments={attachments}
        onRemove={handleRemoveAttachment}
        onClear={handleClearAttachments}
      />

      {/* Helper Text */}
      <p className="text-xs text-pulse-grey-text/70 dark:text-pulse-grey-text/70 mt-2.5 px-3">
        Press <kbd className="px-1.5 py-0.5 bg-pulse-grey-light dark:bg-pulse-grey-light rounded text-[10px] font-medium">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-pulse-grey-light dark:bg-pulse-grey-light rounded text-[10px] font-medium">Shift+Enter</kbd> for new line
      </p>

      {/* Modals */}
      <ContactShareModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSelectContact={(contact: Participant) => {
          // Send contact as a message
          const contactText = `📇 Contact: ${contact.name}\n📧 ${contact.email}`;
          onSend(contactText);
        }}
      />

      <PollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
        onCreatePoll={(question, options) => {
          // Format poll as a message
          const pollText = `📊 Poll: ${question}\n\n${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}`;
          onSend(pollText);
        }}
      />

      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onCreateEvent={(event) => {
          // Format event as a message
          const eventText = `📅 Event: ${event.title}${event.description ? `\n${event.description}` : ""}\n📆 ${new Date(`${event.date}T${event.time}`).toLocaleString()}${event.location ? `\n📍 ${event.location}` : ""}`;
          onSend(eventText);
        }}
      />

      <StickerPickerModal
        isOpen={showStickerModal}
        onClose={() => setShowStickerModal(false)}
        onSelectSticker={(sticker) => {
          // Send sticker as text (emoji)
          onSend(sticker);
        }}
      />
    </div>
  );
}

