import { Users, Search, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCommunity: (name: string, description: string) => void;
}

export default function NewCommunityModal({
  isOpen,
  onClose,
  onCreateCommunity,
}: NewCommunityModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (name.trim()) {
      onCreateCommunity(name.trim(), description.trim());
      onClose();
      setName("");
      setDescription("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-pulse-black dark:text-pulse-black">
            Create New Community
          </DialogTitle>
          <DialogDescription className="text-pulse-black/70 dark:text-pulse-black/80">
            Create a community to bring members together in topic-based groups
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="communityName" className="text-sm font-semibold mb-2 block">
              Community Name
            </Label>
            <Input
              id="communityName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name"
              className="h-11 bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="communityDescription" className="text-sm font-semibold mb-2 block">
              Description (Optional)
            </Label>
            <Textarea
              id="communityDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this community about?"
              className="min-h-[100px] bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle text-pulse-black dark:text-pulse-black resize-none"
            />
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
              onClick={handleCreate}
              disabled={!name.trim()}
              className={`flex-1 bg-pulse-cyan hover:bg-pulse-cyan/90 text-white ${
                !name.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

