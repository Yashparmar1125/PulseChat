import { Image, Video, File } from "lucide-react";
import { motion } from "framer-motion";

export default function MediaSharingFeature() {
  return (
    <motion.div 
      // MATCHED: Container padding and overall hover effect
      className="bg-white dark:bg-pulse-white rounded-2xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 group hover-lift relative overflow-hidden"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Subtle brand accent - MATCHED */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pulse-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Header with Icon on Left - Sizing MATCHED */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-pulse-cyan/10 dark:bg-pulse-cyan/20 flex items-center justify-center flex-shrink-0 transition-all duration-300">
          {/* Main icon size MATCHED */}
          <Image className="w-6 h-6 sm:w-8 sm:h-8 text-pulse-cyan" />
        </div>
        <div>
          {/* Header text size MATCHED */}
          <h3 className="text-xl sm:text-2xl font-bold text-pulse-black dark:text-pulse-black mb-2">Seamless Media Sharing</h3>
          {/* Subheader text size MATCHED */}
          <p className="text-sm sm:text-base text-pulse-grey-text dark:text-pulse-grey-text">Share Life, Instantly</p>
        </div>
      </div>
      
      {/* Description - Spacing and Text style MATCHED */}
      <div className="space-y-4">
        <p className="text-pulse-black/80 dark:text-pulse-black/80 leading-relaxed">
          <strong className="font-semibold text-pulse-black dark:text-pulse-black">High-quality media without limits.</strong> Send photos, videos, and files instantly while maintaining their original quality.
        </p>
        
        {/* Feature Grid - MATCHED with the style of the first component */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          
          {/* Photo Card */}
          <div className="space-y-2">
            <div className="w-full h-20 bg-gradient-to-br from-pulse-cyan/20 to-pulse-cyan/5 dark:from-pulse-cyan/20 dark:to-pulse-cyan/5 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-pulse-cyan" />
            </div>
            <p className="text-xs font-semibold text-pulse-black dark:text-pulse-black text-center">Photos</p>
          </div>
          
          {/* Video Card */}
          <div className="space-y-2">
            <div className="w-full h-20 bg-gradient-to-br from-pulse-cyan/20 to-pulse-cyan/5 dark:from-pulse-cyan/20 dark:to-pulse-cyan/5 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-pulse-cyan" />
            </div>
            <p className="text-xs font-semibold text-pulse-black dark:text-pulse-black text-center">Videos</p>
          </div>
          
          {/* File Card */}
          <div className="space-y-2">
            <div className="w-full h-20 bg-gradient-to-br from-pulse-cyan/20 to-pulse-cyan/5 dark:from-pulse-cyan/20 dark:to-pulse-cyan/5 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-pulse-cyan" />
            </div>
            <p className="text-xs font-semibold text-pulse-black dark:text-pulse-black text-center">Files</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}