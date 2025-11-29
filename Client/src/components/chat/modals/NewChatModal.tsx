import { useState, useEffect } from "react";
import { X, Search, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usersApi } from "@/features/users/api";
import { conversationsApi } from "@/features/conversations/api";
import { useAuth } from "@/features/auth";
import { toast } from "sonner";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversationId: string) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { user: currentUser } = useAuth();

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await usersApi.searchUsers(searchQuery.trim(), 20);
        // Filter out current user
        const filteredUsers = response.users.filter(
          (u) => u.id !== currentUser?._id
        );
        setUsers(filteredUsers);
      } catch (error: any) {
        console.error("Error searching users:", error);
        toast.error(error.message || "Failed to search users");
        setUsers([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentUser?._id]);

  const handleSelectUser = async (selectedUser: any) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      // Create a new conversation with the selected user
      const response = await conversationsApi.createConversation({
        participantIds: [selectedUser.id],
        type: "private",
      });

      toast.success("Conversation created successfully");
      onConversationCreated(response.id);
      onClose();
      setSearchQuery("");
      setUsers([]);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      
      // If conversation already exists (409 status), the backend returns the existing conversation ID
      if (error.status === 409) {
        // Backend should return the existing conversation ID in the error response
        // For now, refresh conversations and try to find it
        try {
          const conversations = await conversationsApi.getConversations();
          const existingConv = conversations.conversations.find(
            (conv) =>
              !conv.isGroup &&
              conv.participants.some((p) => p.id === selectedUser.id)
          );
          
          if (existingConv) {
            toast.success("Opening existing conversation");
            onConversationCreated(existingConv.id);
            onClose();
            setSearchQuery("");
            setUsers([]);
            return;
          }
        } catch (err) {
          console.error("Error fetching conversations:", err);
        }
      }
      
      toast.error(error.message || "Failed to create conversation");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setSearchQuery("");
      setUsers([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            New Chat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={isCreating}
            />
          </div>

          {/* Search Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-pulse-cyan" />
              </div>
            ) : searchQuery.trim() && users.length === 0 ? (
              <div className="text-center py-8 text-pulse-grey-text">
                <p>No users found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-1">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    disabled={isCreating}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user.profilePicUrl}
                        alt={user.username}
                      />
                      <AvatarFallback className="bg-pulse-cyan text-white">
                        {user.username
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-pulse-black dark:text-pulse-black">
                        {user.username}
                      </p>
                      <p className="text-sm text-pulse-grey-text">
                        {user.email}
                      </p>
                      {user.statusText && (
                        <p className="text-xs text-pulse-grey-text mt-1 truncate">
                          {user.statusText}
                        </p>
                      )}
                    </div>
                    {isCreating && (
                      <Loader2 className="w-4 h-4 animate-spin text-pulse-cyan" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-pulse-grey-text">
                <p>Start typing to search for users</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

