import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Documentation from "./pages/Documentation";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { SignIn, SignUp, ForgotPassword } from "./features/auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

const App = () => (
  <ThemeProvider>
    <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/features" element={<Features />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/documentation" element={<Documentation />} />
    <Route path="/about" element={<About />} />
    
    {/* Auth Routes */}
    <Route path="/auth/signin" element={<SignIn />} />
    <Route path="/auth/signup" element={<SignUp />} />
    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
    
    {/* Protected Routes */}
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  </ThemeProvider>
);

export default App;
