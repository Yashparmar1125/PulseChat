import { motion } from "framer-motion";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = "Loading...", fullScreen = false }: LoadingProps) {
  const containerClass = fullScreen
    ? "h-screen flex items-center justify-center bg-white dark:bg-pulse-white"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <img
            src="/assets/svg/Loading.svg"
            alt="Loading"
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-pulse-black/70 dark:text-pulse-black/80"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}

