/**
 * Normalize file URL to absolute URL
 * Converts relative URLs (starting with /) to absolute URLs using the API base URL
 */
export function normalizeFileUrl(url: string | undefined | null): string {
  if (!url) return "";
  
  // If already absolute URL, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // If relative URL, make it absolute
  if (url.startsWith("/")) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
    // Remove trailing slash from apiUrl if present
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    return `${baseUrl}${url}`;
  }
  
  return url;
}





