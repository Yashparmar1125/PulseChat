import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, signInWithEmail, signUpWithEmail, getIdToken } from "@/lib/firebase";
import { authApi } from "../api";
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from "@/services/api.client";
import { connectWebSocket, disconnectWebSocket } from "@/services/websocket/ws-client";
import type { User, LoginCredentials, SignUpData } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const accessToken = getAccessToken();
        
        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
          } catch (err) {
            // Token might be expired, try to refresh
            const refreshToken = getRefreshToken();
            if (refreshToken) {
              try {
                const { accessToken: newToken } = await authApi.refreshToken(refreshToken);
                setTokens(newToken, refreshToken);
                const currentUser = await authApi.getCurrentUser();
                setUser(currentUser);
                localStorage.setItem("user", JSON.stringify(currentUser));
              } catch (refreshErr) {
                // Refresh failed, clear everything
                clearTokens();
                setUser(null);
                setIsAuthenticated(false);
              }
            } else {
              clearTokens();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } catch (err) {
        console.error("Error loading stored user:", err);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        // User signed out
        setUser(null);
        setIsAuthenticated(false);
        clearTokens();
        return;
      }

      // User is signed in, but we need to sync with backend
      // This will be handled by login/register functions
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Sign in with Firebase
      const firebaseUser = await signInWithEmail(credentials.email, credentials.password);
      
      // 2. Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // 3. Send to backend for authentication
      let response;
      try {
        response = await authApi.login({ idToken });
      } catch (apiError: any) {
        // Check if it's a connection error
        if (apiError.message?.includes("Cannot connect to server")) {
          const { testBackendConnection } = await import("@/utils/connection-test");
          const testResult = await testBackendConnection();
          throw new Error(
            `${apiError.message}\n\nConnection test: ${testResult.message}\nURL: ${testResult.url}`
          );
        }
        throw apiError;
      }
      
      // 4. Store tokens and user data
      setTokens(response.accessToken, response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Connect WebSocket after successful login
      try {
        await connectWebSocket();
      } catch (err) {
        console.error("Failed to connect WebSocket:", err);
      }
      
      return { user: response.user, accessToken: response.accessToken };
    } catch (err: any) {
      let errorMessage = err?.message || "Failed to login. Please try again.";
      
      // Handle email not verified error
      if (err?.message === "EMAIL_NOT_VERIFIED") {
        errorMessage = "Please verify your email address before signing in. Check your inbox for the verification email.";
      }
      
      setError(errorMessage);
      const error = new Error(errorMessage);
      (error as any).originalError = err;
      (error as any).emailNotVerified = err?.message === "EMAIL_NOT_VERIFIED";
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Create user with Firebase (this automatically sends verification email)
      const firebaseUser = await signUpWithEmail(data.email, data.password);
      
      // 2. Get Firebase ID token (even if email not verified, we can still register in backend)
      const idToken = await firebaseUser.getIdToken();
      
      // 3. Send to backend for registration
      let response;
      try {
        response = await authApi.register({
          idToken,
          username: data.name,
        });
      } catch (apiError: any) {
        // Check if it's a connection error
        if (apiError.message?.includes("Cannot connect to server")) {
          const { testBackendConnection } = await import("@/utils/connection-test");
          const testResult = await testBackendConnection();
          throw new Error(
            `${apiError.message}\n\nConnection test: ${testResult.message}\nURL: ${testResult.url}`
          );
        }
        throw apiError;
      }
      
      // 4. Store tokens and user data
      setTokens(response.accessToken, response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Connect WebSocket after successful signup
      try {
        await connectWebSocket();
      } catch (err) {
        console.error("Failed to connect WebSocket:", err);
      }
      
      // Return with email verification status
      return { 
        user: response.user, 
        accessToken: response.accessToken,
        emailVerified: firebaseUser.emailVerified,
        needsVerification: !firebaseUser.emailVerified,
      };
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create account. Please try again.";
      setError(errorMessage);
      const error = new Error(errorMessage);
      (error as any).originalError = err;
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { sendVerificationEmail } = await import("@/lib/firebase");
      await sendVerificationEmail();
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to send verification email. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Logout from backend
      await authApi.logout();
    } catch (err) {
      console.error("Backend logout error:", err);
      // Continue with local logout even if backend fails
    }
    
    try {
      // 2. Sign out from Firebase
      const { signOut } = await import("@/lib/firebase");
      await signOut();
    } catch (err) {
      console.error("Firebase logout error:", err);
    }
    
    // 3. Clear local state and storage
    clearTokens();
    localStorage.removeItem("user"); // Extra safety - ensure user is removed
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    
    // Disconnect WebSocket
    disconnectWebSocket();
  }, []);

  const socialLogin = useCallback(async (provider: "google" | "microsoft" | "linkedin") => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { signInWithGoogle, signInWithMicrosoft, signInWithLinkedIn } = await import("@/lib/firebase");
      
      let firebaseUser: FirebaseUser;
      
      switch (provider) {
        case "google":
          firebaseUser = await signInWithGoogle();
          break;
        case "microsoft":
          firebaseUser = await signInWithMicrosoft();
          break;
        case "linkedin":
          firebaseUser = await signInWithLinkedIn();
          break;
        default:
          throw new Error("Unsupported provider");
      }
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Send to backend
      const response = await authApi.socialAuth(provider, idToken);
      
      // Store tokens and user data
      setTokens(response.accessToken, response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Connect WebSocket after successful social login
      try {
        await connectWebSocket();
      } catch (err) {
        console.error("Failed to connect WebSocket:", err);
      }
      
      return { user: response.user, accessToken: response.accessToken };
    } catch (err: any) {
      const errorMessage = err?.message || `Failed to login with ${provider}. Please try again.`;
      setError(errorMessage);
      const error = new Error(errorMessage);
      (error as any).originalError = err;
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    signup,
    logout,
    socialLogin,
    resendVerificationEmail,
  };
}
