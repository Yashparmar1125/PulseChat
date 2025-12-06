import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types/messages";
import { Image as ImageIcon, Link2, Video, File } from "lucide-react";
import { normalizeFileUrl } from "@/utils/fileUtils";

interface ConversationMediaDrawerProps {
  messages: Message[];
}

export default function ConversationMediaDrawer({ messages }: ConversationMediaDrawerProps) {
  const attachments =
    messages.flatMap((message) =>
      (message.attachments || []).map((attachment) => ({
        ...attachment,
        messageId: message.id,
        timestamp: message.timestamp,
        senderName: message.senderName,
      })),
    ) || [];

  const getIcon = (type: string) => {
    if (type === "image") return ImageIcon;
    if (type === "video") return Video;
    if (type === "link") return Link2;
    return File;
  };

  return (
    <div className="space-y-4">
      {attachments.length === 0 ? (
        <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text">
          No media, links or documents in this conversation yet.
        </p>
      ) : (
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-2">
            {attachments.map((attachment) => {
              const Icon = getIcon(attachment.type);
              return (
                <button
                  key={`${attachment.messageId}-${attachment.id}`}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:bg-pulse-grey-light/70 dark:hover:bg-pulse-grey-light/30 transition-colors text-left"
                  onClick={() => window.open(normalizeFileUrl(attachment.url), "_blank")}
                >
                  <div className="w-12 h-12 rounded-lg bg-pulse-cyan/10 dark:bg-pulse-cyan/20 flex items-center justify-center text-pulse-cyan">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pulse-black dark:text-pulse-black truncate">
                      {attachment.name || attachment.type.toUpperCase()}
                    </p>
                    <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text truncate">
                      {attachment.senderName} · {new Date(attachment.timestamp).toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}



