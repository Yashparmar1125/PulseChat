import { useState, useRef } from "react";
import { X, Image, File, Video, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MessageAttachment } from "@/types/messages";

interface AttachmentPickerProps {
  attachments: PendingAttachment[];
  onRemove: (index: number) => void;
  onClear: () => void;
}

export interface PendingAttachment {
  file: File;
  preview?: string;
  uploadProgress?: number;
  isUploading?: boolean;
  uploadedAttachment?: Omit<MessageAttachment, "id">;
  error?: string;
}

export default function AttachmentPicker({
  attachments,
  onRemove,
  onClear,
}: AttachmentPickerProps) {
  if (attachments.length === 0) return null;

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType.startsWith("video/")) return Video;
    if (mimeType.startsWith("audio/")) return Music;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="px-4 pb-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-pulse-grey-text dark:text-pulse-grey-text">
          {attachments.length} {attachments.length === 1 ? "attachment" : "attachments"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 px-2 text-xs text-pulse-grey-text hover:text-pulse-black dark:hover:text-pulse-black"
        >
          Clear all
        </Button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {attachments.map((attachment, index) => {
          const Icon = getFileIcon(attachment.file.type);
          const isImage = attachment.file.type.startsWith("image/");
          const isVideo = attachment.file.type.startsWith("video/");
          
          return (
            <div
              key={index}
              className={cn(
                "relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2",
                attachment.error
                  ? "border-red-300 dark:border-red-700"
                  : "border-pulse-grey-subtle dark:border-pulse-grey-subtle"
              )}
            >
              {/* Preview or Icon */}
              {isImage && attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="w-full h-full object-cover"
                />
              ) : isVideo && attachment.preview ? (
                <video
                  src={attachment.preview}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <div className="w-full h-full bg-pulse-grey-light dark:bg-pulse-grey-light flex items-center justify-center">
                  <Icon className="w-8 h-8 text-pulse-grey-text dark:text-pulse-grey-text" />
                </div>
              )}

              {/* Upload Progress Overlay */}
              {attachment.isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-white mx-auto mb-1" />
                    {attachment.uploadProgress !== undefined && (
                      <span className="text-xs text-white">
                        {attachment.uploadProgress}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Error Overlay */}
              {attachment.error && (
                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                  <span className="text-xs text-white text-center px-1">
                    {attachment.error}
                  </span>
                </div>
              )}

              {/* Remove Button */}
              {!attachment.isUploading && (
                <button
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Remove attachment"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}

              {/* File Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                <p className="text-[10px] text-white truncate font-medium">
                  {attachment.file.name}
                </p>
                <p className="text-[9px] text-white/80">
                  {formatFileSize(attachment.file.size)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




