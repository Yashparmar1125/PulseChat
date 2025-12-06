import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { motion } from "framer-motion";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { useAuth } from "@/features/auth";
import { auth } from "@/lib/firebase";
import { sendVerificationEmail, reloadUser } from "@/lib/firebase";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  // Check verification status on mount
  useEffect(() => {
    const checkVerificationStatus = async () => {
      setIsVerifying(true);
      
      try {
        // Get email from URL params or current user
        const emailParam = searchParams.get("email");
        const currentUser = auth.currentUser;
        
        if (emailParam) {
          setEmail(emailParam);
        } else if (currentUser?.email) {
          setEmail(currentUser.email);
        }
        
        // Reload user to get latest verification status
        if (currentUser) {
          await reloadUser();
          const verified = currentUser.emailVerified;
          setIsVerified(verified);
          
          if (verified) {
            // Redirect to chat after a short delay
            setTimeout(() => {
              navigate("/chat");
            }, 2000);
          }
        } else {
          // No user logged in, redirect to sign in
          navigate("/auth/signin");
        }
      } catch (err: any) {
        setError(err.message || "Failed to check verification status");
      } finally {
        setIsVerifying(false);
      }
    };

    checkVerificationStatus();
  }, [navigate, searchParams]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await sendVerificationEmail();
      setSuccess("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAgain = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await reloadUser();
        const verified = currentUser.emailVerified;
        setIsVerified(verified);
        
        if (verified) {
          setSuccess("Email verified! Redirecting...");
          setTimeout(() => {
            navigate("/chat");
          }, 2000);
        } else {
          setError("Email not yet verified. Please check your inbox.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to check verification status");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-pulse-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-pulse-cyan mx-auto mb-4" />
          <p className="text-pulse-black/70 dark:text-pulse-black/80">Checking verification status...</p>
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
              alt="Email verification illustration"
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
              Verify Your <span className="text-pulse-cyan">Email</span>
            </h2>
            <p className="text-base xl:text-lg text-pulse-black/70 dark:text-pulse-black/80 leading-relaxed">
              We've sent a verification link to your email. Click the link to verify your account and start using PulseChat.
            </p>
            <div className="flex items-center gap-2 text-sm text-pulse-grey-text dark:text-pulse-grey-text pt-2">
              <Mail className="w-4 h-4 text-pulse-cyan" />
              <span>Secure email verification</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-8 xl:p-12 bg-white dark:bg-pulse-white overflow-y-auto">
        <div className="w-full max-w-md py-6">
          {/* Mobile Logo */}
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

          {/* Verification Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-pulse-black dark:text-pulse-black mb-2 tracking-tight">
                {isVerified ? "Email Verified!" : "Verify Your Email"}
              </h1>
              <p className="text-sm sm:text-base text-pulse-black/70 dark:text-pulse-black/80">
                {isVerified 
                  ? "Your email has been verified successfully."
                  : "We need to verify your email address to continue."
                }
              </p>
            </div>

            {/* Success Message */}
            {isVerified && (
              <Alert className="mb-6 border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Your email has been verified! Redirecting you to the chat...
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {success && !error && (
              <Alert className="mb-6 border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Display */}
            {email && (
              <div className="mb-6 p-4 bg-pulse-grey-light/50 dark:bg-pulse-grey-light/30 rounded-xl border border-pulse-grey-subtle/50 dark:border-pulse-grey-subtle/30">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pulse-cyan" />
                  <div>
                    <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text mb-1">Verification email sent to:</p>
                    <p className="text-sm font-medium text-pulse-black dark:text-pulse-black">{email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isVerified && (
              <div className="mb-6 space-y-3">
                <div className="p-4 bg-pulse-grey-light/30 dark:bg-pulse-grey-light/10 rounded-xl border border-pulse-grey-subtle/30">
                  <h3 className="text-sm font-semibold text-pulse-black dark:text-pulse-black mb-2">
                    Next Steps:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-sm text-pulse-black/70 dark:text-pulse-black/80">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the verification link in the email</li>
                    <li>Return here and click "Check Again"</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isVerified && (
                <>
                  <Button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-br from-pulse-cyan to-pulse-cyan/90 hover:from-pulse-cyan/90 hover:to-pulse-cyan/80 text-white shadow-lg shadow-pulse-cyan/30 hover:shadow-pulse-cyan/40 transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleCheckAgain}
                    disabled={isVerifying}
                    variant="outline"
                    className="w-full h-11 border-pulse-grey-subtle dark:border-pulse-grey-subtle hover:bg-pulse-grey-light/50 dark:hover:bg-pulse-grey-light/30"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Again"
                    )}
                  </Button>
                </>
              )}

              <Button
                onClick={() => navigate("/auth/signin")}
                variant="ghost"
                className="w-full h-11 text-pulse-grey-text dark:text-pulse-grey-text hover:bg-pulse-grey-light/50 dark:hover:bg-pulse-grey-light/30"
              >
                Back to Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}





