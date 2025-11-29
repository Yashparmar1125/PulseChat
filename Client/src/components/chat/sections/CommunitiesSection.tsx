import { Plus, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewCommunityModal from "../modals/NewCommunityModal";
import CommunityDetailPanel from "./CommunityDetailPanel";

interface Community {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  memberCount: number;
  unreadCount: number;
}

// Mock communities data
const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Design Team",
    description: "Design discussions and updates",
    memberCount: 12,
    unreadCount: 4,
  },
  {
    id: "2",
    name: "Tech Updates",
    description: "Latest tech news and discussions",
    memberCount: 45,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Project Alpha",
    description: "Project collaboration space",
    memberCount: 8,
    unreadCount: 12,
  },
];

export default function CommunitiesSection() {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isNewCommunityModalOpen, setIsNewCommunityModalOpen] = useState(false);

  const handleCommunityClick = (community: Community) => {
    setSelectedCommunity(community);
  };

  const handleCreateCommunity = (name: string, description: string) => {
    console.log("Creating community:", { name, description });
    // Here you would implement the actual community creation logic
  };

  return (
    <>
      <div className="flex flex-1 h-full w-full">
        {/* Left Pane - Communities List */}
        <div className="w-80 lg:w-96 flex flex-col bg-white dark:bg-pulse-white border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Communities</h2>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-pulse-cyan/10 dark:bg-pulse-cyan/20 hover:bg-pulse-cyan/20 dark:hover:bg-pulse-cyan/30"
                  aria-label="New community"
                  onClick={() => setIsNewCommunityModalOpen(true)}
                >
                  <Plus className="w-5 h-5 text-pulse-cyan" />
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
              Communities bring members together in topic-based groups
            </p>
          </div>

          {/* Communities List */}
          <div className="flex-1 overflow-y-auto">
            {mockCommunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-32 h-32 mb-4 opacity-60 dark:opacity-50">
                  <img 
                    src="/assets/svg/community.svg" 
                    alt="No communities" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-pulse-black/70 dark:text-pulse-black/80 font-medium mb-1">
                  No communities yet
                </p>
                <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70 mb-4">
                  Create or join a community to get started
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-pulse-cyan hover:bg-pulse-cyan/90 text-white shadow-md"
                    onClick={() => setIsNewCommunityModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Community
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="divide-y divide-pulse-grey-subtle dark:divide-pulse-grey-subtle">
                {mockCommunities.map((community) => {
                  const initials = community.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  const isSelected = selectedCommunity?.id === community.id;

                  return (
                    <motion.div
                      key={community.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleCommunityClick(community)}
                      className={`p-4 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-pulse-cyan/10 dark:bg-pulse-cyan/20 border-l-4 border-pulse-cyan"
                          : "hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={community.avatar} alt={community.name} />
                          <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-pulse-black dark:text-pulse-black truncate">
                              {community.name}
                            </h3>
                            {community.unreadCount > 0 && (
                              <Badge className="bg-pulse-cyan text-white flex-shrink-0 min-w-[20px] h-5 px-1.5 justify-center text-xs font-semibold rounded-full">
                                {community.unreadCount > 99
                                  ? "99+"
                                  : community.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {community.description && (
                            <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80 truncate mb-1">
                              {community.description}
                            </p>
                          )}
                          <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                            {community.memberCount} members
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Community Detail or Info */}
        <AnimatePresence mode="wait">
          {selectedCommunity ? (
            <CommunityDetailPanel
              key={selectedCommunity.id}
              community={selectedCommunity}
              onClose={() => setSelectedCommunity(null)}
            />
          ) : (
            <motion.div
              key="community-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-pulse-white p-8"
            >
              <div className="max-w-md w-full text-center">
                {/* Community SVG Illustration */}
                <div className="w-56 h-56 mx-auto mb-6">
                  <img 
                    src="/assets/svg/community.svg" 
                    alt="Communities" 
                    className="w-full h-full object-contain opacity-90 dark:opacity-80"
                  />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-pulse-black dark:text-pulse-black mb-3">
                  Communities
                </h2>

                {/* Description */}
                <p className="text-pulse-black/70 dark:text-pulse-black/80 mb-8 leading-relaxed">
                  Communities bring members together in topic-based groups. Share updates, announcements, and have discussions with your community.
                </p>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                  <Lock className="w-3 h-3" />
                  <span>Your community messages are end-to-end encrypted</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Community Modal */}
      <NewCommunityModal
        isOpen={isNewCommunityModalOpen}
        onClose={() => setIsNewCommunityModalOpen(false)}
        onCreateCommunity={handleCreateCommunity}
      />
    </>
  );
}
