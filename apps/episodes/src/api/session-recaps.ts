import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

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
    queryKey: queryKeys.sessions.recaps(sessionId),
    queryFn: () => apiFetch<SessionPlayerRecap[]>(`/session-recaps?sessionId=${sessionId}`),
    enabled: !!sessionId && enabled,
  });
};

export const useUpsertSessionRecap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      sessionId: number;
      journal?: string;
      highlight?: string;
      surprise?: string;
      mvp?: string;
    }) =>
      apiFetch<SessionPlayerRecap>("/session-recaps", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.recaps(variables.sessionId) });
    },
  });
};

export const useDeleteSessionRecap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; sessionId: number }) => {
      await apiFetch(`/session-recaps/${id}`, { method: "DELETE" });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.recaps(variables.sessionId) });
    },
  });
};
