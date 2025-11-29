import "./styles/globals.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import SmoothScroll from "./components/primitives/SmoothScroll";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);

root.render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SmoothScroll />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

