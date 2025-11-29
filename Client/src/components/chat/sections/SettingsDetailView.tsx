import { ArrowLeft, User, Bell, Lock, Palette, Globe, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

interface SettingsDetailViewProps {
  settingId: string;
  onBack: () => void;
}

export default function SettingsDetailView({
  settingId,
  onBack,
}: SettingsDetailViewProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    messages: true,
    mentions: true,
    sounds: true,
  });

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const renderContent = () => {
    switch (settingId) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-pulse-cyan text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
                <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text mt-2">
                  JPG, PNG or GIF. Max size 2MB
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-pulse-black dark:text-pulse-black">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={user?.name || ""}
                  className="h-11 bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-pulse-black dark:text-pulse-black">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  className="h-11 bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about" className="text-pulse-black dark:text-pulse-black">About</Label>
                <Input
                  id="about"
                  placeholder="Tell us about yourself"
                  className="h-11 bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black placeholder:text-pulse-grey-text dark:placeholder:text-pulse-grey-text"
                />
              </div>

              <Button className="bg-pulse-cyan hover:bg-pulse-cyan/90 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold text-pulse-black dark:text-pulse-black">
                    Message Notifications
                  </Label>
                  <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
                    Get notified when you receive new messages
                  </p>
                </div>
                <Switch
                  checked={notifications.messages}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, messages: checked })
                  }
                  className="data-[state=checked]:bg-pulse-cyan"
                />
              </div>

              <Separator className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold text-pulse-black dark:text-pulse-black">
                    Mention Notifications
                  </Label>
                  <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
                    Get notified when someone mentions you
                  </p>
                </div>
                <Switch
                  checked={notifications.mentions}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, mentions: checked })
                  }
                  className="data-[state=checked]:bg-pulse-cyan"
                />
              </div>

              <Separator className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold text-pulse-black dark:text-pulse-black">Sounds</Label>
                  <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
                    Play sounds for new messages
                  </p>
                </div>
                <Switch
                  checked={notifications.sounds}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sounds: checked })
                  }
                  className="data-[state=checked]:bg-pulse-cyan"
                />
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div className="p-4 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-lg border border-pulse-cyan/20 dark:border-pulse-cyan/30">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-pulse-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-pulse-black dark:text-pulse-black mb-1">
                    End-to-End Encryption
                  </h3>
                  <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
                    All your messages are encrypted by default. Only you and
                    the recipient can read them.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold text-pulse-black dark:text-pulse-black">
                    Read Receipts
                  </Label>
                  <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
                    Let others know when you've read their messages
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-pulse-cyan" />
              </div>

              <Separator className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold text-pulse-black dark:text-pulse-black">Last Seen</Label>
                  <p className="text-sm text-pulse-black/70 dark:text-pulse-black/80">
                    Show when you were last active
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-pulse-cyan" />
              </div>

              <Separator className="bg-pulse-grey-subtle dark:bg-pulse-grey-subtle" />

              <Button variant="outline" className="w-full justify-start border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block text-pulse-black dark:text-pulse-black">Theme</Label>
              <div className="grid grid-cols-3 gap-4">
                {(["Light", "Dark", "System"] as const).map((themeOption) => {
                  const themeValue = themeOption.toLowerCase() as "light" | "dark" | "system";
                  const isSelected = theme === themeValue;
                  return (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeValue)}
                      className={`p-4 border-2 rounded-lg transition-colors text-center ${
                        isSelected
                          ? "border-pulse-cyan bg-pulse-cyan/10 dark:bg-pulse-cyan/20"
                          : "border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:border-pulse-cyan dark:hover:border-pulse-cyan bg-white dark:bg-pulse-white"
                      }`}
                    >
                      <div className={`text-sm font-semibold ${
                        isSelected ? "text-pulse-cyan" : "text-pulse-black dark:text-pulse-black"
                      }`}>
                        {themeOption}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-semibold mb-3 block text-pulse-black dark:text-pulse-black">
                Language
              </Label>
              <select className="w-full h-11 rounded-lg border border-pulse-grey-subtle dark:border-pulse-grey-subtle px-3 bg-white dark:bg-pulse-white text-pulse-black dark:text-pulse-black">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block text-pulse-black dark:text-pulse-black">
                Language
              </Label>
              <select className="w-full h-11 rounded-lg border border-pulse-grey-subtle dark:border-pulse-grey-subtle px-3 bg-white dark:bg-pulse-white text-pulse-black dark:text-pulse-black">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Italian</option>
              </select>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light">
                Help Center
              </Button>
              <Button variant="outline" className="w-full justify-start border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light">
                Contact Us
              </Button>
              <Button variant="outline" className="w-full justify-start border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light">
                Terms of Service
              </Button>
            </div>
          </div>
        );

      default:
        return <div className="text-pulse-black dark:text-pulse-black">Setting not found</div>;
    }
  };

  const getTitle = () => {
    const titles: Record<string, string> = {
      profile: "Profile",
      notifications: "Notifications",
      privacy: "Privacy",
      appearance: "Appearance",
      language: "Language",
      help: "Help",
    };
    return titles[settingId] || "Settings";
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-pulse-white">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold text-pulse-black dark:text-pulse-black">
            {getTitle()}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-pulse-white">{renderContent()}</div>
    </div>
  );
}

