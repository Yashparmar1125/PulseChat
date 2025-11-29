import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/primitives/ScrollReveal";

export default function Pricing() {
  const pricingTiers = [
    {
      name: "Free",
      price: "0",
      description: "Everything you need to chat securely",
      features: [
        "End-to-end encryption",
        "Unlimited messages",
        "High-quality media sharing",
        "Custom themes",
        "All core features",
        "No time limits",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Premium",
      price: "4.99",
      description: "Extra features for power users",
      features: [
        "Everything in Free",
        "Cloud backup & sync",
        "Premium themes",
        "Custom notification sounds",
        "Priority support",
        "Advanced customization",
      ],
      highlighted: false,
      badge: null,
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-pulse-white relative overflow-hidden" aria-label="Pricing section">
      {/* Brand decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pulse-black dark:text-pulse-black mb-6 tracking-tight">
            Free Forever, <span className="brand-gradient">Premium</span> Optional
          </h2>
          <p className="text-xl text-pulse-black/80 dark:text-pulse-black/80 max-w-2xl mx-auto leading-relaxed">
            All core features are free. Upgrade for extra customization and cloud backup.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
              className={`relative rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300 hover-lift overflow-hidden ${
                tier.highlighted
                  ? "bg-white dark:bg-pulse-white border-2 border-pulse-cyan shadow-xl dark:shadow-xl"
                  : "bg-white dark:bg-pulse-white border border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:border-pulse-cyan dark:hover:border-pulse-cyan hover:shadow-lg dark:hover:shadow-xl"
              }`}
              whileHover={tier.highlighted ? { scale: 1.02 } : { scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pulse-cyan text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                  {tier.badge}
                </div>
              )}
              {!tier.highlighted && (
                <div className="absolute -top-3 -right-3 bg-pulse-cyan text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
                  Recommended
                </div>
              )}
              
              {/* Subtle brand accent for highlighted tier */}
              {tier.highlighted && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pulse-cyan to-transparent"></div>
              )}

              <h3 className="text-xl sm:text-2xl font-bold text-pulse-black dark:text-pulse-black mb-2">
                {tier.name}
              </h3>
              <p className="text-pulse-grey-text dark:text-pulse-grey-text text-sm mb-6">{tier.description}</p>

              <div className="mb-6">
                {tier.price === "0" ? (
                  <div>
                    <span className="text-4xl sm:text-5xl font-bold text-pulse-black dark:text-pulse-black">Free</span>
                    <span className="text-pulse-grey-text dark:text-pulse-grey-text ml-2 text-base sm:text-lg">Forever</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl sm:text-5xl font-bold text-pulse-black dark:text-pulse-black">
                      ${tier.price}
                    </span>
                    <span className="text-pulse-grey-text dark:text-pulse-grey-text ml-2 text-sm sm:text-base">/month</span>
                  </div>
                )}
              </div>

              <Button
                asChild
                className={`w-full mb-8 rounded-lg font-semibold py-6 h-auto ${
                  tier.highlighted
                    ? "bg-pulse-cyan hover:bg-pulse-cyan/90 text-white"
                    : "border border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light text-pulse-black dark:text-pulse-black"
                }`}
              >
                <Link to={tier.highlighted ? "/auth/signin" : "/auth/signup"}>
                  {tier.highlighted ? "Get Started Free" : "Upgrade to Premium"}
                </Link>
              </Button>

              <ul className="space-y-4">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-pulse-cyan flex-shrink-0" />
                    <span className="text-pulse-black/80 dark:text-pulse-black/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
