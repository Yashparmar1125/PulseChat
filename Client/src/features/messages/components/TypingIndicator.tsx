import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  userIds: string[];
}

export default function TypingIndicator({ userIds }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-2.5 py-1.5 w-full justify-start"
    >
      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
        <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-white dark:bg-pulse-grey-light border border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30 shadow-sm">
          <div className="flex gap-1 items-center">
            <div className="w-1.5 h-1.5 bg-pulse-grey-text dark:bg-pulse-grey-text rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 bg-pulse-grey-text dark:bg-pulse-grey-text rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 bg-pulse-grey-text dark:bg-pulse-grey-text rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



