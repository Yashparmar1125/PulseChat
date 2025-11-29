import { Lock } from "lucide-react";

import { motion } from "framer-motion";

export default function PrivacyFeature() {
  return (
    <motion.div 
      className="bg-white dark:bg-pulse-white rounded-2xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 group hover-lift relative overflow-hidden"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Subtle brand accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pulse-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-pulse-cyan/10 dark:bg-pulse-cyan/20 flex items-center justify-center flex-shrink-0 transition-all duration-300">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-pulse-cyan" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-pulse-black dark:text-pulse-black mb-2">End-to-End Encryption</h3>
          <p className="text-sm sm:text-base text-pulse-grey-text dark:text-pulse-grey-text">Your Words, Always Private</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-pulse-black/80 dark:text-pulse-black/80 leading-relaxed">
          <strong className="font-semibold text-pulse-black dark:text-pulse-black">End-to-end encryption is always on</strong> by default. Your messages are protected from the moment you send them until they're read. Only you and the person you're chatting with can see what's said.
        </p>
        <div className="flex items-center gap-2 text-sm text-pulse-cyan font-semibold">
          <Lock className="w-4 h-4" />
          <span>Encryption active on all conversations</span>
        </div>
      </div>
    </motion.div>
  );
}

