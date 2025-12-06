import { Video, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usersApi, type SearchUsersResponse } from "@/features/users/api";

interface NewCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: "video" | "voice" | null;
  onStartCall: (type: "video" | "voice", contactId?: string) => void;
}

export default function NewCallModal({
  isOpen,
  onClose,
  callType,
  onStartCall,
}: NewCallModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [results, setResults] = useState<SearchUsersResponse["users"]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    setSelectedContact(null);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const res = await usersApi.searchUsers(value, 20);
      setResults(res.users);
    } catch (error) {
      console.error("User search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartCall = () => {
    if (callType && selectedContact) {
      onStartCall(callType, selectedContact);
      onClose();
      setSelectedContact(null);
      setSearchQuery("");
      setResults([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-pulse-black dark:text-pulse-black">
            {callType === "video" ? "Start Video Call" : "Start Voice Call"}
          </DialogTitle>
          <DialogDescription className="text-pulse-black/70 dark:text-pulse-black/80">
            Select a contact to call
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
          </div>

          {/* Contact List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            <AnimatePresence>
              {isSearching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-pulse-grey-text dark:text-pulse-grey-text"
                >
                  Searching...
                </motion.div>
              ) : results.length === 0 && searchQuery ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-pulse-grey-text dark:text-pulse-grey-text"
                >
                  No contacts found
                </motion.div>
              ) : (
                results.map((contact) => {
                  const initials = contact.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <motion.button
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => setSelectedContact(contact.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        selectedContact === contact.id
                          ? "bg-pulse-cyan/10 dark:bg-pulse-cyan/20 border-2 border-pulse-cyan"
                          : "bg-pulse-grey-light dark:bg-pulse-grey-light hover:bg-pulse-grey-subtle dark:hover:bg-pulse-grey-subtle border-2 border-transparent"
                      }`}
                    >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={contact.profilePicUrl} alt={contact.username} />
                          <AvatarFallback className="bg-pulse-cyan text-white font-semibold text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-pulse-black dark:text-pulse-black text-sm">
                          {contact.username}
                        </span>
                    </motion.button>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartCall}
              disabled={!selectedContact}
              className={`flex-1 bg-pulse-cyan hover:bg-pulse-cyan/90 text-white ${
                !selectedContact ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {callType === "video" ? (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Call
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Start Voice Call
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

