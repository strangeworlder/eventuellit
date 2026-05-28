import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

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
    queryKey: queryKeys.sessions.list(episodeId),
    queryFn: () => apiFetch<Session[]>(`/sessions?episodeId=${episodeId}`),
    enabled: !!episodeId && queryEnabled,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      episodeId: number;
      sessionNumber: number;
      date?: string;
      label?: string;
    }) =>
      apiFetch<Session>("/sessions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.list(variables.episodeId) });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      episodeId,
      ...data
    }: {
      id: number;
      episodeId: number;
      date?: string;
      status?: Session["status"];
      label?: string;
      gmRecap?: string;
      recapPublished?: boolean;
    }) =>
      apiFetch<Session>(`/sessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.list(variables.episodeId) });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; episodeId: number }) => {
      await apiFetch(`/sessions/${id}`, { method: "DELETE" });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.list(variables.episodeId) });
    },
  });
};
