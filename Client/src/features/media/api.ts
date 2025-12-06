// Media/File Upload API endpoints

import { api } from "@/services/api.client";

export interface UploadFileResponse {
  id: string;
  url: string;
  objectKey: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface FileMetadata {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export const mediaApi = {
  // Upload a file
  uploadFile: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  // Get file metadata
  getFile: async (fileId: string): Promise<FileMetadata> => {
    return api.get<FileMetadata>(`/media/${fileId}`);
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/media/${fileId}`);
  },
};







