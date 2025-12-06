import { useState } from "react";
import { X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversations } from "@/features/conversations/hooks/useConversations";
import { motion, AnimatePresence } from "framer-motion";
import type { Participant } from "@/types/conversations";

interface ContactShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Participant) => void;
}

export default function ContactShareModal({
  isOpen,
  onClose,
  onSelectContact,
}: ContactShareModalProps) {
  const { conversations } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");

  // Get all unique contacts from conversations
  const allContacts = conversations.reduce((acc, conv) => {
    conv.participants.forEach((participant) => {
      const existing = acc.find((p) => p.id === participant.id);
      if (!existing) {
        acc.push(participant);
      }
    });
    return acc;
  }, [] as Participant[]);

  const filteredContacts = allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-pulse-grey-light rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-pulse-grey-subtle">
            <h2 className="text-lg font-semibold text-pulse-black dark:text-pulse-black">
              Share Contact
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-pulse-grey-subtle">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-pulse-grey-text">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No contacts found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      onSelectContact(contact);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-pulse-grey-light/50 dark:hover:bg-pulse-grey-light/30 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>
                        {contact.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-pulse-black dark:text-pulse-black">
                        {contact.name}
                      </p>
                      <p className="text-sm text-pulse-grey-text">
                        {contact.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}





