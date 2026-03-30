import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./base-url";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface SessionPlayerRecap {
  id: number;
  sessionId: number;
  userId: number;
  username: string | null;
  journal: string | null;
  highlight: string | null;
  surprise: string | null;
  mvp: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useSessionRecaps = (sessionId: number, enabled = true) => {
  return useQuery<SessionPlayerRecap[]>({
    queryKey: ["sessionRecaps", sessionId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/session-recaps?sessionId=${sessionId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch session recaps");
      return response.json();
    },
    enabled: !!sessionId && enabled,
  });
};

export const useUpsertSessionRecap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sessionId: number;
      journal?: string;
      highlight?: string;
      surprise?: string;
      mvp?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/session-recaps`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save recap");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessionRecaps", variables.sessionId] });
    },
  });
};

export const useDeleteSessionRecap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sessionId: _sessionId }: { id: number; sessionId: number }) => {
      const response = await fetch(`${API_BASE_URL}/session-recaps/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete recap");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessionRecaps", variables.sessionId] });
    },
  });
};
