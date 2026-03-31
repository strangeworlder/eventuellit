import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./base-url";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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
    queryKey: ["episodeInvites", episodeId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/episode-invites?episodeId=${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch invites");
      return response.json();
    },
    enabled: !!episodeId,
  });
};

export const useSendInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { episodeId: number; userId: number; message?: string }) => {
      const response = await fetch(`${API_BASE_URL}/episode-invites`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || "Failed to send invite");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episodeInvites", variables.episodeId] });
    },
  });
};
