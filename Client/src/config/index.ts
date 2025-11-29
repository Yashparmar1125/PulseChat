// Environment-aware configuration
// Feature flags, constants
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:3000",
  env: import.meta.env.MODE,
};

