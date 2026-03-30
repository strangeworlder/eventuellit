import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./base-url";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface Session {
  id: number;
  episodeId: number;
  sessionNumber: number;
  date: string | null;
  status: "planned" | "next" | "played";
  label: string | null;
  gmRecap: string | null;
  recapPublished: boolean;
  createdAt: string;
}

export const useSessions = (episodeId: number, queryEnabled = true) => {
  return useQuery<Session[]>({
    queryKey: ["sessions", episodeId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/sessions?episodeId=${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return response.json();
    },
    enabled: !!episodeId && queryEnabled,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      episodeId: number;
      sessionNumber: number;
      date?: string;
      label?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create session");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", variables.episodeId] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      episodeId,
      ...data
    }: {
      id: number;
      episodeId: number;
      date?: string;
      status?: string;
      label?: string;
      gmRecap?: string;
      recapPublished?: boolean;
    }) => {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update session");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", variables.episodeId] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; episodeId: number }) => {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete session");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", variables.episodeId] });
    },
  });
};

export const useMigrateSessionDates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (episodeId: number) => {
      const response = await fetch(`${API_BASE_URL}/sessions/migrate/${episodeId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to migrate session dates");
      return response.json();
    },
    onSuccess: (_, episodeId) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", episodeId] });
    },
  });
};
