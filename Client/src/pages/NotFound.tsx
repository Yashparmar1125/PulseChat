import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-pulse-white relative overflow-hidden">
      {/* Brand background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center relative z-10 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* 404 SVG Illustration */}
          <div className="w-full max-w-md mb-8">
            <img 
              src="/assets/svg/404 Page Not Found.svg" 
              alt="404 Page Not Found" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-pulse-black dark:text-pulse-black mb-4 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-lg sm:text-xl text-pulse-black/70 dark:text-pulse-black/80 mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pulse-cyan hover:bg-pulse-cyan/90 text-white font-semibold rounded-xl transition-all hover-lift shadow-md"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
