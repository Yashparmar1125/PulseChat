import { Activity, Headphones, Radio, Layers, Clock, Users } from "lucide-react";
import ScrollReveal from "@/components/primitives/ScrollReveal";
import { motion } from "framer-motion";

export default function FeatureGrid() {
  const groupedFeatures = [
    {
      title: "Personal Control",
      description: "Manage your messaging experience your way",
      features: [
        { icon: Clock, title: "Read Receipts", description: "See when your messages are delivered and read" },
        { icon: Layers, title: "Organized Chats", description: "Keep your conversations organized and easy to find" },
        { icon: Radio, title: "Always Connected", description: "Stay in touch with reliable, instant messaging" },
      ],
    },
    {
      title: "Cloud Freedom",
      description: "Backup, sync, and access your messages anywhere",
      features: [
        { icon: Headphones, title: "Voice Messages", description: "Send crystal-clear voice messages with one tap" },
        { icon: Users, title: "Group Chats", description: "Chat with friends and family in secure groups" },
        { icon: Activity, title: "Fast & Reliable", description: "Messages delivered instantly, every time" },
      ],
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-pulse-grey-light/50 dark:bg-pulse-grey-light/20 relative overflow-hidden" aria-label="Features section">
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pulse-black dark:text-pulse-black mb-6 tracking-tight">
            Simple Features That <span className="brand-gradient">Matter</span>
          </h2>
          <p className="text-xl text-pulse-black/80 dark:text-pulse-black/80 max-w-2xl mx-auto leading-relaxed">
            Everything you need for private, reliable messaging
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groupedFeatures.map((group, groupIndex) => (
            <ScrollReveal key={groupIndex} delay={groupIndex * 0.1}>
              <motion.div
                className="bg-white dark:bg-pulse-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:border-pulse-cyan dark:hover:border-pulse-cyan transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover-lift relative overflow-hidden"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Subtle brand accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pulse-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-xl sm:text-2xl font-bold text-pulse-black dark:text-pulse-black mb-2">
                {group.title}
              </h3>
              <p className="text-pulse-grey-text dark:text-pulse-grey-text mb-6">{group.description}</p>
              <ul className="space-y-4">
                {group.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-pulse-cyan/10 dark:bg-pulse-cyan/20 text-pulse-cyan flex items-center justify-center flex-shrink-0 border border-pulse-cyan/20 dark:border-pulse-cyan/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-pulse-black dark:text-pulse-black mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-pulse-grey-text dark:text-pulse-grey-text">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
