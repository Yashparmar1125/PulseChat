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
import { MoreVertical, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/ui/loading";
import { getSocket } from "@/services/websocket/ws-client";

export default function Chat() {
  const { user } = useAuth();
  const { conversations, isLoading: conversationsLoading, refetch: refetchConversations } = useConversations();
  const [activeTab, setActiveTab] = useState("chats");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const { messages, isLoading: messagesLoading, sendMessage, typingUsers } = useMessages(
    selectedConversationId
  );

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

  // Listen to presence updates for the selected conversation
  const [participantsStatus, setParticipantsStatus] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (!selectedConversation) {
      setParticipantsStatus({});
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

  const handleSendMessage = (text: string) => {
    if (selectedConversationId) {
      sendMessage({
        conversationId: selectedConversationId,
        text,
        type: "text",
      });
    }
  };

  if (conversationsLoading) {
    return <Loading message="Loading conversations..." fullScreen />;
  }

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
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30 bg-white/95 dark:bg-pulse-white/95 backdrop-blur-sm dark:backdrop-blur-sm px-5 flex items-center justify-between flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
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
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-pulse-grey-light/80 dark:hover:bg-pulse-grey-light/80 transition-all duration-200">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <Info className="w-4 h-4 mr-2" />
                      Conversation Info
                    </DropdownMenuItem>
                    <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                    <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
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
            />

            {/* Message Input */}
            <MessageInput
              onSend={handleSendMessage}
              placeholder={`Message ${selectedConversation.name}...`}
              conversationId={selectedConversationId}
            />
          </>
          ) : activeTab === "archived" ? (
            <ArchivedInfoScreen />
          ) : (
          <WelcomeScreen />
        )}
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
