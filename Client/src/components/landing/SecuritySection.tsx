import { Shield, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/primitives/ScrollReveal";

export default function SecuritySection() {
  const securityFeatures = [
    {
      category: "Always Encrypted",
      icon: Lock,
      items: [
        "End-to-end encryption on every message",
        "Your data stays private, always",
      ],
    },
    {
      category: "You're in Control",
      icon: Shield,
      items: [
        "Choose who can message you",
        "Block and report unwanted contacts",
      ],
    },
    {
      category: "Private by Default",
      icon: CheckCircle2,
      items: [
        "No tracking or data collection",
        "Your conversations belong to you",
      ],
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-pulse-white relative overflow-hidden" aria-label="Security section">
      {/* Brand decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="bg-white dark:bg-pulse-white rounded-2xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-2xl dark:hover:shadow-[0_16px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover-lift">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left - Icon with Gentle Pulse Animation */}
            <div className="lg:w-1/3 bg-pulse-cyan/5 p-6 sm:p-8 lg:p-12 flex items-center justify-center relative min-h-[200px] sm:min-h-[250px] lg:min-h-0">
              <motion.div
                className="absolute w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-pulse-cyan/15"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.4, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-pulse-cyan/10"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <motion.div
                className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-pulse-cyan text-white flex items-center justify-center shadow-xl z-10"
                animate={{
                  boxShadow: [
                    "0 20px 25px -5px rgba(0, 204, 255, 0.3), 0 10px 10px -5px rgba(0, 204, 255, 0.2)",
                    "0 20px 25px -5px rgba(0, 204, 255, 0.4), 0 10px 10px -5px rgba(0, 204, 255, 0.3)",
                    "0 20px 25px -5px rgba(0, 204, 255, 0.3), 0 10px 10px -5px rgba(0, 204, 255, 0.2)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Shield className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
              </motion.div>
            </div>

            {/* Right - Content */}
            <div className="lg:w-2/3 p-6 sm:p-8 lg:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pulse-black dark:text-pulse-black mb-4">
                Your Privacy is Our Priority
              </h2>
              <p className="text-pulse-black/80 dark:text-pulse-black/80 mb-8">
                We built PULSE with privacy at its core. Your conversations stay between you and the people you're chatting with—no exceptions.
              </p>

              <div className="space-y-6">
                {securityFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pulse-cyan/10 text-pulse-cyan flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-pulse-black dark:text-pulse-black">
                          {feature.category}
                        </h3>
                      </div>
                      <ul className="ml-11 space-y-2">
                        {feature.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-pulse-black/80 dark:text-pulse-black/80">
                            <svg className="w-4 h-4 text-pulse-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
