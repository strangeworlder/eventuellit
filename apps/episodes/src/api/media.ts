import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./base-url";

export interface MediaRecord {
  id: number;
  key: string;
  filename: string;
  width: number;
  height: number;
  context: string;
  mimeType: string;
  alt: string;
  createdAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/** Fetch all media records, optionally filtered by context. */
export const useMediaList = (context?: string) => {
  return useQuery<MediaRecord[]>({
    queryKey: ["media", context],
    queryFn: async () => {
      const url = context
        ? `${API_BASE_URL}/media?context=${context}`
        : `${API_BASE_URL}/media`;
      const response = await fetch(url, {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch media");
      return response.json();
    },
  });
};

interface UploadMediaResult extends MediaRecord {
  publicUrl: string;
}

/** Upload a file to the media endpoint with server-side optimization. */
export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<UploadMediaResult, Error, { file: File; context: string; alt?: string }>({
    mutationFn: async ({ file, context, alt }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("context", context);
      if (alt) formData.append("alt", alt);

      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};
