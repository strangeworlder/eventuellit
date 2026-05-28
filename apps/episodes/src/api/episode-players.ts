import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

export interface EpisodePlayer {
  id: number;
  episodeId: number;
  userId: number;
  username: string | null;
  createdAt: string;
}

export const useEpisodePlayers = (episodeId: number) => {
  return useQuery<EpisodePlayer[]>({
    queryKey: queryKeys.episodes.players(episodeId),
    queryFn: () => apiFetch<EpisodePlayer[]>(`/episode-players?episodeId=${episodeId}`),
    enabled: !!episodeId,
  });
};

export const useEnrollPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ episodeId, userId }: { episodeId: number; userId: number }) =>
      apiFetch<EpisodePlayer>("/episode-players", {
        method: "POST",
        body: JSON.stringify({ episodeId, userId }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.players(variables.episodeId) });
    },
  });
};

export const useDisenrollPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; episodeId: number }) => {
      await apiFetch(`/episode-players/${id}`, { method: "DELETE" });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.players(variables.episodeId) });
    },
  });
};
