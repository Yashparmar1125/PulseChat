// Firebase configuration and initialization

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { config } from "@/config";

// Firebase configuration
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
};

// Validate Firebase config
const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured()) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase is not configured. Please set up your Firebase environment variables.");
}

// Export auth with null check
export { auth };

if (!auth) {
  console.error("Firebase Auth is not initialized. Please configure Firebase.");
}

// Auth providers (only if auth is initialized)
export const googleProvider = auth ? new GoogleAuthProvider() : null;
export const microsoftProvider = auth ? new OAuthProvider("microsoft.com") : null;
export const linkedInProvider = auth ? new OAuthProvider("linkedin.com") : null;

// Helper to get user-friendly error messages
const getFirebaseErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";
  
  const code = error.code || "";
  const message = error.message || "";
  
  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password.";
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed. Please try again.";
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    default:
      return message || "Authentication failed. Please try again.";
  }
};

// Auth functions with error handling
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      // Reload user to get latest verification status
      await userCredential.user.reload();
      
      if (!userCredential.user.emailVerified) {
        throw new Error("EMAIL_NOT_VERIFIED");
      }
    }
    
    return userCredential.user;
  } catch (error: any) {
    // If it's our custom error, throw it as is
    if (error.message === "EMAIL_NOT_VERIFIED") {
      throw error;
    }
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Send email verification
    if (userCredential.user && !userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user, {
        url: window.location.origin + "/auth/verify-email",
      });
    }
    
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// Send email verification
export const sendVerificationEmail = async () => {
  if (!auth) {
    throw new Error("Firebase is not configured.");
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }
  if (user.emailVerified) {
    throw new Error("Email is already verified.");
  }
  try {
    await sendEmailVerification(user, {
      url: window.location.origin + "/auth/verify-email",
    });
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// Check if email is verified
export const isEmailVerified = (): boolean => {
  if (!auth) return false;
  const user = auth.currentUser;
  return user?.emailVerified || false;
};

// Reload user to get updated email verification status
export const reloadUser = async () => {
  if (!auth) {
    throw new Error("Firebase is not configured.");
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }
  await user.reload();
  return user;
};

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const signInWithMicrosoft = async () => {
  if (!auth || !microsoftProvider) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return result.user;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const signInWithLinkedIn = async () => {
  if (!auth || !linkedInProvider) {
    throw new Error("Firebase is not configured. Please set up your environment variables.");
  }
  try {
    const result = await signInWithPopup(auth, linkedInProvider);
    return result.user;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const signOut = async () => {
  if (!auth) {
    throw new Error("Firebase is not configured.");
  }
  await firebaseSignOut(auth);
};

export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  if (!auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(forceRefresh);
};

export default app;

