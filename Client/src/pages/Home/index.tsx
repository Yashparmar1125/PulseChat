import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import FeatureHighlights from "@/components/landing/FeatureHighlights";
import FeatureGrid from "@/components/landing/FeatureGrid";
import SecuritySection from "@/components/landing/SecuritySection";
import DevicePreview from "@/components/landing/DevicePreview";
import UseCases from "@/components/landing/UseCases";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-pulse-white dark:bg-pulse-white">
      <Header />
      <Hero />
      <FeatureHighlights />
      <FeatureGrid />
      <SecuritySection />
      <DevicePreview />
      <UseCases />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
