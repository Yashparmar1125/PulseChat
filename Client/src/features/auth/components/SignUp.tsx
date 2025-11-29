import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { motion } from "framer-motion";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { useAuth } from "../hooks/useAuth";

// Social login icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z" />
    <path fill="#00A4EF" d="M13 1h10v10H13z" />
    <path fill="#7FBA00" d="M1 13h10v10H1z" />
    <path fill="#FFB900" d="M13 13h10v10H13z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, socialLogin, resendVerificationEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms,
      });
      
      // Check if email verification is needed
      if (result?.needsVerification) {
        setUserEmail(formData.email);
        setShowVerificationMessage(true);
      } else {
        navigate("/chat");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create account. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await resendVerificationEmail();
      setErrors({ submit: "Verification email sent! Please check your inbox." });
    } catch (err: any) {
      setErrors({ submit: err?.message || "Failed to resend verification email." });
    } finally {
      setIsLoading(false);
    }
  };


  
  const handleSocialLogin = async (provider: "google" | "microsoft" | "linkedin") => {
    setErrors({});
    setIsLoading(true);
    try {
      await socialLogin(provider);
      navigate("/chat");
    } catch (err: any) {
      setErrors({ submit: err.message || `Failed to sign up with ${provider}. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

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
              Join <span className="text-pulse-cyan">PULSE</span> Today
            </h2>
            <p className="text-base xl:text-lg text-pulse-black/70 dark:text-pulse-black/80 leading-relaxed">
              Create your account and start chatting securely. Free forever with end-to-end encryption by default.
            </p>
            <div className="flex items-center gap-2 text-sm text-pulse-grey-text dark:text-pulse-grey-text pt-2">
              <Lock className="w-4 h-4 text-pulse-cyan" />
              <span>End-to-end encrypted by default</span>
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

          {/* Sign Up Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-pulse-black dark:text-pulse-black mb-2 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-sm sm:text-base text-pulse-black/70 dark:text-pulse-black/80">
              Join <span className="text-pulse-cyan font-semibold">PULSE</span> and start chatting securely
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
            <motion.button
              type="button"
              onClick={() => handleSocialLogin("google")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-11 px-3 sm:px-4 bg-white dark:bg-pulse-white border border-pulse-grey-subtle dark:border-pulse-grey-subtle rounded-lg hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-all text-sm font-medium text-pulse-black dark:text-pulse-black shadow-sm hover:shadow-md"
            >
              <GoogleIcon />
              <span className="hidden sm:inline">Google</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleSocialLogin("microsoft")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-11 px-3 sm:px-4 bg-white dark:bg-pulse-white border border-pulse-grey-subtle dark:border-pulse-grey-subtle rounded-lg hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-all text-sm font-medium text-pulse-black dark:text-pulse-black shadow-sm hover:shadow-md"
            >
              <MicrosoftIcon />
              <span className="hidden sm:inline">MS</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleSocialLogin("linkedin")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-11 px-3 sm:px-4 bg-white dark:bg-pulse-white border border-pulse-grey-subtle dark:border-pulse-grey-subtle rounded-lg hover:bg-pulse-grey-light dark:hover:bg-pulse-grey-light transition-all text-sm font-medium text-pulse-black dark:text-pulse-black shadow-sm hover:shadow-md"
            >
              <LinkedInIcon />
              <span className="hidden sm:inline">LinkedIn</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 bg-white dark:bg-pulse-white text-pulse-grey-text dark:text-pulse-grey-text">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Verification Message */}
          {showVerificationMessage && (
            <Alert className="mb-4 bg-pulse-cyan/10 dark:bg-pulse-cyan/20 border-pulse-cyan/30 dark:border-pulse-cyan/40">
              <Mail className="h-4 w-4 text-pulse-cyan" />
              <AlertDescription className="text-sm">
                <div className="space-y-3">
                  <p className="font-semibold text-pulse-black dark:text-pulse-black">
                    Verification Email Sent!
                  </p>
                  <p className="text-pulse-black/80 dark:text-pulse-black/80">
                    We've sent a verification email to <strong>{userEmail}</strong>. 
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={isLoading}
                      className="text-xs border-pulse-cyan text-pulse-cyan hover:bg-pulse-cyan/10"
                    >
                      {isLoading ? "Sending..." : "Resend Email"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowVerificationMessage(false);
                        navigate("/auth/signin");
                      }}
                      className="text-xs"
                    >
                      Go to Sign In
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5" style={{ display: showVerificationMessage ? 'none' : 'block' }}>
            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm text-pulse-black dark:text-pulse-black">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10 h-11 text-sm bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle"
                  required
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-11 text-sm bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-pulse-black dark:text-pulse-black">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`pl-10 pr-10 h-11 text-sm bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pulse-grey-text dark:text-pulse-grey-text hover:text-pulse-black dark:hover:text-pulse-black transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm text-pulse-black dark:text-pulse-black">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pulse-grey-text dark:text-pulse-grey-text" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`pl-10 pr-10 h-11 text-sm bg-white dark:bg-pulse-white border-pulse-grey-subtle dark:border-pulse-grey-subtle ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pulse-grey-text dark:text-pulse-grey-text hover:text-pulse-black dark:hover:text-pulse-black transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-1.5">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      acceptTerms: checked as boolean,
                    });
                    if (errors.acceptTerms)
                      setErrors({ ...errors, acceptTerms: "" });
                  }}
                  className={`mt-0.5 ${errors.acceptTerms ? "border-red-500" : ""}`}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-xs sm:text-sm text-pulse-black/70 dark:text-pulse-black/80 cursor-pointer leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-pulse-cyan hover:text-pulse-cyan/80 font-semibold"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-pulse-cyan hover:text-pulse-cyan/80 font-semibold"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-xs text-red-500 ml-6">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="text-xs sm:text-sm text-red-500">{errors.submit}</div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-pulse-cyan hover:bg-pulse-cyan/90 text-white font-semibold text-sm sm:text-base rounded-xl transition-all hover-lift shadow-md mt-1"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-5 pt-4 border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle">
            <p className="text-xs sm:text-sm text-pulse-black/70 dark:text-pulse-black/80">
              Already have an account?{" "}
              <Link
                to="/auth/signin"
                className="font-semibold text-pulse-cyan hover:text-pulse-cyan/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

