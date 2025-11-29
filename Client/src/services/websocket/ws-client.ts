// WebSocket client for Socket.IO connection

import { io, Socket } from "socket.io-client";
import { config } from "@/config";
import { auth } from "@/lib/firebase";

let socket: Socket | null = null;

export async function connectWebSocket(): Promise<Socket> {
  // If already connected, return existing socket
  if (socket?.connected) {
    console.log("[WebSocket] ✅ Reusing existing connection:", socket.id);
    return socket;
  }
  
  // If socket exists but not connected, disconnect it first
  if (socket && !socket.connected) {
    console.log("[WebSocket] ⚠️ Existing socket not connected, disconnecting...");
    socket.disconnect();
    socket = null;
  }

  if (!auth?.currentUser) {
    throw new Error("No user authenticated");
  }

  // Get Firebase ID token for socket authentication
  let idToken: string;
  try {
    idToken = await auth.currentUser.getIdToken();
    if (!idToken) {
      throw new Error("No Firebase ID token available");
    }
  } catch (err: any) {
    throw new Error(`Failed to get Firebase token: ${err.message}`);
  }

  // Convert ws:// to http:// for Socket.IO (it handles the protocol internally)
  const wsUrl = config.wsUrl.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:');
  
  console.log("[WebSocket] Connecting to:", wsUrl);
  
  socket = io(wsUrl, {
    auth: {
      token: idToken,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000,
    forceNew: false, // Reuse existing connection if available
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("WebSocket connection timeout"));
    }, 20000);

    socket!.on("connect", () => {
      clearTimeout(timeout);
      console.log("✅ WebSocket connected:", socket?.id);
      resolve(socket!);
    });

    socket!.on("disconnect", (reason) => {
      console.log("⚠️ WebSocket disconnected:", reason);
    });

    socket!.on("connect_error", (error) => {
      clearTimeout(timeout);
      console.error("❌ WebSocket connection error:", error.message);
      reject(new Error(`WebSocket connection failed: ${error.message}`));
    });

    socket!.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });
  });
}

export function disconnectWebSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

// Reconnect with new token
export async function reconnectWebSocket(): Promise<Socket> {
  disconnectWebSocket();
  return connectWebSocket();
}
