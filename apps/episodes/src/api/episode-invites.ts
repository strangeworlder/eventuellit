import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

export interface EpisodeInvite {
  id: number;
  episodeId: number;
  userId: number;
  username: string | null;
  status: string;
  message: string | null;
  invitedBy: number;
  createdAt: string;
  respondedAt: string | null;
}

export const useEpisodeInvites = (episodeId: number) => {
  return useQuery<EpisodeInvite[]>({
    queryKey: queryKeys.episodes.invites(episodeId),
    queryFn: () => apiFetch<EpisodeInvite[]>(`/episode-invites?episodeId=${episodeId}`),
    enabled: !!episodeId,
  });
};

export const useSendInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { episodeId: number; userId: number; message?: string }) =>
      apiFetch<EpisodeInvite>("/episode-invites", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.invites(variables.episodeId) });
    },
  });
};
