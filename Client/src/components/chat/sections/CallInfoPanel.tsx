import { Phone, Video, MessageSquare, Lock, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Call {
  id: string;
  name: string;
  avatar?: string;
  emoji?: string;
  type: "incoming" | "outgoing" | "missed";
  callType: "voice" | "video";
  timestamp: string | number;
  duration?: number; // in seconds
}

interface CallInfoPanelProps {
  call: Call;
  onClose: () => void;
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatCallTime = (timestamp: string | number) => {
  const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
  return format(date, "h:mm a");
};

export default function CallInfoPanel({ call, onClose }: CallInfoPanelProps) {
  const initials = call.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Mock call history for this contact
  const callHistory: Call[] = [
    {
      ...call,
      id: call.id,
    },
    {
      id: `${call.id}-2`,
      name: call.name,
      emoji: call.emoji,
      type: "incoming",
      callType: "voice",
      timestamp: new Date().setHours(17, 5, 0, 0),
      duration: 300,
    },
  ];

  const getCallTypeLabel = (call: Call) => {
    if (call.type === "missed") return "Missed call";
    return call.callType === "video" ? "Video call" : "Voice call";
  };

  const getCallIcon = (call: Call) => {
    if (call.type === "missed") {
      return <Phone className="w-4 h-4 text-red-500" />;
    }
    if (call.type === "incoming") {
      return call.callType === "video" ? (
        <Video className="w-4 h-4 text-pulse-cyan" />
      ) : (
        <PhoneIncoming className="w-4 h-4 text-pulse-cyan" />
      );
    }
    return call.callType === "video" ? (
      <Video className="w-4 h-4 text-pulse-cyan" />
    ) : (
      <PhoneOutgoing className="w-4 h-4 text-pulse-cyan" />
    );
  };

  // Group calls by date
  const groupedCalls = callHistory.reduce((acc, call) => {
    const date = typeof call.timestamp === "number" ? new Date(call.timestamp) : new Date(call.timestamp);
    const today = new Date();
    const callDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    let label = "Today";
    if (callDate.getTime() === todayDate.getTime()) {
      label = "Today";
    } else {
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (callDate.getTime() === yesterday.getTime()) {
        label = "Yesterday";
      } else {
        label = format(date, "MMMM d, yyyy");
      }
    }

    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(call);
    return acc;
  }, {} as Record<string, Call[]>);

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
        <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Call info</h2>
      </div>

      {/* Contact Info */}
      <div className="p-6 border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={call.avatar} alt={call.name} />
            <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-lg">
              {call.emoji || initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-pulse-black dark:text-pulse-black mb-1">
              {call.name} {call.emoji}
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

      {/* Call History */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {Object.entries(groupedCalls).map(([dateLabel, calls], groupIndex) => (
            <motion.div
              key={dateLabel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="p-4"
            >
              <h3 className="text-xs font-semibold text-pulse-grey-text dark:text-pulse-grey-text uppercase mb-3">
                {dateLabel}
              </h3>
              <div className="space-y-2">
                {calls.map((historyCall, callIndex) => (
                  <motion.div
                    key={historyCall.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (groupIndex * 0.1) + (callIndex * 0.05) }}
                    whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--pulse-grey-light))" }}
                    className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getCallIcon(historyCall)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-pulse-black dark:text-pulse-black capitalize">
                            {historyCall.type}
                          </span>
                          {historyCall.callType === "video" && (
                            <span className="text-sm text-pulse-grey-text dark:text-pulse-grey-text">
                              video call
                            </span>
                          )}
                          {historyCall.callType === "voice" && historyCall.type !== "missed" && (
                            <span className="text-sm text-pulse-grey-text dark:text-pulse-grey-text">
                              at {formatCallTime(historyCall.timestamp)}
                            </span>
                          )}
                        </div>
                        {historyCall.type === "missed" && (
                          <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                            {formatCallTime(historyCall.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                    {historyCall.duration && (
                      <span className="text-xs text-pulse-grey-text dark:text-pulse-grey-text whitespace-nowrap ml-4">
                        {formatDuration(historyCall.duration)}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
          <Lock className="w-3 h-3" />
          <span>Your personal calls are end-to-end encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}

