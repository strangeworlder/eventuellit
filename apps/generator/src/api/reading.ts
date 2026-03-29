import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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

export const useEpisodeReadingItems = (episodeId: number | null, sessionId?: number) => {
  return useQuery<ReadingItem[]>({
    queryKey: ["readingItems", episodeId, sessionId],
    queryFn: async () => {
      if (!episodeId) return [];
      const params = new URLSearchParams({ episodeId: String(episodeId) });
      if (sessionId !== undefined) params.set("sessionId", String(sessionId));
      const response = await fetch(`${apiBaseUrl}/reading-items?${params}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reading items");
      return response.json();
    },
    enabled: !!episodeId,
  });
};

export const useToggleReadingProgress = () => {
  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: async (readingItemId: number) => {
      const response = await fetch(`${apiBaseUrl}/reading-progress`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ readingItemId }),
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readingItems"] });
    },
  });

  const unmarkRead = useMutation({
    mutationFn: async (readingItemId: number) => {
      const response = await fetch(`${apiBaseUrl}/reading-progress/${readingItemId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to unmark read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readingItems"] });
    },
  });

  const toggle = (item: ReadingItem) => {
    if (item.completed) {
      unmarkRead.mutate(item.id);
    } else {
      markRead.mutate(item.id);
    }
  };

  return { toggle, isPending: markRead.isPending || unmarkRead.isPending };
};

export const useReadingSuggestions = (episodeId: number | null, enabled: boolean) => {
  return useQuery<SuggestedItem[]>({
    queryKey: ["readingSuggestions", episodeId],
    queryFn: async () => {
      if (!episodeId) return [];
      const response = await fetch(`${apiBaseUrl}/reading-items/suggestions/${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      return response.json();
    },
    enabled: !!episodeId && enabled,
  });
};

export const useCreateReadingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      episodeId: number;
      contentType: string;
      contentRef?: string;
      title: string;
      description?: string;
      url?: string;
      autoSuggested?: boolean;
    }) => {
      const response = await fetch(`${apiBaseUrl}/reading-items`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create reading item");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["readingItems", variables.episodeId] });
    },
  });
};

export const useUpdateReadingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      episodeId,
      ...data
    }: {
      id: number;
      episodeId: number;
      contentType?: string;
      contentRef?: string;
      title?: string;
      description?: string;
      url?: string;
      orderIndex?: number;
    }) => {
      const response = await fetch(`${apiBaseUrl}/reading-items/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update reading item");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["readingItems", variables.episodeId] });
    },
  });
};

export const useDeleteReadingItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; episodeId: number }) => {
      const response = await fetch(`${apiBaseUrl}/reading-items/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete reading item");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["readingItems", variables.episodeId] });
    },
  });
};

export const useEpisodeProgress = (episodeId: number | null) => {
  return useQuery<EpisodeProgressEntry[]>({
    queryKey: ["episodeProgress", episodeId],
    queryFn: async () => {
      if (!episodeId) return [];
      const response = await fetch(`${apiBaseUrl}/reading-progress/episode/${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch episode progress");
      return response.json();
    },
    enabled: !!episodeId,
  });
};
