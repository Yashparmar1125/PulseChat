import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Phone,
  CircleDot,
  Users,
  Archive,
  Star,
  Settings,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const tabs = [
    { id: "chats", icon: MessageSquare, badge: null },
    { id: "calls", icon: Phone, badge: 2 },
    { id: "status", icon: CircleDot, badge: null },
    { id: "communities", icon: Users, badge: null },
    { id: "archived", icon: Archive, badge: null },
    { id: "starred", icon: Star, badge: null },
    { id: "settings", icon: Settings, badge: null },
  ];

  return (
    <div className="w-16 bg-pulse-grey-light dark:bg-pulse-grey-light border-r border-pulse-grey-subtle dark:border-pulse-grey-subtle flex flex-col items-center py-4">
      {/* Top Profile */}
      <button
        onClick={() => onTabChange("profile")}
        className={cn(
          "mb-2 p-2 rounded-lg transition-colors",
          activeTab === "profile"
            ? "bg-pulse-cyan/20 dark:bg-pulse-cyan/20 text-pulse-cyan"
            : "text-pulse-grey-text dark:text-pulse-grey-text hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle"
        )}
        aria-label="Profile"
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Navigation Tabs */}
      <div className="flex-1 flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative p-3 rounded-lg transition-colors",
                isActive
                  ? "bg-pulse-cyan/20 dark:bg-pulse-cyan/20 text-pulse-cyan"
                  : "text-pulse-grey-text dark:text-pulse-grey-text hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle"
              )}
              aria-label={tab.id}
            >
              <Icon className="w-6 h-6" />
              {tab.badge && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] border-2 border-pulse-grey-light dark:border-pulse-grey-light">
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Profile (optional - for consistency with WhatsApp) */}
      <div className="mt-auto">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle text-pulse-black dark:text-pulse-black text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

