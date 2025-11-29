import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/landing/Pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-pulse-white flex flex-col">
      <Header />
      <main className="flex-1">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
