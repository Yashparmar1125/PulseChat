import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";

interface SettingItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  variant?: "default" | "danger";
}

interface SettingsSectionProps {
  selectedSetting?: string | null;
  onSettingSelect?: (settingId: string | null) => void;
}

export default function SettingsSection({
  selectedSetting,
  onSettingSelect,
}: SettingsSectionProps) {
  const { logout } = useAuth();

  const settings: SettingItem[] = [
    {
      id: "profile",
      icon: User,
      label: "Profile",
      description: "Name, photo, about",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      description: "Message, call & status notifications",
    },
    {
      id: "privacy",
      icon: Lock,
      label: "Privacy",
      description: "Block contacts, read receipts",
    },
    {
      id: "appearance",
      icon: Palette,
      label: "Appearance",
      description: "Theme, wallpaper, font size",
    },
    {
      id: "language",
      icon: Globe,
      label: "Language",
      description: "English",
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help",
      description: "Help center, contact us, privacy policy",
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleSettingClick = (settingId: string) => {
    if (onSettingSelect) {
      onSettingSelect(settingId);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-pulse-white">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">Settings</h2>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-pulse-grey-subtle dark:divide-pulse-grey-subtle">
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <button
                key={setting.id}
                onClick={() => handleSettingClick(setting.id)}
                className="w-full p-4 hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pulse-grey-light dark:bg-pulse-grey-light">
                    <Icon className="w-5 h-5 text-pulse-black dark:text-pulse-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-pulse-black dark:text-pulse-black mb-0.5">
                      {setting.label}
                    </h3>
                    {setting.description && (
                      <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text truncate">
                        {setting.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-pulse-grey-text dark:text-pulse-grey-text flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
          <Button
            variant="outline"
            className="w-full justify-start border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

