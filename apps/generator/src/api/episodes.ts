import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Episode {
  id: number;
  slug: string;
  title: string;
  order: number;
  status: string;
}

export interface EpisodeSkill {
  id: number;
  episodeId: number;
  name: string;
}

export const useActiveEpisodes = () => {
  return useQuery<Episode[]>({
    queryKey: ["episodes", "active"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/episodes?status=active`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch episodes");
      return response.json();
    },
  });
};

export const useEpisodeSkills = (episodeId?: number) => {
  return useQuery<EpisodeSkill[]>({
    queryKey: ["episodeSkills", episodeId],
    queryFn: async () => {
      if (!episodeId) return [];
      const response = await fetch(`${apiBaseUrl}/episodes/${episodeId}/skills`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch skills");
      return response.json();
    },
    enabled: !!episodeId,
  });
};
