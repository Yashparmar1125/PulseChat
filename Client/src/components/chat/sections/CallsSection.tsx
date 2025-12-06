import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video, Plus, Search, Link2, Calendar, Lock, Grid3x3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CallInfoPanel from "./CallInfoPanel";
import NewCallModal from "../modals/NewCallModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { callsApi, type CallLog } from "@/features/calls/api";
import { useAuth } from "@/features/auth";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { conversationsApi } from "@/features/conversations/api";

interface Call {
  id: string;
  name: string;
  avatar?: string;
  type: "incoming" | "outgoing" | "missed";
  callType: "voice" | "video";
  timestamp: string | number;
  duration?: number; // in seconds
}

const getCallIcon = (call: Call) => {
  if (call.type === "missed") {
    return <PhoneMissed className="w-4 h-4 text-red-500" />;
  }
  if (call.type === "incoming") {
    return <PhoneIncoming className="w-4 h-4 text-pulse-cyan" />;
  }
  return <PhoneOutgoing className="w-4 h-4 text-pulse-cyan" />;
};

const formatTime = (timestamp: string | number) => {
  const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
  return format(date, "h:mm a");
};

export default function CallsSection() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isNewCallModalOpen, setIsNewCallModalOpen] = useState(false);
  const [newCallType, setNewCallType] = useState<"video" | "voice" | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();

  const currentUserId = user?._id;

  const loadCallLogs = async () => {
    try {
      setIsLoading(true);
      const res = await callsApi.getCallLogs(100);
      setCallLogs(res.callLogs);
    } catch (error: any) {
      console.error("Failed to fetch call logs", error);
      toast({
        title: "Failed to load call history",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadCallLogs();
    }
  }, [currentUserId]);

  const recentCalls: Call[] = useMemo(() => {
    return callLogs.map((log) => {
      const other = log.participants[0];
      const name = other?.username || "Unknown";
      const type: Call["type"] =
        log.status === "missed"
          ? "missed"
          : log.startedBy && currentUserId && log.startedBy === currentUserId
          ? "outgoing"
          : "incoming";

      return {
        id: log.id,
        name,
        avatar: other?.profilePicUrl,
        type,
        callType: log.type,
        timestamp: log.startedAt,
        duration: log.duration,
      };
    });
  }, [callLogs, currentUserId]);

  const favouriteContacts = useMemo(() => {
    const counts: Record<string, { name: string; avatar?: string; count: number }> = {};
    recentCalls.forEach((call) => {
      const key = call.name;
      if (!counts[key]) {
        counts[key] = { name: call.name, avatar: call.avatar, count: 0 };
      }
      counts[key].count += 1;
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [recentCalls]);

  const handleCallClick = (call: Call) => {
    setSelectedCall(call);
  };

  const handleNewCallClick = (type: "video" | "voice") => {
    setNewCallType(type);
    setIsNewCallModalOpen(true);
  };

  const handleStartCall = async (type: "video" | "voice", contactId?: string) => {
    if (!contactId || !currentUserId) return;

    try {
      // 1) Ensure there's a 1:1 conversation with this contact
      const { id: conversationId } = await conversationsApi.createConversation({
        participantIds: [contactId],
        type: "private",
      });

      // 2) Log the call on the server
      await callsApi.initiateCall({ conversationId, type });

      toast({ title: "Call initiated" });
      loadCallLogs();
    } catch (error: any) {
      console.error("Failed to start call", error);
      toast({
        title: "Failed to start call",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const listPane = (
    <div
      className={`${isMobile ? "w-full" : "w-80 lg:w-96 border-r"} flex flex-col bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle`}
    >
          {/* Header */}
          <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Calls</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full bg-pulse-cyan/10 dark:bg-pulse-cyan/20 hover:bg-pulse-cyan/20 dark:hover:bg-pulse-cyan/30"
                aria-label="New call"
                onClick={() => handleNewCallClick("voice")}
              >
                <Phone className="w-5 h-5 text-pulse-cyan" />
                <Plus className="w-3 h-3 text-pulse-cyan absolute" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
              <Input
                type="text"
                placeholder="Search name or number"
                className="pl-9 h-10 bg-pulse-grey-light dark:bg-pulse-grey-light border-0 dark:border-0 focus:bg-white dark:focus:bg-pulse-white text-pulse-black dark:text-pulse-black placeholder:text-pulse-grey-text dark:placeholder:text-pulse-grey-text"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Favourites Section */}
            <div className="p-4 border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
              <h3 className="text-sm font-semibold text-pulse-black dark:text-pulse-black mb-3">Favourites</h3>
              {favouriteContacts.length === 0 ? (
                <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                  Your most frequent contacts will appear here.
                </p>
              ) : (
                favouriteContacts.map((fav) => {
                  const initials = fav.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <motion.div
                      key={fav.name}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center justify-between p-2 hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={fav.avatar} alt={fav.name} />
                          <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-pulse-black dark:text-pulse-black text-sm">
                          {fav.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-pulse-cyan/10 dark:hover:bg-pulse-cyan/20"
                          onClick={() => handleNewCallClick("video")}
                          aria-label="Video call"
                        >
                          <Video className="w-4 h-4 text-pulse-cyan" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-pulse-cyan/10 dark:hover:bg-pulse-cyan/20"
                          onClick={() => handleNewCallClick("voice")}
                          aria-label="Voice call"
                        >
                          <Phone className="w-4 h-4 text-pulse-cyan" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Recent Section */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-pulse-black dark:text-pulse-black mb-3">Recent</h3>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-pulse-grey-text dark:text-pulse-grey-text">
                  Loading call history...
                </div>
              ) : recentCalls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-32 h-32 mb-5">
                    <img 
                      src="/assets/svg/Calling.svg" 
                      alt="No calls" 
                      className="w-full h-full object-contain opacity-60 dark:opacity-50"
                    />
                  </div>
                  <p className="text-pulse-black/70 dark:text-pulse-black/80 font-medium mb-1">No calls yet</p>
                  <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70">
                    Your call history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentCalls.map((call) => {
                    const initials = call.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    const isSelected = selectedCall?.id === call.id;

                    return (
                      <motion.div
                        key={call.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleCallClick(call)}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? "bg-pulse-cyan/10 dark:bg-pulse-cyan/20 border-2 border-pulse-cyan"
                            : "hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light border-2 border-transparent"
                        }`}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={call.avatar} alt={call.name} />
                          <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-sm">
                            {call.emoji || initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-medium text-pulse-black dark:text-pulse-black truncate text-sm">
                              {call.name} {call.emoji}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {getCallIcon(call)}
                              <span className="text-xs text-pulse-grey-text dark:text-pulse-grey-text whitespace-nowrap">
                                {formatTime(call.timestamp)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-pulse-grey-text dark:text-pulse-grey-text capitalize">
                              {call.type}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
    </div>
  );

  // Mobile: single-column, list or detail
  if (isMobile) {
    return (
      <>
        <div className="flex flex-1 h-full w-full">
          {selectedCall ? (
            <CallInfoPanel
              key={selectedCall.id}
              call={selectedCall}
              onClose={() => setSelectedCall(null)}
            />
          ) : (
            listPane
          )}
        </div>
        <NewCallModal
          isOpen={isNewCallModalOpen}
          onClose={() => {
            setIsNewCallModalOpen(false);
            setNewCallType(null);
          }}
          callType={newCallType}
          onStartCall={handleStartCall}
        />
      </>
    );
  }

  // Desktop: split list + detail
  return (
    <>
      <div className="flex flex-1 h-full w-full">
        {/* Left Pane - Calls List */}
        {listPane}

        {/* Right Pane - Call Actions or Call Info */}
        <AnimatePresence mode="wait">
          {selectedCall ? (
            <CallInfoPanel
              key={selectedCall.id}
              call={selectedCall}
              onClose={() => setSelectedCall(null)}
            />
          ) : (
            <motion.div
              key="call-actions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-pulse-white p-8"
            >
              <div className="max-w-md w-full">
                {/* Calling SVG Illustration - Natural and prominent */}
                <div className="w-56 h-56 mx-auto mb-8">
                  <img
                    src="/assets/svg/Calling.svg"
                    alt="Calling"
                    className="w-full h-full object-contain opacity-90 dark:opacity-80"
                  />
                </div>
                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Start call */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNewCallClick("video")}
                    className="flex flex-col items-center gap-3 p-6 bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle rounded-xl transition-colors"
                  >
                    <div className="w-16 h-16 bg-pulse-cyan/20 dark:bg-pulse-cyan/20 rounded-xl flex items-center justify-center">
                      <Video className="w-8 h-8 text-pulse-cyan" />
                    </div>
                    <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">
                      Start call
                    </span>
                  </motion.button>

                  {/* New call link */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-3 p-6 bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle rounded-xl transition-colors"
                  >
                    <div className="w-16 h-16 bg-pulse-grey-subtle dark:bg-pulse-grey-subtle rounded-xl flex items-center justify-center">
                      <Link2 className="w-8 h-8 text-pulse-black dark:text-pulse-black" />
                    </div>
                    <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">
                      New call link
                    </span>
                  </motion.button>

                  {/* Call a number */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-3 p-6 bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle rounded-xl transition-colors"
                  >
                    <div className="w-16 h-16 bg-pulse-grey-subtle dark:bg-pulse-grey-subtle rounded-xl flex items-center justify-center">
                      <Grid3x3 className="w-8 h-8 text-pulse-black dark:text-pulse-black" />
                    </div>
                    <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">
                      Call a number
                    </span>
                  </motion.button>

                  {/* Schedule call */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-3 p-6 bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle rounded-xl transition-colors"
                  >
                    <div className="w-16 h-16 bg-pulse-grey-subtle dark:bg-pulse-grey-subtle rounded-xl flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-pulse-black dark:text-pulse-black" />
                    </div>
                    <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">
                      Schedule call
                    </span>
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                  <Lock className="w-3 h-3" />
                  <span>Your personal calls are end-to-end encrypted</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Call Modal */}
      <NewCallModal
        isOpen={isNewCallModalOpen}
        onClose={() => {
          setIsNewCallModalOpen(false);
          setNewCallType(null);
        }}
        callType={newCallType}
        onStartCall={handleStartCall}
      />
    </>
  );
}
