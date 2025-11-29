import { useState } from "react";
import { useAuth } from "@/features/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Lock,
  Shield,
  Palette,
  Globe,
  LogOut,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    messages: true,
    mentions: true,
    sounds: true,
  });

  const getInitials = () => {
    if (!user) return "U";
    const name = user.username || user.email?.split("@")[0] || "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };
  const initials = getInitials();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-pulse-black mb-2">
            Settings
          </h1>
          <p className="text-pulse-black/70">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-xl border border-pulse-grey-subtle p-6">
              <h2 className="text-xl font-bold text-pulse-black mb-6">
                Profile Information
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profilePicUrl} alt={user?.username || "User"} />
                  <AvatarFallback className="bg-pulse-cyan text-white text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-xs text-pulse-grey-text mt-2">
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={user?.username || ""}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    className="h-11"
                  />
                </div>

                <Button className="bg-pulse-cyan hover:bg-pulse-cyan/90 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-xl border border-pulse-grey-subtle p-6">
              <h2 className="text-xl font-bold text-pulse-black mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">
                      Message Notifications
                    </Label>
                    <p className="text-sm text-pulse-black/70">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch
                    checked={notifications.messages}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, messages: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">
                      Mention Notifications
                    </Label>
                    <p className="text-sm text-pulse-black/70">
                      Get notified when someone mentions you
                    </p>
                  </div>
                  <Switch
                    checked={notifications.mentions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, mentions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Sounds</Label>
                    <p className="text-sm text-pulse-black/70">
                      Play sounds for new messages
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sounds}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sounds: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="bg-white rounded-xl border border-pulse-grey-subtle p-6">
              <h2 className="text-xl font-bold text-pulse-black mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-pulse-cyan" />
                Privacy & Security
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-pulse-cyan/5 rounded-lg border border-pulse-cyan/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-pulse-cyan flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-pulse-black mb-1">
                        End-to-End Encryption
                      </h3>
                      <p className="text-sm text-pulse-black/70">
                        All your messages are encrypted by default. Only you and
                        the recipient can read them.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">
                        Read Receipts
                      </Label>
                      <p className="text-sm text-pulse-black/70">
                        Let others know when you've read their messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">
                        Last Seen
                      </Label>
                      <p className="text-sm text-pulse-black/70">
                        Show when you were last active
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-white rounded-xl border border-pulse-grey-subtle p-6">
              <h2 className="text-xl font-bold text-pulse-black mb-6">
                Appearance
              </h2>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Theme
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Light", "Dark", "System"].map((theme) => (
                      <button
                        key={theme}
                        className="p-4 border-2 border-pulse-grey-subtle rounded-lg hover:border-pulse-cyan transition-colors text-center"
                      >
                        <div className="text-sm font-semibold text-pulse-black">
                          {theme}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Language
                  </Label>
                  <select className="w-full h-11 rounded-lg border border-pulse-grey-subtle px-3">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <div className="mt-12 bg-white rounded-xl border border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

