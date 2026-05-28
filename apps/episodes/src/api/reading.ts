import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

export interface ReadingItem {
  id: number;
  episodeId: number;
  sessionId: number | null;
  contentType: "world" | "ruleset" | "custom" | "task";
  contentRef: string | null;
  title: string;
  description: string | null;
  url: string | null;
  orderIndex: number;
  autoSuggested: boolean;
  createdAt: string;
  completed: boolean;
}

export interface SuggestedItem {
  contentType: "world" | "ruleset";
  contentRef: string;
  title: string;
  description?: string;
  url: string;
  reason: string;
  autoSuggested: true;
}

export interface EpisodeProgressEntry {
  userId: number;
  username: string | null;
  completedCount: number;
  totalCount: number;
  completedItemIds: number[];
}

export const useEpisodeReadingItems = (episodeId: number, sessionId?: number) => {
  return useQuery<ReadingItem[]>({
    queryKey: queryKeys.reading.items(episodeId, sessionId),
    queryFn: () => {
      const params = new URLSearchParams({ episodeId: String(episodeId) });
      if (sessionId !== undefined) params.set("sessionId", String(sessionId));
      return apiFetch<ReadingItem[]>(`/reading-items?${params}`);
    },
    enabled: !!episodeId,
  });
};

export const useReadingSuggestions = (episodeId: number, enabled: boolean, sessionId?: number) => {
  return useQuery<SuggestedItem[]>({
    queryKey: queryKeys.reading.suggestions(episodeId, sessionId),
    queryFn: () => {
      const params = new URLSearchParams();
      if (sessionId !== undefined) params.set("sessionId", String(sessionId));
      const qs = params.toString();
      return apiFetch<SuggestedItem[]>(`/reading-items/suggestions/${episodeId}${qs ? `?${qs}` : ""}`);
    },
    enabled: !!episodeId && enabled,
  });
};

export const useCreateReadingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      episodeId: number;
      sessionId?: number;
      contentType: ReadingItem["contentType"];
      contentRef?: string;
      title: string;
      description?: string;
      url?: string;
      autoSuggested?: boolean;
    }) =>
      apiFetch<ReadingItem>("/reading-items", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reading.items(variables.episodeId) });
    },
  });
};

export const useUpdateReadingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      episodeId,
      ...data
    }: {
      id: number;
      episodeId: number;
      sessionId?: number;
      title?: string;
      description?: string;
      url?: string;
      orderIndex?: number;
    }) =>
      apiFetch<ReadingItem>(`/reading-items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reading.items(variables.episodeId) });
    },
  });
};

export const useDeleteReadingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; episodeId: number }) => {
      await apiFetch(`/reading-items/${id}`, { method: "DELETE" });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reading.items(variables.episodeId) });
    },
  });
};

export const useEpisodeProgress = (episodeId: number) => {
  return useQuery<EpisodeProgressEntry[]>({
    queryKey: queryKeys.episodes.progress(episodeId),
    queryFn: () => apiFetch<EpisodeProgressEntry[]>(`/reading-progress/episode/${episodeId}`),
    enabled: !!episodeId,
  });
};
