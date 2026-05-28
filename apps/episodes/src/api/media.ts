import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, apiUpload } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

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

/** Fetch all media records, optionally filtered by context. */
export const useMediaList = (context?: string) => {
  return useQuery<MediaRecord[]>({
    queryKey: queryKeys.media.list(context),
    queryFn: () => {
      const params = context ? `?context=${context}` : "";
      return apiFetch<MediaRecord[]>(`/media${params}`);
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
    mutationFn: ({ file, context, alt }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("context", context);
      if (alt) formData.append("alt", alt);
      return apiUpload<UploadMediaResult>("/media/upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
    },
  });
};
