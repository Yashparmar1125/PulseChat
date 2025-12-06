import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types/messages";
import { Search } from "lucide-react";

interface ConversationSearchDialogProps {
  messages: Message[];
  onJumpToMessage?: (messageId: string) => void;
}

export default function ConversationSearchDialog({
  messages,
  onJumpToMessage,
}: ConversationSearchDialogProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return messages.filter((message) => message.text?.toLowerCase().includes(q));
  }, [messages, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages"
          className="pl-10 h-11"
          autoFocus
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text" />
      </div>

      <ScrollArea className="max-h-[60vh]">
        {query && results.length === 0 && (
          <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text px-1">
            No messages found.
          </p>
        )}

        <div className="space-y-2 pr-2">
          {results.map((message) => (
            <button
              key={message.id}
              onClick={() => onJumpToMessage?.(message.id)}
              className="w-full text-left rounded-xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle px-3 py-2 hover:bg-pulse-grey-light/70 dark:hover:bg-pulse-grey-light/30 transition-colors"
            >
              <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text mb-1">
                {message.senderName} · {new Date(message.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-pulse-black dark:text-pulse-black line-clamp-2">
                {message.text}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}



