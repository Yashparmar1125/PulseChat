import { FileText, Image, Camera, Headphones, User, BarChart3, Calendar, Sticker } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AttachmentMenuProps {
  onSelect: (option: AttachmentOption) => void;
  onClose: () => void;
}

export type AttachmentOption =
  | "document"
  | "photos"
  | "camera"
  | "audio"
  | "contact"
  | "poll"
  | "event"
  | "sticker";

interface AttachmentMenuItem {
  id: AttachmentOption;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  bgColor: string;
}

const attachmentOptions: AttachmentMenuItem[] = [
  {
    id: "document",
    label: "Document",
    icon: FileText,
    bgColor: "bg-purple-500",
  },
  {
    id: "photos",
    label: "Photos & videos",
    icon: Image,
    bgColor: "bg-blue-500",
  },
  {
    id: "camera",
    label: "Camera",
    icon: Camera,
    bgColor: "bg-pink-500",
  },
  {
    id: "audio",
    label: "Audio",
    icon: Headphones,
    bgColor: "bg-orange-500",
  },
  {
    id: "contact",
    label: "Contact",
    icon: User,
    bgColor: "bg-cyan-500",
  },
  {
    id: "poll",
    label: "Poll",
    icon: BarChart3,
    bgColor: "bg-orange-500",
  },
  {
    id: "event",
    label: "Event",
    icon: Calendar,
    bgColor: "bg-pink-500",
  },
  {
    id: "sticker",
    label: "New sticker",
    icon: Sticker,
    bgColor: "bg-green-500",
  },
];

export default function AttachmentMenu({ onSelect, onClose }: AttachmentMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-full left-0 mb-2 bg-pulse-grey-light dark:bg-pulse-grey-light rounded-2xl shadow-2xl border border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/50 p-3 min-w-[240px] z-[100] backdrop-blur-sm"
    >
      <div className="grid grid-cols-2 gap-2">
        {attachmentOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                onClose();
              }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl transition-all duration-200",
                "hover:bg-black/5 dark:hover:bg-white/5",
                "active:bg-black/10 dark:active:bg-white/10"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center",
                  option.bgColor,
                  "shadow-md"
                )}
              >
                <Icon 
                  className="w-7 h-7 text-white" 
                  strokeWidth={2}
                />
              </div>
              <span className="text-xs font-medium text-pulse-black dark:text-pulse-black text-center leading-tight">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

