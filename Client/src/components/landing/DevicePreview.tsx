import ScrollReveal from "@/components/primitives/ScrollReveal";
import { motion } from "framer-motion";

export default function DevicePreview() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-pulse-grey-light dark:bg-pulse-grey-light/20" aria-label="Device preview section">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-pulse-black dark:text-pulse-black mb-4">
            Works Everywhere
          </h2>
          <p className="text-xl text-pulse-black/80 dark:text-pulse-black/80 max-w-2xl mx-auto">
            Seamless experience across all your devices with zero-latency sync
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Desktop Preview */}
          <ScrollReveal delay={0.1} direction="left" className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="bg-pulse-black dark:bg-pulse-white rounded-2xl p-2 shadow-2xl dark:shadow-2xl">
                <div className="bg-white dark:bg-pulse-white rounded-lg overflow-hidden border border-pulse-grey-subtle dark:border-pulse-grey-subtle">
                  <div className="bg-pulse-cyan h-12 flex items-center px-4 shadow-md">
                    <div className="text-white text-sm font-semibold">
                      PULSE
                    </div>
                  </div>
                  <div className="h-64 bg-gray-50 dark:bg-pulse-grey-light flex flex-col p-4 space-y-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-300 dark:bg-purple-400 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-4 rounded w-3/4 mb-2"></div>
                        <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-3 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="flex-1">
                        <div className="bg-pulse-cyan h-4 rounded w-1/2 ml-auto mb-2"></div>
                        <div className="bg-pulse-cyan h-3 rounded w-1/3 ml-auto"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-pulse-cyan/30 flex-shrink-0"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-300 dark:bg-blue-400 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-4 rounded w-2/3 mb-2"></div>
                        <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-3 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-pulse-grey-subtle p-4 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-full border border-gray-300 dark:border-pulse-grey-subtle px-3 py-1 text-xs bg-white dark:bg-pulse-white text-gray-900 dark:text-pulse-black placeholder:text-gray-500 dark:placeholder:text-pulse-grey-text"
                      placeholder="Type..."
                      disabled
                    />
                    <button className="w-6 h-6 rounded-full bg-pulse-cyan"></button>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white dark:bg-pulse-white rounded-xl shadow-lg dark:shadow-xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 animate-float">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-xs font-semibold text-gray-900 dark:text-pulse-black">💬 3 new</p>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Mobile Preview */}
          <ScrollReveal delay={0.2} direction="right" className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="max-w-sm mx-auto">
                <div className="bg-black dark:bg-pulse-white rounded-3xl p-2 shadow-2xl dark:shadow-2xl">
                  <div className="bg-white dark:bg-pulse-white rounded-2xl overflow-hidden border border-pulse-grey-subtle dark:border-pulse-grey-subtle">
                    {/* Notch */}
                    <div className="h-6 bg-black dark:bg-pulse-white rounded-b-3xl flex justify-center items-center">
                      <div className="text-white dark:text-pulse-black text-xs">9:41</div>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-pulse-white">
                      <div className="bg-pulse-cyan h-16 flex items-center px-4 justify-between shadow-md">
                        <div className="text-white text-sm font-semibold">
                          PULSE
                        </div>
                        <div className="text-white text-xl">⋮</div>
                      </div>

                      <div className="h-64 bg-gray-50 dark:bg-pulse-grey-light flex flex-col p-4 space-y-3">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-300 dark:bg-orange-400 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-3 rounded w-2/3 mb-1"></div>
                            <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-2 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-400 dark:bg-blue-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-3 rounded w-3/4 mb-1"></div>
                            <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-2 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-pink-400 dark:bg-pink-500 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-3 rounded w-2/3 mb-1"></div>
                            <div className="bg-gray-200 dark:bg-pulse-grey-subtle h-2 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-pulse-grey-subtle p-3 flex gap-2">
                        <input
                          type="text"
                          className="flex-1 rounded-full border border-gray-300 dark:border-pulse-grey-subtle px-3 py-1 text-xs bg-white dark:bg-pulse-white text-gray-900 dark:text-pulse-black placeholder:text-gray-500 dark:placeholder:text-pulse-grey-text"
                          placeholder="Message..."
                          disabled
                        />
                        <button className="w-6 h-6 rounded-full bg-pulse-cyan shadow-sm"></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating element */}
              <div
                className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white dark:bg-pulse-white rounded-xl shadow-lg dark:shadow-xl border border-pulse-grey-subtle dark:border-pulse-grey-subtle px-3 py-1.5 sm:px-4 sm:py-2 animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <p className="text-xs font-semibold text-gray-900 dark:text-pulse-black">Typing...</p>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
