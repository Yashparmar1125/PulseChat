import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/primitives/ScrollReveal";
import PulseIndicator from "./PulseIndicator";

export default function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-pulse-grey-light dark:bg-pulse-grey-light/20 overflow-hidden relative" aria-label="Call to action section">
      {/* Premium brand background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pulse-cyan/10 dark:bg-pulse-cyan/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }}></div>
        
        {/* ECG line decoration */}
        <svg className="absolute inset-0 w-full h-full opacity-15 dark:opacity-10">
          <motion.path
            d="M 0,300 Q 300,280 600,300 T 1200,300 T 1800,300"
            stroke="hsl(var(--pulse-cyan))"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10,10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              pathLength: { duration: 5, repeat: Infinity, ease: "linear" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <ScrollReveal delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <PulseIndicator size="sm" />
            <span className="text-sm font-semibold text-pulse-cyan uppercase tracking-wider">Ready to Start?</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-pulse-black dark:text-pulse-black px-4 tracking-tight">
            Start Chatting <span className="brand-gradient">Securely</span> Today
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-base sm:text-lg lg:text-xl text-pulse-black/80 dark:text-pulse-black/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands who trust PULSE for their private conversations. Free forever, no credit card required.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              asChild
              className="relative bg-pulse-cyan hover:bg-pulse-cyan/90 text-white font-bold py-5 px-8 sm:py-6 sm:px-10 text-base sm:text-lg h-auto rounded-xl flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all overflow-hidden group focus:ring-4 focus:ring-pulse-cyan/50 focus:outline-none hover-lift"
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
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70 mt-6">
            No credit card required. Set up in minutes.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
