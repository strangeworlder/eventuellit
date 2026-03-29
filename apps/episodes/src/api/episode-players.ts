import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./base-url";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface EpisodePlayer {
  id: number;
  episodeId: number;
  userId: number;
  username: string | null;
  createdAt: string;
}

export const useEpisodePlayers = (episodeId: number) => {
  return useQuery<EpisodePlayer[]>({
    queryKey: ["episodePlayers", episodeId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/episode-players?episodeId=${episodeId}`,
        { headers: getAuthHeaders(), credentials: "include" },
      );
      if (!response.ok) throw new Error("Failed to fetch episode players");
      return response.json();
    },
    enabled: !!episodeId,
  });
};

export const useEnrollPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ episodeId, userId }: { episodeId: number; userId: number }) => {
      const response = await fetch(`${API_BASE_URL}/episode-players`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ episodeId, userId }),
      });
      if (!response.ok) throw new Error("Failed to enroll player");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episodePlayers", variables.episodeId] });
    },
  });
};

export const useDisenrollPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number; episodeId: number }) => {
      const response = await fetch(`${API_BASE_URL}/episode-players/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to disenroll player");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episodePlayers", variables.episodeId] });
    },
  });
};
