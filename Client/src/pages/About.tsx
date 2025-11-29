import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-pulse-white flex flex-col">
      <Header />
      <main className="flex-1 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Brand background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pulse-cyan/3 dark:bg-pulse-cyan/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pulse-black dark:text-pulse-black tracking-tight">
            About <span className="brand-gradient">PULSE</span>
          </h1>
          <p className="text-xl text-pulse-black/70 dark:text-pulse-black/80 leading-relaxed">
            This page is ready to be customized with the story of PULSE, team information, and company details.
          </p>
          <p className="text-pulse-black/60 dark:text-pulse-black/70">
            Prompt the user to continue building out this page if they'd like to add company mission, team bios, or company history.
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="rounded-xl border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:border-pulse-cyan dark:hover:border-pulse-cyan hover-lift"
          >
            Back to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
