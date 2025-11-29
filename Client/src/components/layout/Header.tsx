import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/features/auth";
import Logo from "./Logo";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Documentation", href: "/documentation" },
    { label: "About", href: "/about" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-white/95 dark:bg-pulse-white/95 backdrop-blur-xl dark:backdrop-blur-xl border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle transition-shadow"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="group" onClick={() => setMobileMenuOpen(false)}>
            <Logo variant="compact" className="group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-pulse-black/70 dark:text-pulse-black/80 hover:text-pulse-black dark:hover:text-pulse-black font-medium transition-colors text-sm relative group focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:ring-offset-2 rounded px-2 py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pulse-cyan transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profilePicUrl} alt={user.username || "User"} />
                      <AvatarFallback className="bg-pulse-cyan text-white text-xs font-semibold">
                        {(user.username || user.email?.split("@")[0] || "User")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold text-pulse-black dark:text-pulse-black">
                      {user.username}
                    </p>
                    <p className="text-xs text-pulse-black/70 dark:text-pulse-black/80">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/chat" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Chat
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild
                className="bg-pulse-cyan hover:bg-pulse-cyan/90 text-white font-semibold text-sm px-4 lg:px-6 transition-all hover:scale-105 active:scale-95 focus:ring-4 focus:ring-pulse-cyan/50 focus:outline-none"
              >
                <Link to="/auth/signin" aria-label="Get started with PULSE for free">
                  Get Started Free
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-colors focus:outline-none focus:ring-2 focus:ring-pulse-cyan"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="py-4 space-y-2 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle" role="navigation" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-pulse-black/70 dark:text-pulse-black/80 hover:text-pulse-black dark:hover:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pulse-cyan"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <div className="pt-2 px-4 space-y-2">
                    <div className="flex items-center justify-between px-2 py-2">
                      <span className="text-sm font-medium text-pulse-black dark:text-pulse-black">Theme</span>
                      <ThemeToggle />
                    </div>
                    <Button 
                      asChild
                      variant="outline"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/chat">Chat</Link>
                    </Button>
                    <Button 
                      asChild
                      variant="outline"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/settings">Settings</Link>
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2 px-4">
                    <Button 
                      asChild
                      className="w-full bg-pulse-cyan hover:bg-pulse-cyan/90 text-white font-semibold py-3 transition-all focus:ring-4 focus:ring-pulse-cyan/50 focus:outline-none"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Get started with PULSE for free"
                    >
                      <Link to="/auth/signin">Get Started Free</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
