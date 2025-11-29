// Environment-aware configuration
// Feature flags, constants
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:4000",
  env: import.meta.env.MODE,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  },
};

