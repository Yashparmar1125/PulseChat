import ScrollReveal from "@/components/primitives/ScrollReveal";
import { motion } from "framer-motion";

export default function UseCases() {
  const useCases = [
    {
      svg: "/assets/svg/User Group.svg",
      title: "College Groups",
      description: "Organize study groups and campus communities",
    },
    {
      svg: "/assets/svg/Team Brainstorming 4.svg",
      title: "Tech Teams",
      description: "Collaborate with developers and engineers worldwide",
    },
    {
      svg: "/assets/svg/Target Audience.svg",
      title: "Gaming Squads",
      description: "Coordinate with your gaming crew seamlessly",
    },
    {
      svg: "/assets/svg/Achievement.svg",
      title: "Friend Circles",
      description: "Stay connected with your closest friends",
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-pulse-white relative overflow-hidden" aria-label="Use cases section">
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pulse-black dark:text-pulse-black mb-6 tracking-tight">
            Perfect for <span className="brand-gradient">Everyone</span>
          </h2>
          <p className="text-xl text-pulse-black/80 dark:text-pulse-black/80 max-w-2xl mx-auto leading-relaxed">
            Whether you're chatting with friends, family, or colleagues, PULSE keeps your conversations private
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {useCases.map((useCase, index) => {
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  className="group bg-white dark:bg-pulse-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:border-pulse-cyan/50 dark:hover:border-pulse-cyan/50 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Subtle brand accent on hover */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pulse-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* SVG as the main visual element */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mb-5 rounded-2xl bg-gradient-to-br from-pulse-cyan/10 to-pulse-cyan/5 dark:from-pulse-cyan/20 dark:to-pulse-cyan/10 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 border border-pulse-cyan/20 dark:border-pulse-cyan/30 p-3">
                    <img 
                      src={useCase.svg} 
                      alt={useCase.title} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-pulse-black dark:text-pulse-black mb-2.5">
                    {useCase.title}
                  </h3>
                  <p className="text-sm sm:text-base text-pulse-grey-text dark:text-pulse-grey-text leading-relaxed">{useCase.description}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
