import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import PulseChatMockup from "./PulseChatMockup";
import PulseIndicator from "./PulseIndicator";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/primitives/ScrollReveal";

export default function Hero() {
  const trustIndicators = [
    { icon: Shield, text: "End-to-End Encrypted" },
    { icon: Zap, text: "Zero-Lag Messaging" },
    { icon: Lock, text: "Private by Default" },
  ];

  return (
    <section 
      // Main container uses flex to vertically center the content in the viewport
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-white via-pulse-grey-light/30 to-white dark:from-pulse-white dark:via-pulse-grey-light/10 dark:to-pulse-white"
      aria-label="Hero section"
    >
      {/* Premium brand background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        
        {/* Subtle ECG line decoration */}
        <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" style={{ zIndex: 0 }}>
          <motion.path
            d="M 0,200 Q 200,180 400,200 T 800,200 T 1200,200 T 1600,200"
            stroke="hsl(var(--pulse-cyan))"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="8,8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              pathLength: { duration: 4, repeat: Infinity, ease: "linear" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </svg>
      </div>

      {/* Inner container with tighter top/bottom padding to respect header/footer space */}
      <div className="max-w-7xl mx-auto relative z-10 w-full pt-8 pb-12"> 
        {/* Grid layout (FINAL 8/4 split achieved via 12-column grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left side - Content (Takes 8/12ths of the space, allowing more room for the headline) */}
          <div className="lg:col-span-8 space-y-3 lg:space-y-4"> 
            
            {/* Badge */}
            <ScrollReveal delay={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-pulse-cyan/10 dark:bg-pulse-cyan/20 border border-pulse-cyan/30 dark:border-pulse-cyan/40 rounded-full mb-3 lg:mb-4 backdrop-blur-sm" 
              >
                <PulseIndicator size="sm" />
                <span className="text-xs sm:text-sm font-semibold text-pulse-cyan uppercase tracking-wider">
                  Private & Secure
                </span>
                <motion.div
                  className="w-2 h-2 bg-pulse-cyan rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </ScrollReveal>

            {/* Headline - FINAL FONT SIZE REDUCTION */}
            <ScrollReveal delay={0.2}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                // Reduced size to 6xl for better fit, maintained tight leading
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-pulse-black dark:text-pulse-black leading-[1.05] mb-5 lg:mb-6 tracking-tight" 
              >
                <span className="tracking-tighter block">Private Messaging</span>
                <span className="tracking-tighter block">That Just</span>
                <span className="tracking-tighter block">
                  <motion.span 
                    className="text-pulse-cyan brand-gradient inline-block"
                    animate={{ 
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Works.
                  </motion.span>
                </span>
                <motion.span
                  // Reduced subtitle size slightly
                  className="block mt-3 lg:mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold text-pulse-black/60 dark:text-pulse-black/70 tracking-normal" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Secured by Design.
                </motion.span>
              </motion.h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={0.3}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-sm sm:text-base lg:text-lg text-pulse-black/80 dark:text-pulse-black/80 max-w-lg leading-relaxed mb-4 sm:mb-5 lg:mb-6"
              >
                Simple, secure messaging that keeps your conversations private. 
                <span className="font-semibold text-pulse-black"> End-to-end encryption by default</span>, 
                so you can chat with confidence.
              </motion.p>
            </ScrollReveal>

            {/* Trust Indicators */}
            <ScrollReveal delay={0.35}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 pt-1"
              >
                {trustIndicators.map((indicator, index) => {
                  const Icon = indicator.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-xs sm:text-sm text-pulse-black/80 dark:text-pulse-black/80"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-4 h-4 text-pulse-cyan" />
                      <span className="font-medium">{indicator.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={0.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 pt-6 lg:pt-8"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    asChild
                    className="relative bg-pulse-cyan hover:bg-pulse-cyan/90 text-white font-semibold py-4 px-8 text-base sm:text-lg h-auto rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all overflow-hidden group focus:ring-4 focus:ring-pulse-cyan/50 focus:outline-none hover-lift"
                  >
                    <Link to="/auth/signin" aria-label="Get started with PULSE for free">
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                      <span className="relative z-10">Get Started Free</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    variant="outline"
                    className="border-2 border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:border-pulse-cyan text-pulse-black dark:text-pulse-black hover:text-pulse-cyan hover:bg-pulse-cyan/5 dark:hover:bg-pulse-cyan/10 font-semibold py-4 px-6 text-base sm:text-lg h-auto rounded-xl transition-all focus:ring-4 focus:ring-pulse-cyan/50 focus:outline-none"
                    aria-label="Learn more about PULSE"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </ScrollReveal>

            {/* Social Proof */}
            <ScrollReveal delay={0.5}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-3 pt-3"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-pulse-cyan to-pulse-cyan/60 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                    >
                      {i}
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm text-pulse-black/60 dark:text-pulse-black/70">
                  <span className="font-semibold text-pulse-black dark:text-pulse-black">10,000+</span> users trust PULSE
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Right side - Animated Chat Mockup (Takes 4/12ths of the space) */}
          <ScrollReveal delay={0.6} direction="right" className="lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.25, 0, 1] }}
              className="relative"
            >
              {/* Chatting SVG Background - Natural decoration */}
              <div className="absolute -inset-8 opacity-30 dark:opacity-20 -z-10 hidden lg:block">
                <img 
                  src="/assets/svg/Chatting.svg" 
                  alt="Chatting illustration" 
                  className="w-full h-full object-contain"
                />
              </div>
              {/* NOTE: We assume PulseChatMockup component is scaled internally to fit this column width */}
              <motion.div
                className="absolute -inset-4 bg-pulse-cyan/20 rounded-3xl blur-2xl -z-10"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <PulseChatMockup />
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
