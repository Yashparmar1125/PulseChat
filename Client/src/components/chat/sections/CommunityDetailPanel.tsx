import { MessageSquare, Phone, Video, Lock, Users, Settings, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Community {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  memberCount: number;
  unreadCount: number;
}

interface CommunityDetailPanelProps {
  community: Community;
  onClose: () => void;
}

export default function CommunityDetailPanel({ community, onClose }: CommunityDetailPanelProps) {
  const initials = community.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Mock members
  const mockMembers = [
    { id: "1", name: "You", role: "Admin" },
    { id: "2", name: "Alex", role: "Member" },
    { id: "3", name: "Sarah", role: "Member" },
    { id: "4", name: "Mike", role: "Member" },
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
        <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Community info</h2>
      </div>

      {/* Community Info */}
      <div className="p-6 border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={community.avatar} alt={community.name} />
            <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-pulse-black dark:text-pulse-black mb-1">
              {community.name}
            </h3>
            {community.description && (
              <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text">
                {community.description}
              </p>
            )}
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

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="font-semibold text-pulse-black dark:text-pulse-black">{community.memberCount}</span>
            <span className="text-pulse-grey-text dark:text-pulse-grey-text ml-1">members</span>
          </div>
          {community.unreadCount > 0 && (
            <Badge className="bg-pulse-cyan text-white">
              {community.unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-pulse-black dark:text-pulse-black">Members</h3>
            <Button variant="ghost" size="sm" className="text-pulse-cyan hover:text-pulse-cyan/80">
              View all
            </Button>
          </div>
          <div className="space-y-2">
            {mockMembers.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--pulse-grey-light))" }}
                className="flex items-center gap-3 p-2 rounded-lg transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-xs">
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-pulse-black dark:text-pulse-black">
                    {member.name}
                  </p>
                  <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center justify-center gap-2 text-xs text-pulse-grey-text dark:text-pulse-grey-text">
          <Lock className="w-3 h-3" />
          <span>Your community messages are end-to-end encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}

