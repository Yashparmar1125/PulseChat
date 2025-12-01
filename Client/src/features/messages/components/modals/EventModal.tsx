import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: {
    title: string;
    description?: string;
    date: string;
    time: string;
    location?: string;
  }) => void;
}

export default function EventModal({
  isOpen,
  onClose,
  onCreateEvent,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = () => {
    if (title.trim() && date && time) {
      onCreateEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        time,
        location: location.trim() || undefined,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

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
              Create Event
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-pulse-black dark:text-pulse-black mb-2 block">
                Event Title *
              </label>
              <Input
                type="text"
                placeholder="Enter event title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-pulse-black dark:text-pulse-black mb-2 block">
                Description
              </label>
              <textarea
                placeholder="Add event description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-pulse-grey-subtle bg-white dark:bg-pulse-white text-pulse-black dark:text-pulse-black resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-pulse-black dark:text-pulse-black mb-2 block">
                  Date *
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-pulse-black dark:text-pulse-black mb-2 block">
                  Time *
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-pulse-black dark:text-pulse-black mb-2 block">
                Location
              </label>
              <Input
                type="text"
                placeholder="Event location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-pulse-grey-subtle">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || !date || !time}
              className="bg-gradient-to-br from-pulse-cyan to-pulse-cyan/90 hover:from-pulse-cyan/90 hover:to-pulse-cyan/80 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}




