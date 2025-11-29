import { X, Image, Video, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostStatus: (type: "text" | "image" | "video", content: string) => void;
}

export default function NewStatusModal({
  isOpen,
  onClose,
  onPostStatus,
}: NewStatusModalProps) {
  const [statusType, setStatusType] = useState<"text" | "image" | "video" | null>(null);
  const [textContent, setTextContent] = useState("");

  const handlePost = () => {
    if (statusType && (statusType === "text" ? textContent.trim() : true)) {
      onPostStatus(statusType, textContent);
      onClose();
      setStatusType(null);
      setTextContent("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-pulse-black dark:text-pulse-black">
            Create Status Update
          </DialogTitle>
          <DialogDescription className="text-pulse-black/70 dark:text-pulse-black/80">
            Share a photo, video, or text that disappears after 24 hours
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!statusType ? (
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusType("text")}
                className="flex flex-col items-center gap-3 p-6 bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle rounded-xl transition-colors"
              >
                <div className="w-16 h-16 bg-pulse-cyan/20 dark:bg-pulse-cyan/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-pulse-cyan" />
                </div>
                <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">Text</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusType("image")}
                className="flex flex-col items-center gap-3 p-6 bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle rounded-xl transition-colors"
              >
                <div className="w-16 h-16 bg-pulse-cyan/20 dark:bg-pulse-cyan/20 rounded-xl flex items-center justify-center">
                  <Image className="w-8 h-8 text-pulse-cyan" />
                </div>
                <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">Photo</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusType("video")}
                className="flex flex-col items-center gap-3 p-6 bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle rounded-xl transition-colors"
              >
                <div className="w-16 h-16 bg-pulse-cyan/20 dark:bg-pulse-cyan/20 rounded-xl flex items-center justify-center">
                  <Video className="w-8 h-8 text-pulse-cyan" />
                </div>
                <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">Video</span>
              </motion.button>
            </div>
          ) : statusType === "text" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 p-4 rounded-lg border border-pulse-grey-subtle dark:border-pulse-grey-subtle bg-white dark:bg-pulse-white text-pulse-black dark:text-pulse-black placeholder:text-pulse-grey-text dark:placeholder:text-pulse-grey-text resize-none focus:outline-none focus:ring-2 focus:ring-pulse-cyan"
                autoFocus
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-pulse-grey-subtle dark:border-pulse-grey-subtle rounded-lg"
            >
              <Camera className="w-12 h-12 text-pulse-grey-text dark:text-pulse-grey-text mb-4" />
              <p className="text-pulse-black/70 dark:text-pulse-black/80 mb-2">
                {statusType === "image" ? "Select a photo" : "Select a video"}
              </p>
              <Button variant="outline" className="mt-2">
                Choose File
              </Button>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
            {statusType && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusType(null);
                  setTextContent("");
                }}
                className="flex-1 border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light"
              >
                Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light"
            >
              Cancel
            </Button>
            {statusType && (
              <Button
                onClick={handlePost}
                disabled={statusType === "text" && !textContent.trim()}
                className={`flex-1 bg-pulse-cyan hover:bg-pulse-cyan/90 text-white ${
                  statusType === "text" && !textContent.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Post Status
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

