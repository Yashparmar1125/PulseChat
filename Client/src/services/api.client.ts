// API client configuration
// Axios/fetch wrapper with interceptors and auth handling

import { config } from "@/config";

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

// Get stored tokens
export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// API request wrapper with automatic token handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const url = `${config.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    console.log(`[API] ${options.method || 'GET'} ${url}`);
    response = await fetch(url, {
      ...options,
      headers,
    });
    console.log(`[API] Response status: ${response.status}`);
  } catch (error: any) {
    // Network error (CORS, connection refused, etc.)
    console.error("[API] Network error:", error);
    console.error("[API] Request URL:", url);
    console.error("[API] Request options:", { method: options.method || 'GET', headers });
    
    if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError") || error.name === "TypeError") {
      const errorMsg = `Cannot connect to server at ${config.apiUrl}.\n\nPlease check:\n1. Backend server is running (port 4000)\n2. CORS is properly configured\n3. Network connection is active\n4. Firewall is not blocking the connection`;
      console.error("[API]", errorMsg);
      throw new Error(errorMsg);
    }
    throw error;
  }

  // Handle token expiration
  if (response.status === 401) {
    const data = await response.json().catch(() => ({}));
    
    // If token expired, try to refresh
    if (data.expired) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        const newToken = getAccessToken();
        if (newToken) {
          headers["Authorization"] = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          if (!retryResponse.ok) {
            throw new Error(`API Error: ${retryResponse.statusText}`);
          }
          return retryResponse.json();
        }
      }
    }
    
    // If refresh failed or no expired flag, clear tokens and throw
    clearTokens();
    throw new Error("Authentication failed. Please log in again.");
  }

  if (!response.ok) {
    let errorMessage = response.statusText;
    
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
      
      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.join(", ");
      }
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText;
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}

// Refresh access token using refresh token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${config.apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

// Helper methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
