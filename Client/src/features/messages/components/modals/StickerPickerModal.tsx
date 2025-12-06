import { useState } from "react";
import { X, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface StickerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (stickerUrl: string) => void;
}

// Sample sticker categories - in a real app, these would come from an API
const stickerCategories = [
  {
    name: "Smileys",
    stickers: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
      "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
    ],
  },
  {
    name: "Gestures",
    stickers: [
      "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏",
      "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆",
    ],
  },
  {
    name: "Objects",
    stickers: [
      "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉",
      "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱",
    ],
  },
  {
    name: "Food",
    stickers: [
      "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈",
      "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆",
    ],
  },
];

export default function StickerPickerModal({
  isOpen,
  onClose,
  onSelectSticker,
}: StickerPickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);

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
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-pulse-cyan" />
              <h2 className="text-lg font-semibold text-pulse-black dark:text-pulse-black">
                Stickers
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-pulse-grey-subtle overflow-x-auto scrollbar-hide">
            {stickerCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(index)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === index
                    ? "bg-pulse-cyan text-white"
                    : "text-pulse-grey-text hover:bg-pulse-grey-light/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Stickers Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-4 gap-3">
              {stickerCategories[selectedCategory].stickers.map((sticker, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // For emoji stickers, we'll send them as text
                    // In a real app, you'd have image URLs for stickers
                    onSelectSticker(sticker);
                    onClose();
                  }}
                  className="text-4xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-pulse-grey-light/50"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}





