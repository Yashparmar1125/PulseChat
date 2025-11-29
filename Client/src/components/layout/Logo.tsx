import { motion } from "framer-motion";

interface LogoProps {
  variant?: "default" | "compact";
  showText?: boolean;
  className?: string;
}

export default function Logo({ variant = "default", showText = true, className = "" }: LogoProps) {
  const size = variant === "compact" ? 40 : 48;
  const strokeWidth = variant === "compact" ? 2 : 2.5;

  // --- ENHANCEMENT: Using the requested color #00DDFF ---
  const electricCyan = "#00DDFF"; // Your specified vibrant cyan
  const blackText = "hsl(0 0% 10%)"; // A very dark gray for softer contrast

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Chat Bubble with ECG Line */}
      <div className="relative flex-shrink-0">
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Chat Bubble Shape with pointer - Smoother curves */}
          <path
            d="M12 9C8.13401 9 5 12.134 5 16V29C5 32.866 8.13401 36 12 36H16.5L20 41L18 36H36C39.866 36 43 32.866 43 29V16C43 12.134 39.866 9 36 9H12Z"
            stroke={electricCyan} // Applied #00DDFF
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pointer/Tail of chat bubble (bottom-left) - Filled for solid look */}
          <path
            d="M16.5 36L20 41L18 36H16.5Z"
            fill={electricCyan} // Applied #00DDFF
            stroke={electricCyan}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* ECG/Heartbeat Line Inside Bubble - Dynamic waveform */}
          <motion.path
            d="M13 24 H 15 L 16.5 18 L 19 30 L 21.5 20 L 24 28 L 26.5 24 H 30 L 32 20 L 34 28 L 36 24"
            stroke={electricCyan} // Applied #00DDFF
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1.2, ease: "easeOut" },
              opacity: { duration: 0.3 },
              delay: 0.2
            }}
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            style={{ color: electricCyan }} // Applied #00DDFF
            className={`font-extrabold tracking-tight ${
              variant === "compact" ? "text-lg" : "text-xl"
            }`}
          >
            PULSE
          </span>
          <span
            className={`font-semibold text-pulse-black/70 dark:text-pulse-black/80 ${
              variant === "compact" ? "text-xs -mt-0.5" : "text-sm -mt-0.5"
            }`}
          >
            Chat
          </span>
        </div>
      )}
    </div>
  );
}