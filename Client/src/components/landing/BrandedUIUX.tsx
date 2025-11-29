import { motion } from "framer-motion";

interface BrandedUIUXProps {
  className?: string;
}

export default function BrandedUIUX({ className = "" }: BrandedUIUXProps) {
  const electricCyan = "#00DDFF";
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-pulse-grey-light/30 to-white" />
      
      {/* Animated ECG/Pulse Lines connecting UI elements */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {/* Main pulse line flowing through sections */}
        <motion.path
          d="M 50 100 Q 200 80, 350 100 T 650 100 T 950 100"
          stroke={electricCyan}
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          opacity="0.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            pathLength: { duration: 3, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        
        {/* Secondary pulse lines */}
        <motion.path
          d="M 100 300 Q 250 280, 400 300 T 700 300"
          stroke={electricCyan}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3,3"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            pathLength: { duration: 4, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            delay: 0.5,
          }}
        />
      </svg>

      {/* UI Sections */}
      <div className="relative z-10 p-8 space-y-6">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="h-16 bg-white rounded-xl border border-pulse-grey-subtle shadow-sm flex items-center px-6">
            {/* Logo placeholder */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border-2 border-pulse-grey-subtle flex items-center justify-center">
                <div className="w-6 h-6 rounded border-2" style={{ borderColor: electricCyan }} />
              </div>
              <div className="h-4 w-24 bg-pulse-grey-subtle rounded" />
            </div>
            
            {/* Navigation dots */}
            <div className="flex gap-4 ml-auto">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-pulse-grey-subtle"
                  animate={{
                    backgroundColor: i === 1 ? electricCyan : undefined,
                    scale: i === 1 ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            
            {/* CTA Button */}
            <motion.div
              className="ml-6 h-10 w-32 rounded-lg"
              style={{ backgroundColor: electricCyan }}
              animate={{
                boxShadow: [
                  `0 0 0px ${electricCyan}`,
                  `0 0 20px ${electricCyan}40`,
                  `0 0 0px ${electricCyan}`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          
          {/* Glowing underline */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5"
            style={{ backgroundColor: electricCyan }}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="bg-white rounded-xl border border-pulse-grey-subtle shadow-sm p-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left: Content blocks */}
              <div className="space-y-4">
                <div className="h-3 w-32 bg-pulse-grey-subtle rounded" />
                <div className="h-8 w-3/4 bg-pulse-grey-subtle rounded" />
                <div className="h-8 w-2/3 bg-pulse-grey-subtle rounded" />
                <div className="h-4 w-full bg-pulse-grey-subtle rounded mt-4" />
                <div className="h-4 w-5/6 bg-pulse-grey-subtle rounded" />
                
                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <motion.div
                    className="h-12 w-40 rounded-lg"
                    style={{ backgroundColor: electricCyan }}
                    whileHover={{ scale: 1.05 }}
                    animate={{
                      boxShadow: [
                        `0 4px 12px ${electricCyan}40`,
                        `0 4px 20px ${electricCyan}60`,
                        `0 4px 12px ${electricCyan}40`,
                      ],
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />
                  <div className="h-12 w-32 rounded-lg border-2 border-pulse-grey-subtle" />
                </div>
              </div>
              
              {/* Right: Feature card */}
              <div className="bg-pulse-grey-light rounded-xl p-6 border border-pulse-grey-subtle">
                <div className="space-y-3">
                  <div className="h-6 w-6 rounded-lg mx-auto" style={{ backgroundColor: electricCyan }} />
                  <div className="h-3 w-24 bg-pulse-grey-subtle rounded mx-auto" />
                  <div className="h-2 w-full bg-pulse-grey-subtle rounded mt-4" />
                  <div className="h-2 w-5/6 bg-pulse-grey-subtle rounded" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Pulse indicator */}
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
            style={{ backgroundColor: electricCyan }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl border border-pulse-grey-subtle shadow-sm p-6 relative overflow-hidden"
              whileHover={{ scale: 1.02, borderColor: electricCyan }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon placeholder */}
              <div className="h-12 w-12 rounded-lg mb-4" style={{ backgroundColor: `${electricCyan}20` }}>
                <div className="h-6 w-6 rounded mx-auto mt-3" style={{ backgroundColor: electricCyan }} />
              </div>
              
              {/* Content lines */}
              <div className="h-3 w-20 bg-pulse-grey-subtle rounded mb-2" />
              <div className="h-2 w-full bg-pulse-grey-subtle rounded mb-1" />
              <div className="h-2 w-4/5 bg-pulse-grey-subtle rounded" />
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ 
                  background: `linear-gradient(135deg, ${electricCyan}00, ${electricCyan}10)`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              
              {/* Active indicator */}
              {i === 1 && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: electricCyan }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <div className="bg-white rounded-xl border-2 border-pulse-grey-subtle shadow-lg p-8 text-center">
            <div className="h-6 w-48 bg-pulse-grey-subtle rounded mx-auto mb-4" />
            <div className="h-4 w-64 bg-pulse-grey-subtle rounded mx-auto mb-6" />
            
            <motion.div
              className="h-14 w-48 rounded-xl mx-auto"
              style={{ backgroundColor: electricCyan }}
              animate={{
                boxShadow: [
                  `0 4px 20px ${electricCyan}40`,
                  `0 8px 30px ${electricCyan}60`,
                  `0 4px 20px ${electricCyan}40`,
                ],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          
          {/* Connecting pulse line */}
          <motion.div
            className="absolute -left-4 top-1/2 w-1 h-20 rounded-full"
            style={{ backgroundColor: electricCyan }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Floating particles/indicators */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            backgroundColor: electricCyan,
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

