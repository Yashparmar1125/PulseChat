import BrandedUIUX from "./BrandedUIUX";
import ScrollReveal from "@/components/primitives/ScrollReveal";

export default function UIUXShowcase() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white" aria-label="UI/UX showcase section">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-pulse-black mb-4">
            Designed for Excellence
          </h2>
          <p className="text-xl text-pulse-black/70 max-w-2xl mx-auto">
            Every interaction, every animation, every detail crafted to deliver a premium experience
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-pulse-grey-subtle shadow-2xl">
            <BrandedUIUX className="w-full h-full" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4} className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold text-pulse-black mb-2">Smooth Animations</h3>
              <p className="text-sm text-pulse-black/70">
                Every transition is carefully crafted for fluid, natural motion
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pulse-black mb-2">Intuitive Flow</h3>
              <p className="text-sm text-pulse-black/70">
                User journey designed with clarity and purpose at every step
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pulse-black mb-2">Premium Polish</h3>
              <p className="text-sm text-pulse-black/70">
                Attention to detail that elevates the entire experience
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

