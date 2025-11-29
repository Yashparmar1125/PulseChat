import PrivacyFeature from "./PrivacyFeature";
import MediaSharingFeature from "./MediaSharingFeature";
import CustomizationFeature from "./CustomizationFeature";
import ScrollReveal from "@/components/primitives/ScrollReveal";
import PulseIndicator from "./PulseIndicator";
import { motion } from "framer-motion";

export default function FeatureHighlights() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-pulse-white relative overflow-hidden" aria-label="Features section">
      {/* Subtle brand decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <PulseIndicator size="sm" />
            <span className="text-sm font-semibold text-pulse-cyan uppercase tracking-wider">Features</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pulse-black dark:text-pulse-black mb-6 tracking-tight">
            Connect Without <span className="brand-gradient">Compromise</span>
          </h2>
          <p className="text-xl text-pulse-black/80 dark:text-pulse-black/80 max-w-2xl mx-auto leading-relaxed">
            Simple, secure messaging designed for how you actually chat
          </p>
        </ScrollReveal>

        {/* Z-Pattern Layout */}
        <div className="space-y-8">
          {/* Row 1: Privacy (Full Width) */}
          <ScrollReveal delay={0.1}>
            <PrivacyFeature />
          </ScrollReveal>

          {/* Row 2: Media Sharing (Left) + Customization (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScrollReveal delay={0.2} direction="left">
              <MediaSharingFeature />
            </ScrollReveal>
            <ScrollReveal delay={0.3} direction="right">
              <CustomizationFeature />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
