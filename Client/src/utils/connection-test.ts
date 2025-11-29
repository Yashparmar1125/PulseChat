// Connection test utility

import { config } from "@/config";

export async function testBackendConnection(): Promise<{
  success: boolean;
  message: string;
  url: string;
}> {
  const healthUrl = config.apiUrl.replace("/api/v1", "/health");
  
  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return {
        success: true,
        message: "Backend server is reachable",
        url: healthUrl,
      };
    } else {
      return {
        success: false,
        message: `Backend responded with status ${response.status}`,
        url: healthUrl,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to connect to backend",
      url: healthUrl,
    };
  }
}



