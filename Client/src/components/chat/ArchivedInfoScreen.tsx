import { Lock } from "lucide-react";

export default function ArchivedInfoScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-pulse-white p-8 relative overflow-hidden">
      {/* Subtle brand decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center max-w-md relative z-10">
        {/* Archive SVG Illustration */}
        <div className="w-56 h-56 mx-auto mb-6">
          <img 
            src="/assets/svg/arhive.svg" 
            alt="Archived chats" 
            className="w-full h-full object-contain opacity-90 dark:opacity-80"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-pulse-black dark:text-pulse-black mb-4 tracking-tight">
          Archived Chats
        </h1>
        
        {/* Description */}
        <p className="text-lg text-pulse-black/70 dark:text-pulse-black/80 mb-6 leading-relaxed">
          Archived chats stay hidden until you receive a new message.
        </p>
        
        <p className="text-base text-pulse-black/60 dark:text-pulse-black/70 mb-8">
          Long press on any conversation to archive it.
        </p>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-sm text-pulse-black/60 dark:text-pulse-black/70">
          <Lock className="w-4 h-4" />
          <span>Your archived messages are end-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
}

