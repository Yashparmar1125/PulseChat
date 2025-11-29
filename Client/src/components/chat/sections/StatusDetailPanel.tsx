import { MessageSquare, Phone, Video, Lock, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Status {
  id: string;
  name: string;
  avatar?: string;
  emoji?: string;
  timestamp: string | number;
  isViewed: boolean;
  isMyStatus: boolean;
  content?: string;
  type?: "text" | "image" | "video";
}

interface StatusDetailPanelProps {
  status: Status;
  onClose: () => void;
}

const formatStatusTime = (timestamp: string | number) => {
  const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const statusDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (statusDate.getTime() === today.getTime()) {
    return `Today at ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, yyyy 'at' h:mm a");
};

export default function StatusDetailPanel({ status, onClose }: StatusDetailPanelProps) {
  const initials = status.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Mock status history
  const statusHistory: Status[] = [
    {
      ...status,
      id: status.id,
    },
    {
      id: `${status.id}-2`,
      name: status.name,
      emoji: status.emoji,
      timestamp: new Date().setHours(15, 30, 0, 0),
      isViewed: true,
      isMyStatus: false,
      type: "image",
    },
    {
      id: `${status.id}-3`,
      name: status.name,
      emoji: status.emoji,
      timestamp: new Date().setHours(12, 0, 0, 0),
      isViewed: true,
      isMyStatus: false,
      type: "text",
      content: "Having a great day!",
    },
  ];

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
        <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Status info</h2>
      </div>

      {/* Contact Info */}
      <div className="p-6 border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={status.avatar} alt={status.name} />
            <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-lg">
              {status.emoji || initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-pulse-black dark:text-pulse-black mb-1">
              {status.name} {status.emoji}
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

      {/* Status History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-pulse-grey-text dark:text-pulse-grey-text uppercase mb-3">
            Status History
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {statusHistory.map((historyStatus, index) => (
                <motion.div
                  key={historyStatus.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--pulse-grey-light))" }}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-pulse-cyan/10 dark:bg-pulse-cyan/20 flex items-center justify-center flex-shrink-0">
                      {historyStatus.type === "video" ? (
                        <span className="text-lg">🎥</span>
                      ) : historyStatus.type === "image" ? (
                        <span className="text-lg">📷</span>
                      ) : (
                        <span className="text-lg">💬</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">
                          {historyStatus.type === "text" ? "Text status" : historyStatus.type === "image" ? "Photo" : "Video"}
                        </span>
                      </div>
                      {historyStatus.content && (
                        <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text line-clamp-1">
                          {historyStatus.content}
                        </p>
                      )}
                      <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text mt-1">
                        {formatStatusTime(historyStatus.timestamp)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Status</DropdownMenuItem>
                      <DropdownMenuItem>Reply</DropdownMenuItem>
                      <DropdownMenuItem>Mute</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
          <Lock className="w-3 h-3" />
          <span>Your status updates are end-to-end encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}

