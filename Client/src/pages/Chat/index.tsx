import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import Sidebar from "@/components/chat/Sidebar";
import ChatListPanel from "@/components/chat/ChatListPanel";
import NewChatModal from "@/components/chat/modals/NewChatModal";
import CallsSection from "@/components/chat/sections/CallsSection";
import StatusSection from "@/components/chat/sections/StatusSection";
import CommunitiesSection from "@/components/chat/sections/CommunitiesSection";
import ArchivedSection from "@/components/chat/sections/ArchivedSection";
import StarredSection from "@/components/chat/sections/StarredSection";
import SettingsSection from "@/components/chat/sections/SettingsSection";
import SettingsDetailView from "@/components/chat/sections/SettingsDetailView";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import ArchivedInfoScreen from "@/components/chat/ArchivedInfoScreen";
import MessageList from "@/features/messages/components/MessageList";
import MessageInput from "@/features/messages/components/MessageInput";
import { useConversations } from "@/features/conversations/hooks/useConversations";
import { useMessages } from "@/features/messages/hooks/useMessages";
import {
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  MessageSquare,
  CircleDot,
  Users,
  Archive,
  Star,
  Settings as SettingsIcon,
  Trash2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConversationInfoPanel from "@/components/chat/ConversationInfoPanel";
import ConversationMediaDrawer from "@/components/chat/ConversationMediaDrawer";
import ConversationSearchDialog from "@/components/chat/ConversationSearchDialog";
import { useToast } from "@/components/ui/use-toast";
import { messagesApi } from "@/features/messages/api";
import { conversationsApi } from "@/features/conversations/api";
import Loading from "@/components/ui/loading";
import { getSocket } from "@/services/websocket/ws-client";

export default function Chat() {
  const { user } = useAuth();
  const { conversations, isLoading: conversationsLoading, refetch: refetchConversations, pinConversation } = useConversations();
  const [activeTab, setActiveTab] = useState("chats");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightMessageId, setHighlightMessageId] = useState<string | null>(null);
  const [mutedConversations, setMutedConversations] = useState<Record<string, boolean>>({});
  const [isClearingChat, setIsClearingChat] = useState(false);
  const { messages, isLoading: messagesLoading, sendMessage, typingUsers } = useMessages(
    selectedConversationId
  );
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedSetting(null);
    // Clear selected conversation when switching to tabs that don't show chat
    if (tab !== "chats" && tab !== "archived") {
      setSelectedConversationId(null);
    }
  };

  const handleConversationCreated = (conversationId: string) => {
    // Refresh conversations list
    refetchConversations();
    // Select the new conversation
    setSelectedConversationId(conversationId);
    setActiveTab("chats");
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const isMuted = selectedConversationId ? mutedConversations[selectedConversationId] : false;

  const handleMuteToggle = () => {
    if (!selectedConversationId) return;
    setMutedConversations((prev) => ({
      ...prev,
      [selectedConversationId]: !prev[selectedConversationId],
    }));
    toast({
      title: !isMuted ? "Notifications muted" : "Notifications unmuted",
      description: selectedConversation?.name,
    });
  };

  const handleClearChat = async () => {
    if (!selectedConversationId || messages.length === 0) return;
    setIsClearingChat(true);
    try {
      await Promise.all(messages.map((message) => messagesApi.deleteMessage(message.id)));
      toast({ title: "Chat cleared" });
    } catch (error: any) {
      toast({
        title: "Failed to clear chat",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsClearingChat(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedConversationId) return;
    try {
      await conversationsApi.deleteConversation(selectedConversationId);
      setSelectedConversationId(null);
      refetchConversations();
      toast({ title: "Conversation deleted" });
    } catch (error: any) {
      toast({
        title: "Failed to delete chat",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  // Listen to presence updates for the selected conversation
  const [participantsStatus, setParticipantsStatus] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (!selectedConversation) {
      setParticipantsStatus({});
      setHighlightMessageId(null);
      return;
    }

    const socket = getSocket();
    if (!socket?.connected) {
      console.log('[Chat] Socket not connected, cannot listen to presence updates');
      return;
    }

    const handlePresence = (data: { userId: string; isOnline: boolean; lastSeen?: string }) => {
      console.log('[Chat] Received presence update:', data);
      // Check if this user is a participant in the selected conversation
      const isParticipant = selectedConversation.participants.some(p => {
        // Normalize IDs for comparison
        const pId = p.id?.toString() || p.id;
        const dataId = data.userId?.toString() || data.userId;
        return pId === dataId;
      });
      
      if (isParticipant) {
        console.log('[Chat] Updating presence for participant:', data.userId, 'isOnline:', data.isOnline);
        setParticipantsStatus(prev => ({
          ...prev,
          [data.userId]: data.isOnline
        }));
      } else {
        console.log('[Chat] Presence update for non-participant:', data.userId);
      }
    };

    socket.on('presence:update', handlePresence);

    // Initialize status from conversation participants
    const initialStatus: Record<string, boolean> = {};
    selectedConversation.participants.forEach(p => {
      const pId = p.id?.toString() || p.id;
      initialStatus[pId] = p.isOnline || false;
    });
    console.log('[Chat] Initialized presence status:', initialStatus);
    setParticipantsStatus(initialStatus);

    return () => {
      socket.off('presence:update', handlePresence);
    };
  }, [selectedConversation]);

  // Get online status for the selected conversation
  const isOnline = selectedConversation 
    ? selectedConversation.participants.some(p => {
        const pId = p.id?.toString() || p.id;
        const status = participantsStatus[pId] ?? p.isOnline ?? false;
        console.log('[Chat] Checking online status for participant:', pId, 'status:', status, 'from map:', participantsStatus[pId], 'from participant:', p.isOnline);
        return status;
      })
    : false;

  const handleSendMessage = (text?: string, attachments?: Omit<import("@/types/messages").MessageAttachment, "id">[]) => {
    if (selectedConversationId) {
      // Determine message type based on attachments
      let messageType: "text" | "image" | "file" | "audio" | "video" = "text";
      if (attachments && attachments.length > 0) {
        const firstAttachment = attachments[0];
        if (firstAttachment.type === "image") messageType = "image";
        else if (firstAttachment.type === "video") messageType = "video";
        else if (firstAttachment.type === "audio") messageType = "audio";
        else messageType = "file";
      }
      
      sendMessage({
        conversationId: selectedConversationId,
        text: text || "",
        type: messageType,
        attachments,
      });
    }
  };

  if (conversationsLoading) {
    return <Loading message="Loading conversations..." fullScreen />;
  }

  const renderChatView = () => {
    if (!selectedConversation) return null;

    return (
      <>
        {/* Chat Header */}
        <div className="h-16 border-b border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30 bg-white/95 dark:bg-pulse-white/95 backdrop-blur-sm dark:backdrop-blur-sm px-3 sm:px-5 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 mr-1 rounded-full hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80"
                onClick={() => setSelectedConversationId(null)}
                aria-label="Back to chats"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
                <Avatar className="w-11 h-11 flex-shrink-0 ring-2 ring-pulse-grey-light dark:ring-pulse-grey-light">
                  <AvatarImage
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-pulse-cyan/20 to-pulse-cyan/10 text-pulse-cyan font-semibold border border-pulse-cyan/20">
                    {(() => {
                      const name = selectedConversation.name;
                      if (!name || name === 'Unknown') return 'U';
                      const parts = name.trim().split(/\s+/);
                      if (parts.length >= 2) {
                        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
                      }
                      return name.slice(0, 2).toUpperCase();
                    })()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-pulse-black dark:text-pulse-black truncate text-base">
                    {selectedConversation.name}
                  </h2>
                  {typingUsers && typingUsers.length > 0 ? (
                    <p className="text-xs text-pulse-cyan font-medium italic">
                      {(() => {
                        const typingParticipantNames = typingUsers
                          .map(userId => {
                            const participant = selectedConversation.participants.find(p => 
                              (p.id?.toString() || p.id) === (userId?.toString() || userId)
                            );
                            return participant?.name || "Someone";
                          })
                          .filter(Boolean);
                        
                        if (typingParticipantNames.length === 1) {
                          return `${typingParticipantNames[0]} is typing...`;
                        } else if (typingParticipantNames.length === 2) {
                          return `${typingParticipantNames[0]} and ${typingParticipantNames[1]} are typing...`;
                        } else if (typingParticipantNames.length > 2) {
                          return `${typingParticipantNames[0]} and ${typingParticipantNames.length - 1} others are typing...`;
                        }
                        return "typing...";
                      })()}
                    </p>
                  ) : isOnline ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-pulse-cyan font-medium">Online</p>
                    </div>
                  ) : (
                    <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">Offline</p>
                  )}
                </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 transition-all duration-200">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 transition-all duration-200">
                  <Video className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 transition-all duration-200"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuItem onClick={() => setIsInfoOpen(true)}>
                      <Info className="w-4 h-4 mr-2" />
                      View contact
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsMediaOpen(true)}>
                      Media, links and docs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsSearchOpen(true)}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleMuteToggle}>
                      {isMuted ? "Unmute notifications" : "Mute notifications"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleClearChat} disabled={isClearingChat || messages.length === 0}>
                      Clear chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteChat}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
          </div>
        </div>

        {/* Messages Area */}
        <MessageList
          messages={messages}
          currentUserId={user?._id || "current-user"}
          isLoading={messagesLoading}
          typingUsers={typingUsers}
              highlightMessageId={highlightMessageId || undefined}
              onHighlightComplete={() => setHighlightMessageId(null)}
        />

        {/* Message Input */}
        <MessageInput
          onSend={handleSendMessage}
          placeholder={`Message ${selectedConversation.name}...`}
          conversationId={selectedConversationId}
        />
      </>
    );
  };

  // Mobile layout: WhatsApp-style – header + content + bottom nav, no left sidebar
  const overlays = (
    <>
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />

      <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={isMobile ? "h-[85vh]" : "sm:max-w-md"}
        >
          <SheetHeader>
            <SheetTitle>Conversation info</SheetTitle>
            <SheetDescription>
              View participants and security details.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ConversationInfoPanel conversation={selectedConversation ?? null} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isMediaOpen} onOpenChange={setIsMediaOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={isMobile ? "h-[85vh]" : "sm:max-w-lg"}
        >
          <SheetHeader>
            <SheetTitle>Media, links & docs</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ConversationMediaDrawer messages={messages} />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search messages</DialogTitle>
          </DialogHeader>
          <ConversationSearchDialog
            messages={messages}
            onJumpToMessage={(id) => {
              setHighlightMessageId(id);
              setIsSearchOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  if (isMobile) {
    // In a chat conversation on mobile: use a full-screen chat view (like WhatsApp),
    // hide bottom tab bar to maximize vertical space and avoid keyboard collisions.
    if ((activeTab === "chats" || activeTab === "archived") && selectedConversation) {
      return (
        <div className="h-screen flex flex-col bg-white dark:bg-pulse-white">
          <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-pulse-grey-light/40 via-white to-pulse-grey-light/20 dark:from-pulse-grey-light/20 dark:via-pulse-white dark:to-pulse-grey-light/15">
            {renderChatView()}
          </div>
          {overlays}
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-pulse-white pb-16">
        {/* Top App Bar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-pulse-grey-subtle/60 dark:border-pulse-grey-subtle/40 bg-pulse-grey-light/70 dark:bg-pulse-grey-light/70 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight text-pulse-cyan">
              Pulse
            </span>
            <span className="text-lg font-semibold text-pulse-black dark:text-pulse-black">
              Chat
            </span>
          </div>
          {/* Simple placeholder actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle"
              onClick={() => setIsNewChatModalOpen(true)}
              aria-label="New chat"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle"
                  aria-label="More"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleTabChange("settings")}>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-pulse-grey-light/40 via-white to-pulse-grey-light/20 dark:from-pulse-grey-light/20 dark:via-pulse-white dark:to-pulse-grey-light/15">
          {activeTab === "chats" && !selectedConversation && (
            <ChatListPanel
              conversations={conversations}
              selectedConversationId={selectedConversationId || undefined}
              onSelectConversation={setSelectedConversationId}
              onCreateConversation={() => setIsNewChatModalOpen(true)}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onPin={pinConversation}
              fullWidth
              showTitle={false}
            />
          )}

          {activeTab === "chats" && selectedConversation && renderChatView()}

          {activeTab === "archived" && !selectedConversation && (
            <ArchivedSection
              selectedConversationId={selectedConversationId || undefined}
              onSelectConversation={setSelectedConversationId}
            />
          )}

          {activeTab === "archived" && selectedConversation && renderChatView()}

          {activeTab === "settings" && !selectedSetting && (
            <SettingsSection
              selectedSetting={selectedSetting}
              onSettingSelect={setSelectedSetting}
            />
          )}

          {activeTab === "settings" && selectedSetting && (
            <SettingsDetailView
              settingId={selectedSetting}
              onBack={() => setSelectedSetting(null)}
            />
          )}

          {(activeTab === "calls" ||
            activeTab === "status" ||
            activeTab === "communities" ||
            activeTab === "starred") && (
            <>
              {activeTab === "calls" && <CallsSection />}
              {activeTab === "status" && <StatusSection />}
              {activeTab === "communities" && <CommunitiesSection />}
              {activeTab === "starred" && <StarredSection />}
            </>
          )}
        </div>

        {/* Bottom navigation – WhatsApp-style tabs */}
        <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-pulse-grey-subtle/60 dark:border-pulse-grey-subtle/40 bg-pulse-grey-light/95 dark:bg-pulse-grey-light/95 flex items-center justify-around z-20">
          <button
            onClick={() => handleTabChange("chats")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 ${
              activeTab === "chats"
                ? "text-pulse-cyan"
                : "text-pulse-grey-text dark:text-pulse-grey-text"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Chats</span>
          </button>
          <button
            onClick={() => handleTabChange("status")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 ${
              activeTab === "status"
                ? "text-pulse-cyan"
                : "text-pulse-grey-text dark:text-pulse-grey-text"
            }`}
          >
            <CircleDot className="w-5 h-5" />
            <span className="text-xs font-medium">Status</span>
          </button>
          <button
            onClick={() => handleTabChange("communities")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 ${
              activeTab === "communities"
                ? "text-pulse-cyan"
                : "text-pulse-grey-text dark:text-pulse-grey-text"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Communities</span>
          </button>
          <button
            onClick={() => handleTabChange("calls")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 ${
              activeTab === "calls"
                ? "text-pulse-cyan"
                : "text-pulse-grey-text dark:text-pulse-grey-text"
            }`}
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-medium">Calls</span>
          </button>
          <button
            onClick={() => handleTabChange("settings")}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 ${
              activeTab === "settings"
                ? "text-pulse-cyan"
                : "text-pulse-grey-text dark:text-pulse-grey-text"
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>

        {overlays}
      </div>
    );
  }

  // Desktop layout: original 3‑pane setup
  return (
    <div className="h-screen flex bg-white dark:bg-pulse-white">
      {/* Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content Panel - Changes based on active tab */}
      {activeTab === "chats" ? (
        // Chats section uses standard left panel + right content area
        <div className="w-80 lg:w-96 flex-shrink-0 border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle">
          <ChatListPanel
            conversations={conversations}
            selectedConversationId={selectedConversationId || undefined}
            onSelectConversation={setSelectedConversationId}
            onCreateConversation={() => setIsNewChatModalOpen(true)}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onPin={pinConversation}
          />
        </div>
      ) : activeTab === "calls" || activeTab === "status" || activeTab === "communities" || activeTab === "starred" ? (
        // These sections use full-width layout with their own left/right panes
        <>
          {activeTab === "calls" && <CallsSection />}
          {activeTab === "status" && <StatusSection />}
          {activeTab === "communities" && <CommunitiesSection />}
          {activeTab === "starred" && <StarredSection />}
        </>
      ) : activeTab === "archived" ? (
        // Archived works like chats - left panel + right content area
        <div className="w-80 lg:w-96 flex-shrink-0 border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle">
          <ArchivedSection
            selectedConversationId={selectedConversationId || undefined}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
      ) : (
        // Settings section uses left panel + right detail view
        <div className="w-80 lg:w-96 flex-shrink-0 border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle">
          <SettingsSection
            selectedSetting={selectedSetting}
            onSettingSelect={setSelectedSetting}
          />
        </div>
      )}

      {/* Main Content Area - Only show for chats/archived/settings */}
      {(activeTab === "chats" || activeTab === "archived" || activeTab === "settings") && (
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-pulse-grey-light/50 via-white to-pulse-grey-light/30 dark:from-pulse-grey-light/20 dark:via-pulse-white dark:to-pulse-grey-light/10">
          {activeTab === "settings" && selectedSetting ? (
            <SettingsDetailView
              settingId={selectedSetting}
              onBack={() => setSelectedSetting(null)}
            />
          ) : selectedConversation && (activeTab === "chats" || activeTab === "archived") ? (
            renderChatView()
          ) : activeTab === "archived" ? (
            <ArchivedInfoScreen />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      )}

      {overlays}
    </div>
  );
}
