import { motion } from "framer-motion";

interface PulseIndicatorProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PulseIndicator({ size = "md", className = "" }: PulseIndicatorProps) {
  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-12 h-6",
    lg: "w-16 h-8",
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 0,25 L 10,25 L 12,15 L 15,35 L 18,20 L 20,30 L 25,25 L 30,25 L 35,20 L 40,30 L 45,15 L 50,35 L 55,25 L 60,25 L 65,20 L 70,30 L 75,15 L 80,35 L 85,25 L 90,25 L 100,25"
          stroke="#00CCFF"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.5 },
          }}
        />
      </svg>
    </div>
  );
}

