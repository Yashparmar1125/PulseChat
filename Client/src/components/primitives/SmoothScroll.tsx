import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Custom smooth scroll for better performance
    let isScrolling = false;
    
    const handleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return null;
}

