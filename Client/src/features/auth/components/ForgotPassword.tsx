import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Lock } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock password reset - replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex bg-white dark:bg-pulse-white">
        {/* Left Section - SVG and Content */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-pulse-cyan/5 via-pulse-grey-light/30 to-white dark:from-pulse-cyan/10 dark:via-pulse-grey-light/10 dark:to-pulse-white p-8 xl:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 w-full max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <img 
                src="/assets/svg/Authentication.svg" 
                alt="Email sent" 
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-3xl xl:text-4xl font-bold text-pulse-black dark:text-pulse-black">
                Check Your Email
              </h2>
              <p className="text-base xl:text-lg text-pulse-black/70 dark:text-pulse-black/80 leading-relaxed">
                We've sent password reset instructions to your email address.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Section - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-white dark:bg-pulse-white">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center"
            >
              <div className="w-20 h-20 bg-pulse-cyan/10 dark:bg-pulse-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-pulse-cyan" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-pulse-black dark:text-pulse-black mb-3 tracking-tight">
                Email Sent!
              </h1>
              <p className="text-pulse-black/70 dark:text-pulse-black/80 mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-pulse-black dark:text-pulse-black font-semibold mb-6">
                {email}
              </p>
              <p className="text-sm text-pulse-black/60 dark:text-pulse-black/70 mb-8">
                Click the link in the email to reset your password. If you don't see it, check your spam folder.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light"
                >
                  Resend Email
                </Button>
                <Link to="/auth/signin">
                  <Button variant="ghost" className="w-full text-pulse-black dark:text-pulse-black hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-pulse-white">
      {/* Left Section - SVG and Content */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-pulse-cyan/5 via-pulse-grey-light/30 to-white dark:from-pulse-cyan/10 dark:via-pulse-grey-light/10 dark:to-pulse-white p-8 xl:p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pulse-cyan/5 dark:bg-pulse-cyan/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link to="/" className="inline-block">
              <Logo />
            </Link>
          </motion.div>

          {/* SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src="/assets/svg/Authentication.svg" 
              alt="Authentication illustration" 
              className="w-full h-auto max-h-96 object-contain"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-3xl xl:text-4xl font-bold text-pulse-black dark:text-pulse-black">
              Reset Your Password
            </h2>
            <p className="text-base xl:text-lg text-pulse-black/70 dark:text-pulse-black/80 leading-relaxed">
              No worries! Enter your email and we'll send you instructions to reset your password securely.
            </p>
            <div className="flex items-center gap-2 text-sm text-pulse-grey-text dark:text-pulse-grey-text pt-2">
              <Lock className="w-4 h-4 text-pulse-cyan" />
              <span>Secure password reset process</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-white dark:bg-pulse-white overflow-y-auto">
        <div className="w-full max-w-md py-4 lg:py-0">
          {/* Mobile Logo - Only visible on mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 lg:hidden"
          >
            <Link to="/" className="inline-block">
              <Logo />
            </Link>
          </motion.div>

          {/* Forgot Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-pulse-black dark:text-pulse-black mb-2 tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-sm sm:text-base text-pulse-black/70 dark:text-pulse-black/80">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-pulse-black dark:text-pulse-black">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 text-sm bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-pulse-cyan hover:bg-pulse-cyan/90 text-white font-semibold text-sm sm:text-base rounded-xl transition-all hover-lift shadow-md mt-1"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-5 pt-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle text-center">
            <Link
              to="/auth/signin"
              className="text-xs sm:text-sm font-semibold text-pulse-cyan hover:text-pulse-cyan/80 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

