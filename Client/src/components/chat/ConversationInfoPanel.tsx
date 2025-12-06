import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/types/conversations";
import { Info, ShieldCheck, Users } from "lucide-react";

interface ConversationInfoPanelProps {
  conversation: Conversation | null;
}

export default function ConversationInfoPanel({ conversation }: ConversationInfoPanelProps) {
  if (!conversation) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-pulse-cyan/10 text-pulse-cyan">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text">
            Conversation details
          </p>
          <h3 className="text-lg font-semibold text-pulse-black dark:text-pulse-black">
            {conversation.name || "Conversation"}
          </h3>
        </div>
      </div>

      <div className="rounded-2xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle bg-white dark:bg-pulse-white p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-pulse-grey-light dark:bg-pulse-grey-light text-pulse-grey-text">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-pulse-grey-text dark:text-pulse-grey-text">
              Participants
            </p>
            <p className="text-sm font-semibold text-pulse-black dark:text-pulse-black">
              {conversation.participants.length}
            </p>
          </div>
        </div>

        <ScrollArea className="max-h-64">
          <div className="space-y-3 pr-2">
            {conversation.participants.map((participant) => {
              const initials =
                participant.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "U";
              return (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 rounded-xl border border-pulse-grey-subtle/60 dark:border-pulse-grey-subtle/60 px-3 py-2"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={participant.profilePicUrl} />
                    <AvatarFallback className="bg-pulse-cyan/20 text-pulse-cyan font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pulse-black dark:text-pulse-black truncate">
                      {participant.name || "Unknown"}
                    </p>
                    <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">
                      {participant.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-2xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle">
        <div className="p-2 rounded-xl bg-pulse-cyan/10 text-pulse-cyan">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text">
          Messages are end-to-end encrypted. No one outside of this chat can read them.
        </p>
      </div>
    </div>
  );
}



