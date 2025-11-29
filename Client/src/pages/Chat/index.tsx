import { useState } from "react";
import { useAuth } from "@/features/auth";
import Sidebar from "@/components/chat/Sidebar";
import ChatListPanel from "@/components/chat/ChatListPanel";
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

export default function Chat() {
  const { user } = useAuth();
  const { conversations, isLoading: conversationsLoading } = useConversations();
  const [activeTab, setActiveTab] = useState("chats");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const { messages, isLoading: messagesLoading, sendMessage } = useMessages(
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

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

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
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-pulse-white">
          {activeTab === "settings" && selectedSetting ? (
            <SettingsDetailView
              settingId={selectedSetting}
              onBack={() => setSelectedSetting(null)}
            />
          ) : selectedConversation && (activeTab === "chats" || activeTab === "archived") ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle bg-white dark:bg-pulse-white px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                  />
                  <AvatarFallback className="bg-pulse-cyan text-white font-semibold">
                    {selectedConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-pulse-black dark:text-pulse-black truncate">
                    {selectedConversation.name}
                  </h2>
                  {selectedConversation.participants.some((p) => p.isOnline) ? (
                    <p className="text-xs text-pulse-cyan">Online</p>
                  ) : (
                    <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">Offline</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Video className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              currentUserId={user?.id || "current-user"}
              isLoading={messagesLoading}
            />

            {/* Message Input */}
            <MessageInput
              onSend={handleSendMessage}
              placeholder={`Message ${selectedConversation.name}...`}
            />
          </>
          ) : activeTab === "archived" ? (
            <ArchivedInfoScreen />
          ) : (
          <WelcomeScreen />
        )}
        </div>
      )}
    </div>
  );
}
