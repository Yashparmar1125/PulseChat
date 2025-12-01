import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, MoreVertical, X, Download, Play, Image as ImageIcon, File, Video, Music } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "@/types/messages";
import { cn } from "@/lib/utils";
import { normalizeFileUrl } from "@/utils/fileUtils";

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
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const handleAttachmentClick = (attachment: Message["attachments"][0]) => {
    if (attachment.type === "image" || attachment.type === "video") {
      // Open image/video in viewer
      setViewingImage(normalizeFileUrl(attachment.url));
    } else {
      // For files, normalize URL and open in new tab
      const fileUrl = normalizeFileUrl(attachment.url);
      window.open(fileUrl, "_blank");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "audio":
        return Music;
      default:
        return File;
    }
  };

  const getStatusIcon = () => {
    if (!isCurrentUser) return null;
    
    switch (message.status) {
      case "sending":
        return <div className="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />;
      case "sent":
        return <Check className="w-3.5 h-3.5 text-white/70" />;
      case "delivered":
        return <CheckCheck className="w-3.5 h-3.5 text-white/70" />;
      case "read":
        return <CheckCheck className="w-3.5 h-3.5 text-white" style={{ color: 'hsl(var(--pulse-cyan))' }} />;
      case "failed":
        return <span className="text-xs text-red-400">!</span>;
      default:
        return <Check className="w-3.5 h-3.5 text-white/70" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "flex gap-2.5 py-1.5 group transition-colors w-full",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-1",
          isCurrentUser ? "items-end max-w-[85%] sm:max-w-[75%]" : "items-start max-w-[85%] sm:max-w-[75%]"
        )}
      >

        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 relative shadow-sm transition-all duration-200 w-full",
            isCurrentUser
              ? "bg-gradient-to-br from-pulse-cyan to-pulse-cyan/90 text-white rounded-br-md shadow-lg shadow-pulse-cyan/20"
              : "bg-white dark:bg-pulse-grey-light text-pulse-black dark:text-pulse-black border border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30 rounded-bl-md shadow-md dark:shadow-black/20"
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
            <p className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap break-words",
              isCurrentUser ? "text-white" : "text-pulse-black dark:text-pulse-black"
            )}>
              {message.text}
            </p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => {
                const AttachmentIcon = getAttachmentIcon(attachment.type);
                const isImage = attachment.type === "image";
                const isVideo = attachment.type === "video";
                const isAudio = attachment.type === "audio";
                
                return (
                  <div
                    key={attachment.id}
                    onClick={() => handleAttachmentClick(attachment)}
                    className={cn(
                      "rounded-lg overflow-hidden transition-all duration-200",
                      isImage || isVideo || isAudio
                        ? "cursor-pointer hover:opacity-90 active:scale-[0.98]"
                        : "cursor-pointer hover:bg-pulse-grey-subtle/50 dark:hover:bg-pulse-grey-subtle/30",
                      isImage || isVideo
                        ? "bg-pulse-grey-light dark:bg-pulse-grey-light"
                        : "bg-pulse-grey-light dark:bg-pulse-grey-light"
                    )}
                  >
                    {isImage && attachment.url ? (
                      <div className="relative group">
                        <img
                          src={normalizeFileUrl(attachment.thumbnailUrl || attachment.url)}
                          alt={attachment.name}
                          className="max-w-full h-auto w-full object-cover max-h-[400px]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : isVideo && attachment.url ? (
                      <div className="relative">
                        <video
                          src={normalizeFileUrl(attachment.url)}
                          className="max-w-full h-auto w-full"
                          controls={false}
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-80" />
                        </div>
                      </div>
                    ) : isAudio && attachment.url ? (
                      <div className="p-3 flex items-center gap-3">
                        <div className="w-12 h-12 bg-pulse-cyan/10 dark:bg-pulse-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Music className="w-6 h-6 text-pulse-cyan" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-pulse-black dark:text-pulse-black">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                        <audio
                          src={normalizeFileUrl(attachment.url)}
                          controls
                          className="h-8"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <div className="p-3 flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-pulse-cyan/10 dark:bg-pulse-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AttachmentIcon className="w-6 h-6 text-pulse-cyan" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-pulse-black dark:text-pulse-black">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                        <Download className="w-5 h-5 text-pulse-grey-text dark:text-pulse-grey-text opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                );
              })}
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
                  "text-[10px] font-medium",
                  isCurrentUser ? "text-white/80" : "text-pulse-grey-text dark:text-pulse-grey-text"
                )}
              >
                {format(new Date(message.timestamp), "h:mm a")}
              </span>
            )}
            {isCurrentUser && (
              <span className="ml-1">
                {getStatusIcon()}
              </span>
            )}
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

      {/* Actions Menu (on hover) - only for current user messages */}
      {isCurrentUser && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start pt-1.5 flex-shrink-0 ml-1">
          <button
            className="p-1.5 rounded-lg hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 text-pulse-grey-text dark:text-pulse-grey-text hover:text-pulse-black dark:hover:text-pulse-black transition-all duration-200"
            aria-label="Message options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Spacer for received messages to balance layout */}
      {!isCurrentUser && (
        <div className="flex-shrink-0 w-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1.5 rounded-lg hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 text-pulse-grey-text dark:text-pulse-grey-text hover:text-pulse-black dark:hover:text-pulse-black transition-all duration-200"
            aria-label="Message options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image/Video Viewer Modal */}
      <AnimatePresence>
        {viewingImage && (
          <div
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setViewingImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewingImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {(() => {
                const attachment = message.attachments?.find(a => a.url === viewingImage);
                const mediaUrl = normalizeFileUrl(viewingImage);
                
                return attachment?.type === "video" ? (
                  <video
                    src={mediaUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-full rounded-lg"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Attachment"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

