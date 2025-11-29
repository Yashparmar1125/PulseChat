import { Lock } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-pulse-grey-light dark:bg-pulse-grey-light p-8 relative overflow-hidden">
      {/* Subtle brand decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center max-w-md relative z-10">
        {/* Logo - faded */}
        <div className="mb-8 opacity-10 dark:opacity-5">
          <Logo />
        </div>

        {/* Main Text */}
        <h1 className="text-4xl sm:text-5xl font-bold text-pulse-black dark:text-pulse-black mb-4 tracking-tight">
          <span className="brand-gradient">PULSE</span> Chat
        </h1>
        
        <p className="text-lg text-pulse-black/70 dark:text-pulse-black/80 mb-6 leading-relaxed">
          Send and receive messages without keeping your phone online.
        </p>
        
        <p className="text-base text-pulse-black/60 dark:text-pulse-black/70 mb-8">
          Use PULSE on up to 4 linked devices and 1 phone at the same time.
        </p>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-sm text-pulse-black/60 dark:text-pulse-black/70">
          <Lock className="w-4 h-4" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
}

