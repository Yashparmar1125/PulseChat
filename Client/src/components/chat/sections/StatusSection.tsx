import { Plus, MoreVertical, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewStatusModal from "../modals/NewStatusModal";
import StatusDetailPanel from "./StatusDetailPanel";

interface Status {
  id: string;
  name: string;
  avatar?: string;
  emoji?: string;
  timestamp: string | number;
  isViewed: boolean;
  isMyStatus: boolean;
}

// Mock status data
const mockStatuses: Status[] = [
  {
    id: "1",
    name: "My Status",
    isMyStatus: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isViewed: false,
  },
  {
    id: "2",
    name: "Philsu",
    emoji: "😂",
    timestamp: new Date().setHours(17, 20, 0, 0),
    isViewed: false,
  },
  {
    id: "3",
    name: "Pinky Mavshi",
    timestamp: new Date().setHours(15, 17, 0, 0),
    isViewed: false,
  },
  {
    id: "4",
    name: "Anuja",
    timestamp: new Date().setHours(14, 20, 0, 0),
    isViewed: false,
  },
  {
    id: "5",
    name: "Dhairyashil Satav -Vedant",
    timestamp: new Date().setHours(13, 22, 0, 0),
    isViewed: false,
  },
  {
    id: "6",
    name: "Vvvvvvv",
    timestamp: new Date().setHours(13, 3, 0, 0),
    isViewed: false,
  },
];

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

export default function StatusSection() {
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [isNewStatusModalOpen, setIsNewStatusModalOpen] = useState(false);

  const myStatus = mockStatuses.find((s) => s.isMyStatus);
  const recentStatuses = mockStatuses.filter((s) => !s.isMyStatus);

  const handleStatusClick = (status: Status) => {
    setSelectedStatus(status);
  };

  const handlePostStatus = (type: "text" | "image" | "video", content: string) => {
    console.log(`Posting ${type} status:`, content);
    // Here you would implement the actual status posting logic
  };

  return (
    <>
      <div className="flex flex-1 h-full w-full">
        {/* Left Pane - Status List */}
        <div className="w-80 lg:w-96 flex flex-col bg-white dark:bg-pulse-white border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-pulse-black dark:text-pulse-black">Status</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-pulse-cyan/10 dark:bg-pulse-cyan/20 hover:bg-pulse-cyan/20 dark:hover:bg-pulse-cyan/30"
                    aria-label="New status"
                    onClick={() => setIsNewStatusModalOpen(true)}
                  >
                    <Plus className="w-5 h-5 text-pulse-cyan" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Status List */}
          <div className="flex-1 overflow-y-auto">
            {/* My Status */}
            {myStatus && (
              <div className="p-4 border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setIsNewStatusModalOpen(true)}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-pulse-cyan">
                      <AvatarFallback className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle text-pulse-black dark:text-pulse-black">
                        <span className="text-xl">👤</span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pulse-cyan rounded-full border-2 border-white dark:border-pulse-white flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-pulse-black dark:text-pulse-black mb-0.5">
                      {myStatus.name}
                    </h3>
                    <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                      Click to add status update
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Recent Updates */}
            <div className="p-2">
              <h3 className="text-xs font-semibold text-pulse-black dark:text-pulse-black uppercase px-2 mb-2">
                Recent
              </h3>
              {recentStatuses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-32 h-32 mb-4 opacity-60 dark:opacity-50">
                    <img 
                      src="/assets/svg/status.svg" 
                      alt="No status" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-pulse-black/70 dark:text-pulse-black/80 font-medium mb-1">
                    No status updates
                  </p>
                  <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70">
                    Status updates from your contacts will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentStatuses.map((status) => {
                    const initials = status.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    const isSelected = selectedStatus?.id === status.id;

                    return (
                      <motion.div
                        key={status.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleStatusClick(status)}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? "bg-pulse-cyan/10 dark:bg-pulse-cyan/20 border-2 border-pulse-cyan"
                            : "hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light border-2 border-transparent"
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={status.avatar} alt={status.name} />
                            <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-sm">
                              {status.emoji || initials}
                            </AvatarFallback>
                          </Avatar>
                          {!status.isViewed && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pulse-cyan rounded-full border-2 border-white dark:border-pulse-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-pulse-black dark:text-pulse-black truncate text-sm mb-0.5">
                            {status.name} {status.emoji}
                          </h3>
                          <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                            {formatStatusTime(status.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane - Status Detail or Prompt */}
        <AnimatePresence mode="wait">
          {selectedStatus ? (
            <StatusDetailPanel key={selectedStatus.id} status={selectedStatus} onClose={() => setSelectedStatus(null)} />
          ) : (
            <motion.div
              key="status-prompt"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-pulse-white p-8"
            >
              <div className="max-w-md w-full text-center">
                {/* Status SVG Illustration */}
                <div className="w-56 h-56 mx-auto mb-6">
                  <img 
                    src="/assets/svg/status.svg" 
                    alt="Status" 
                    className="w-full h-full object-contain opacity-90 dark:opacity-80"
                  />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-pulse-black dark:text-pulse-black mb-3">
                  Share status updates
                </h2>

                {/* Description */}
                <p className="text-pulse-black/70 dark:text-pulse-black/80 mb-8 leading-relaxed">
                  Share photos, videos and text that disappear after 24 hours.
                </p>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                  <Lock className="w-3 h-3" />
                  <span>Your status updates are end-to-end encrypted</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Status Modal */}
      <NewStatusModal
        isOpen={isNewStatusModalOpen}
        onClose={() => setIsNewStatusModalOpen(false)}
        onPostStatus={handlePostStatus}
      />
    </>
  );
}
